import { HttpException, HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreatePurchaseServiceDto } from './dto/create-purchase-service.dto';
import * as path from 'path';
import * as fs from 'fs';
import Stripe from 'stripe';
import { v4 as uuid } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class PurchaseServiceService implements OnModuleInit {
  constructor( @Inject('STRIPE_CLIENT') private stripe: Stripe,
                private configService: ConfigService) {}

  private readonly filePath = path.join(__dirname, '../../data/purchaseHistory.json');
  private readonly couponFilePath = path.join(__dirname, '../../data/coupons.json')

  async onModuleInit() {
    const counpons = await this.storeCoupons()
    this.addCoupon(counpons)
  }


  private async storeCoupons() {
    let toStoreCoup = []
    const coupons = await this.stripe.coupons.list()
    for (const coup of coupons.data) {
        toStoreCoup.push({
          id: coup.id,
          name: coup.name,
          currency: coup.currency,
          deductByPerc: coup.percent_off,
          price: coup.amount_off / 100,
          duration: coup.duration,
          created: coup.created,
          alreadyUsedEmails: []
        })
    }
    return toStoreCoup;
  }

  private readFile(): CreatePurchaseServiceDto[] {
    const data = fs.readFileSync(this.filePath, 'utf-8');
    return JSON.parse(data || '[]');
  }

  private getCouponFile() {
      const data = fs.readFileSync(this.couponFilePath, 'utf-8');
      return JSON.parse(data || '[]');
  }

  private addCoupon(data) {
    fs.writeFileSync(this.couponFilePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  private writeFile(data: CreatePurchaseServiceDto): void {
    const previousData = this.readFile();

    previousData.push(data);
  
    fs.writeFileSync(this.filePath, JSON.stringify(previousData, null, 2), 'utf-8');
  }

  private updateFile(data: CreatePurchaseServiceDto, verified: boolean): void {
    const previousData = this.readFile()
    for (const purData of previousData){
      if (data.id == purData.id) {
        purData.verified = verified
      }
    }
    fs.writeFileSync(this.filePath, JSON.stringify(previousData, null, 2), 'utf-8');
  }

  async initiatePayment(createPurchaseServiceDto: CreatePurchaseServiceDto,
    email: string, coupon?: string) {
    const domains = createPurchaseServiceDto.domains.map(domain => domain.name);
    const allDomains = []

    for (const data of this.readFile()) {
      if (data.verified) {
        for (const domainData of data.domains) {
          allDomains.push(domainData.name)
        }
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
          unit_amount: domain.price / 10000,
        },
        quantity: 1
      })
    }
  
    try {
      const availableCoupon = await this.getCouponFile().map(coup => {
        if (coup.name === coupon) return coup;
      });
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: productDetail,
        discounts: [
          {coupon: availableCoupon[0]?.id}
        ],
        metadata: {
          user_id: purchaseId,
          email
        },
        success_url: `${process.env.RETURN_URL}?success=true&purchase_id=${purchaseId}&session_id=`,
        cancel_url: `${process.env.HOME_URL}?success=false`
      })
  
      this.writeFile(newPurchase);
      return {session, ...newPurchase};
    } catch(err) {
      console.log(err)
      return {
        status: false,
        message: err.message
      }
    }
    
  }

  async verifyCoupon(coupon: string, email: string) {
        const coupons = this.getCouponFile();
        for (const coup of coupons) {
          if (coup.name != coupon)
              continue;
          if (!coup.alreadyUsedEmails.includes(email)) {
              if(coup.deductByPerc) {
                return {
                  status: true,
                  deductByPerc: true,
                  percentage: coup.deductByPerc,
                  message: "coupon added"
                }
              }

              return {
                status: true,
                discount: coup.price,
                message: 'coupon added',
              }

          } else {

            return {
              status: false,
              discount: 0,
              message: 'counpon alread used!'
            }
          }
        }

        return {
          status: false,
          discount: 0,
          message: 'Invalid coupon!'
        }
  }

  async verifyPayment(purchaseId: string, sessionId: string) {
    const purchased = this.readFile().find(data => data.id == purchaseId);
    if (purchased && purchased.verified) {
      return {
        message: 'Already verified',
        status: true
      }
    }
    if (purchased) {
      purchased.verified = true;
      this.updateFile(purchased, true);
      return purchased;
    }
    return {}
  }

  async webhook (req: Request, _signature) {
    try {
      const email = req.body.data.object.metadata.email?? null;
      const purchaseId = req.body.data.object.metadata.user_id?? null;
      const purchaseData = this.readFile()
      for (const purchases of purchaseData) {
        if (purchases.email === email && purchases.id === purchaseId) {
          purchases.verified = true;
          break
        }
      }
      fs.writeFileSync(this.filePath, JSON.stringify(purchaseData, null, 2), 'utf-8');
      return {
        status: true,
        message: 'verfied your transaction'
      }

    } catch(err) {
      return err;
    }
  }

  
}

