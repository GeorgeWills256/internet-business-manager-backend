import {
  IsNumber,
  Min,
  IsOptional,
  IsEnum,
  IsString,
} from 'class-validator';

/**
 * PAYMENT METHOD
 */
export enum PaymentMethod {
  MOBILE = 'mobile',
  CASH = 'cash',
}

/**
 * PRICING PACKAGE
 */
export enum PricingPackage {
  TWO_HOURS = '2H',
  FOUR_HOURS = '4H',
  ONE_DAY = '1D',
  SEVEN_DAYS = '7D',
  THIRTY_DAYS = '30D',
}

export class ProcessPaymentDto {
  /**
   * Manager receiving the payment
   */
  @IsNumber()
  @Min(1)
  managerId: number;

  /**
   * Optional subscriber (direct activation)
   */
  @IsOptional()
  @IsNumber()
  subscriberId?: number;

  /**
   * Optional captive portal session
   */
  @IsOptional()
  @IsString()
  portalSessionId?: string;

  /**
   * Internet package (AUTO PRICED)
   */
  @IsEnum(PricingPackage)
  package: PricingPackage;

  /**
   * Number of devices (default = 1)
   */
  @IsOptional()
  @IsNumber()
  @Min(1)
  devices?: number;

  /**
   * Payment method
   */
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  /**
   * Required for mobile money
   */
  @IsOptional()
  @IsString()
  mobileReference?: string;
}