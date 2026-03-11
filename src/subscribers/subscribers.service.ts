import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscriber } from '../entities/subscriber.entity';
import { Manager } from '../entities/manager.entity';
import { AfricasTalkingService } from '../africas-talking/africas-talking.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class SubscribersService {
  private readonly logger = new Logger(SubscribersService.name);

  constructor(
    @InjectRepository(Subscriber)
    private readonly subscribersRepo: Repository<Subscriber>,

    @InjectRepository(Manager)
    private readonly managersRepo: Repository<Manager>,

    private readonly sms: AfricasTalkingService,
    private readonly auditLogs: AuditLogsService,
  ) {}

  /** REGISTER */
  async register(dto: { phone: string; managerId: number }) {
    const manager = await this.managersRepo.findOneBy({
      id: dto.managerId,
    });

    if (!manager)
      throw new NotFoundException('Manager not found');

    const subscriber = this.subscribersRepo.create({
      phone: dto.phone,
      manager,
      active: false,
    });

    return this.subscribersRepo.save(subscriber);
  }

  /** ACTIVATE */
  async activate(dto: {
    subscriberId: number;
    days: number;
    source: 'payment' | 'code';
  }) {
    const subscriber = await this.subscribersRepo.findOne({
      where: { id: dto.subscriberId },
      relations: ['manager'],
    });

    if (!subscriber)
      throw new NotFoundException('Subscriber not found');

    if (dto.days < 1)
      throw new BadRequestException('Invalid duration');

    const expiry = new Date(
      Date.now() + dto.days * 86400000,
    );

    subscriber.daysPurchased = dto.days;
    subscriber.expiryDate = expiry;
    subscriber.active = true;

    await this.subscribersRepo.save(subscriber);

    await this.auditLogs.log(
      'SUBSCRIBER_ACTIVATED',
      subscriber.manager.id,
      {
        subscriberId: subscriber.id,
        days: dto.days,
        source: dto.source,
      },
    );

    try {
      await this.sms.sendSMS(
        subscriber.phone,
        `Activated for ${dto.days} day(s). Expiry: ${expiry.toISOString()}`,
      );
    } catch {}

    return { ok: true };
  }

  /** TOGGLE STATUS */
  async toggleStatus(id: number, user: any) {
    const subscriber =
      await this.subscribersRepo.findOne({
        where: { id },
        relations: ['manager'],
      });

    if (!subscriber)
      throw new NotFoundException(
        'Subscriber not found',
      );

    if (
      user.role === 'MANAGER' &&
      subscriber.manager.id !== user.id
    ) {
      throw new ForbiddenException(
        'You can only modify your subscribers',
      );
    }

    subscriber.active = !subscriber.active;

    await this.subscribersRepo.save(subscriber);

    return {
      ok: true,
      subscriberId: subscriber.id,
      active: subscriber.active,
    };
  }

  /** ADVANCED LIST */
  async list(query: any, user: any) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const qb = this.subscribersRepo
      .createQueryBuilder('subscriber')
      .leftJoinAndSelect('subscriber.manager', 'manager')
      .where('subscriber.deletedAt IS NULL');

    if (user.role === 'MANAGER') {
      qb.andWhere('manager.id = :managerId', {
        managerId: user.id,
      });
    }

    if (query.search) {
      qb.andWhere('subscriber.phone ILIKE :search', {
        search: `%${query.search}%`,
      });
    }

    if (query.status) {
      const isActive =
        query.status.toUpperCase() === 'ACTIVE';
      qb.andWhere('subscriber.active = :active', {
        active: isActive,
      });
    }

    if (query.startDate) {
      qb.andWhere(
        'subscriber.createdAt >= :startDate',
        { startDate: query.startDate },
      );
    }

    if (query.endDate) {
      qb.andWhere(
        'subscriber.createdAt <= :endDate',
        { endDate: query.endDate },
      );
    }

    const allowedSortFields = [
      'id',
      'phone',
      'createdAt',
      'expiryDate',
    ];

    const sortField = allowedSortFields.includes(
      query.sortBy,
    )
      ? query.sortBy
      : 'id';

    const order =
      query.sortOrder === 'ASC' ? 'ASC' : 'DESC';

    qb.orderBy(`subscriber.${sortField}`, order)
      .skip(skip)
      .take(limit);

    const [items, total] =
      await qb.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
    };
  }

  /** STATS */
  async getStats(user: any) {
    const qb = this.subscribersRepo
      .createQueryBuilder('subscriber')
      .leftJoin('subscriber.manager', 'manager')
      .where('subscriber.deletedAt IS NULL');

    if (user.role === 'MANAGER') {
      qb.andWhere('manager.id = :managerId', {
        managerId: user.id,
      });
    }

    const total = await qb.getCount();

    const active = await qb
      .clone()
      .andWhere('subscriber.active = true')
      .getCount();

    const expired = await qb
      .clone()
      .andWhere(
        'subscriber.expiryDate < NOW()',
      )
      .getCount();

    return { total, active, expired };
  }

  /** GET ONE */
  async getOne(id: number, user: any) {
    const subscriber =
      await this.subscribersRepo.findOne({
        where: { id },
        relations: ['manager'],
      });

    if (!subscriber)
      throw new NotFoundException(
        'Subscriber not found',
      );

    if (
      user.role === 'MANAGER' &&
      subscriber.manager.id !== user.id
    ) {
      throw new ForbiddenException();
    }

    return subscriber;
  }

  /** UPDATE */
  async updateSubscriber(
    id: number,
    dto: any,
    user: any,
  ) {
    const subscriber =
      await this.subscribersRepo.findOne({
        where: { id },
        relations: ['manager'],
      });

    if (!subscriber)
      throw new NotFoundException(
        'Subscriber not found',
      );

    if (
      user.role === 'MANAGER' &&
      subscriber.manager.id !== user.id
    ) {
      throw new ForbiddenException(
        'You can only edit your subscribers',
      );
    }

    Object.assign(subscriber, dto);

    return this.subscribersRepo.save(
      subscriber,
    );
  }

  /** SOFT DELETE */
  async softDelete(id: number, user: any) {
    const subscriber =
      await this.subscribersRepo.findOne({
        where: { id },
        relations: ['manager'],
      });

    if (!subscriber)
      throw new NotFoundException();

    if (
      user.role === 'MANAGER' &&
      subscriber.manager.id !== user.id
    ) {
      throw new ForbiddenException();
    }

    await this.subscribersRepo.softDelete(id);

    return { ok: true };
  }
}