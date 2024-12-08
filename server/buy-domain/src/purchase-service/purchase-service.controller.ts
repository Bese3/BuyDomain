import { Controller, Post, Body, Res } from '@nestjs/common';
import { PurchaseServiceService } from './purchase-service.service';
import { CreatePurchaseServiceDto } from './dto/create-purchase-service.dto';
import { Response } from 'express';

@Controller('purchase')
export class PurchaseServiceController {
  constructor(private readonly purchaseServiceService: PurchaseServiceService) {}

  @Post()
  async create(@Body() createPurchaseServiceDto: CreatePurchaseServiceDto,
    @Res() res: Response) {
      try {
        const response = await this.purchaseServiceService.create(createPurchaseServiceDto);
        return res.status(201).json(response)
      } catch(err) {
        console.log(err)
        return res.status(err.status).json({
          status: false,
          message: err.response
        })
      }
  }

}
