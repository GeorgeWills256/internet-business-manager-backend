export class CreatePaymentDto {
  subscriberId: number;
  managerId: number;
  amount: number;
  paymentMethod: 'MTN' | 'Airtel' | 'Cash';
}