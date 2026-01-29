import { IsNumber, IsString, IsOptional, Min } from 'class-validator';

export class MockPaymentDto {
  @IsNumber()
  managerId: number;

  @IsOptional()
  @IsNumber()
  subscriberId?: number;

  @IsOptional()
  @IsString()
  portalSessionId?: string;

  @IsNumber()
  @Min(1)
  days: number;

  @IsOptional()
  @IsString()
  reference?: string;
}