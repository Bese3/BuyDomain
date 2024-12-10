import { Controller, Post, Body, Res, Query, Patch } from '@nestjs/common';
import { PurchaseServiceService } from './purchase-service.service';
import { CreatePurchaseServiceDto } from './dto/create-purchase-service.dto';
import { Response } from 'express';

@Controller('purchase-services')
export class PurchaseServiceController {
  constructor(private readonly purchaseServiceService: PurchaseServiceService) {}

  @Post('/buy-domain')
  async initiatePayment(@Body() createPurchaseServiceDto: CreatePurchaseServiceDto,
    @Res() res: Response) {

      try {
        const response = await this.purchaseServiceService.initiatePayment(createPurchaseServiceDto);
        return res.status(201).json(response)
      } catch(err) {
        console.log(err)
        return res.status(err.status).json({
          status: false,
          message: err.response
        })
      }
  }

  @Patch()
    async verifyPayment(@Query('purchase_id') purchaseId: string,
    @Res() res: Response) {
      try {
        const response = await this.purchaseServiceService.verifyPayment(purchaseId);
        return res.status(201).json(response)
      } catch(err) {
        return res.status(500).json({
          message: err.message
        })
      }
    }

}
