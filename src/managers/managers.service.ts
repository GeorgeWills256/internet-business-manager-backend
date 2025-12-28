import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Manager } from '../entities/manager.entity';
import { CreateManagerDto } from './dto/create-manager.dto';

@Injectable()
export class ManagersService {
  private readonly logger = new Logger(ManagersService.name);

  constructor(
    @InjectRepository(Manager)
    private readonly managersRepo: Repository<Manager>,
  ) {}

  async create(dto: CreateManagerDto) {
    const manager = this.managersRepo.create({
      phone: dto.phone,
      username: dto.username,
    });

    this.logger.log(`Creating manager with phone ${dto.phone}`);
    return this.managersRepo.save(manager);
  }

  async findAll() {
    return this.managersRepo.find();
  }

  async getById(id: number) {
    const manager = await this.managersRepo.findOneBy({ id });
    if (!manager) {
      this.logger.warn(`Manager not found: ${id}`);
      throw new NotFoundException('Manager not found');
    }
    return manager;
  }

  async addServiceFee(managerId: number, amount: number) {
    const manager = await this.getById(managerId);

    manager.pendingWeeklyFee =
      (manager.pendingWeeklyFee ?? 0) + amount;

    await this.managersRepo.save(manager);

    this.logger.log(
      `Added service fee ${amount} to manager ${managerId}`,
    );

    return manager.pendingWeeklyFee;
  }

  async clearServiceFee(managerId: number) {
    const manager = await this.getById(managerId);

    manager.pendingWeeklyFee = 0;
    manager.pendingGraceExpiry = null;

    await this.managersRepo.save(manager);

    this.logger.log(`Cleared service fee for manager ${managerId}`);
    return 0;
  }
}