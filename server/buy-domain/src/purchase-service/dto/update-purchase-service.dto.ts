import { PartialType } from '@nestjs/mapped-types';
import { CreatePurchaseServiceDto } from './create-purchase-service.dto';

export class UpdatePurchaseServiceDto extends PartialType(CreatePurchaseServiceDto) {}
