import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DomainServiceService } from './domain-service.service';
import { CreateDomainServiceDto } from './dto/create-domain-service.dto';
import { UpdateDomainServiceDto } from './dto/update-domain-service.dto';

@Controller('domain')
export class DomainServiceController {
  constructor(private readonly domainServiceService: DomainServiceService) {}

  @Get('search-domain/:domain')
  findOne(@Param('domain') domain: string) {
    return this.domainServiceService.findOne(domain);
  }

  @Delete(':email')
  remove(@Param('email') email: string, @Query('domain') domain: string) {
    return this.domainServiceService.remove(email, domain);
  }
}
