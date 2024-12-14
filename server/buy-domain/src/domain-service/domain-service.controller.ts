import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res } from '@nestjs/common';
import { DomainServiceService } from './domain-service.service';
import { CreateDomainServiceDto } from './dto/create-domain-service.dto';
import { UpdateDomainServiceDto } from './dto/update-domain-service.dto';
import { Response } from 'express';

@Controller('domain')
export class DomainServiceController {
  constructor(private readonly domainServiceService: DomainServiceService) {}

  @Get('search-domain/:domain')
  async findOne(@Param('domain') domain: string, @Res() res: Response) {
    try {
        const response = await this.domainServiceService.findOne(domain);
        return res.status(200).json(response);
    } catch(err) {
      return res.status(500).json({
        status: false,
        message: err.message
      });
    }
  }

  @Delete(':email')
  remove(@Param('email') email: string, @Query('domain') domain: string) {
    return this.domainServiceService.remove(email, domain);
  }
}
