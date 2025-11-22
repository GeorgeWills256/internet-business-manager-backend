import { Injectable } from '@nestjs/common';
import { CreateManagerDto } from './dto/create-manager.dto';

@Injectable()
export class ManagersService {
  private managers = [];
  private nextId = 1;

  create(dto: CreateManagerDto) {
    const manager = { id: this.nextId++, name: dto.name, phone: dto.phone, pendingServiceFee: 0 };
    this.managers.push(manager);
    return manager;
  }

  findAll() {
    return this.managers;
  }

  addServiceFee(managerId, amount) {
    const manager = this.managers.find(m => m.id === managerId);
    if (!manager) throw new Error('Manager not found');
    manager.pendingServiceFee = (manager.pendingServiceFee || 0) + amount;
    return manager.pendingServiceFee;
  }

  clearServiceFee(managerId) {
    const manager = this.managers.find(m => m.id === managerId);
    if (!manager) throw new Error('Manager not found');
    manager.pendingServiceFee = 0;
    return manager.pendingServiceFee;
  }

  getById(id) {
    return this.managers.find(m => m.id === id);
  }
}