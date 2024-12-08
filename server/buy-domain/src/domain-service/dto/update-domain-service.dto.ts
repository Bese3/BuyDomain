import { PartialType } from '@nestjs/mapped-types';
import { CreateDomainServiceDto } from './create-domain-service.dto';

export class UpdateDomainServiceDto extends PartialType(CreateDomainServiceDto) {}
