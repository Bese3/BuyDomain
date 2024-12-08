import { Module } from '@nestjs/common';
import { DomainServiceService } from './domain-service.service';
import { DomainServiceController } from './domain-service.controller';


@Module({
  controllers: [DomainServiceController],
  providers: [DomainServiceService],
})
export class DomainServiceModule {}
