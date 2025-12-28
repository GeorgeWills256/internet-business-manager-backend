import { IsNumber, Min, IsOptional, IsEnum } from 'class-validator';

export enum PaymentMethod {
  MOBILE = 'mobile',
  CASH = 'cash',
}

export class ProcessPaymentDto {
  @IsNumber()
  @Min(1)
  managerId: number;

  @IsOptional()
  @IsNumber()
  subscriberId?: number;

  @IsNumber()
  @Min(1)
  days: number;

  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsOptional()
  mobileReference?: string;
}