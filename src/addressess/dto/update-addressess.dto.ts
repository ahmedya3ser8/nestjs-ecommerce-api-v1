import { PartialType } from '@nestjs/mapped-types';
import { CreateAddressessDto } from './create-addressess.dto';

export class UpdateAddressessDto extends PartialType(CreateAddressessDto) {}
