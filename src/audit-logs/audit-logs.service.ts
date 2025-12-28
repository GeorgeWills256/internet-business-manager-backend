import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepo: Repository<AuditLog>,
  ) {}

  async log(
    action: string,
    actorId?: number,
    details?: Record<string, any>,
  ) {
    const entry = this.auditRepo.create({
      action,
      actorId,
      details,
    });

    return this.auditRepo.save(entry);
  }
}