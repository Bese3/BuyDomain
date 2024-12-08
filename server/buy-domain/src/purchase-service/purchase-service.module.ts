import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { PurchaseServiceService } from './purchase-service.service';
import { PurchaseServiceController } from './purchase-service.controller';
import { ValidatePurchase } from './purchase-service.middleware';

@Module({
  controllers: [PurchaseServiceController],
  providers: [PurchaseServiceService],
})
export class PurchaseServiceModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidatePurchase)
        .forRoutes({path: 'purchase', method: RequestMethod.POST})
  }
}
