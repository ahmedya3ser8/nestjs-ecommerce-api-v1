import { IsEnum, IsNotEmpty } from 'class-validator';

import { PaymentStatusType } from '../../utils/enums';

export class UpdatePaymentOrderStatusDto {
  @IsEnum(PaymentStatusType)
  @IsNotEmpty()
  paymentStatus: PaymentStatusType;
}
