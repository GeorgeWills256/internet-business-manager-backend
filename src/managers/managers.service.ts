import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Manager } from '../entities/manager.entity';
import { CreateManagerDto } from './dto/create-manager.dto';

@Injectable()
export class ManagersService {
  constructor(
    @InjectRepository(Manager)
    private readonly repo: Repository<Manager>,
  ) {}

  async create(dto: CreateManagerDto) {
    const manager = this.repo.create({
      phone: dto.phone,
      username: dto.username,
      // Ensure required businessName column has a value
      businessName: dto.username ?? dto.phone ?? 'Unnamed Business',
      isManager: true,
      isAdmin: false,
    } as Partial<Manager>);

    return this.repo.save(manager);
  }

  async findAll() {
    return this.repo.find();
  }

  async findById(id: number) {
    const m = await this.repo.findOne({ where: { id } });
    if (!m) throw new NotFoundException('Manager not found');
    return m;
  }
}
