import { IsEnum, IsNotEmpty } from 'class-validator';

import { OrderStatusType } from 'src/utils/enums';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatusType)
  @IsNotEmpty()
  orderStatus: OrderStatusType;
}
