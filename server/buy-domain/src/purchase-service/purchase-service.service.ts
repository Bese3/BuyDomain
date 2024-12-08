import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreatePurchaseServiceDto } from './dto/create-purchase-service.dto';
import * as path from 'path';
import * as fs from 'fs';
import Stripe from 'stripe';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PurchaseServiceService {
  constructor(@Inject('STRIPE_CLIENT') private stripe: Stripe) {}
  private filePath = path.join(__dirname, '../../data/purchaseHistory.json');

  private readFile(): CreatePurchaseServiceDto[] {
    const data = fs.readFileSync(this.filePath, 'utf-8');
    return JSON.parse(data || '[]');
  }

  private writeFile(data: CreatePurchaseServiceDto): void {
    const previousData = this.readFile();

    previousData.push(data);
  
    fs.writeFileSync(this.filePath, JSON.stringify(previousData, null, 2), 'utf-8');
  }
  async create(createPurchaseServiceDto: CreatePurchaseServiceDto) {
    const domains = createPurchaseServiceDto.domains.map(domain => domain.name);
    const allDomains = []

    for (const data of this.readFile()) {
      for (const domainData of data.domains) {
        allDomains.push(domainData.name)
      }
    }

    for (const domain of domains?? [""]) {
      if(allDomains.includes(domain)) {
        throw new HttpException(`Domain name ${domain} already purchased`, HttpStatus.BAD_REQUEST);
      }
    }

    const newPurchase = createPurchaseServiceDto;
    const purchaseId = uuid()
    newPurchase.verified = false;
    newPurchase.id = purchaseId;
    newPurchase.checkoutDate = (new Date()).toString()

    const productDetail = []
    for (const domain of createPurchaseServiceDto.domains) {
      productDetail.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: domain.name,
          },
          unit_amount: domain.price
        },
        quantity: 1
      })
    }
  
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['alipay', 'amazon_pay', 'card'],
      mode: 'payment',
      line_items: productDetail,
      success_url: `${process.env.RETURN_URL}?success=true&purchase_id=${purchaseId}`,
      cancel_url: `${process.env.RETURN_URL}?success=false&purchase_id=${purchaseId}`
    })

    this.writeFile(newPurchase);
    return {session, ...newPurchase};
    
  }

  
}

