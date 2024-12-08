import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DomainServiceModule } from './domain-service/domain-service.module';
import { PurchaseServiceModule } from './purchase-service/purchase-service.module';
import { ConfigModule } from '@nestjs/config';
import { StripeModule } from './stripe/stripe.module';

@Module({
  imports: [UsersModule, DomainServiceModule, PurchaseServiceModule,
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: '.env'
      }),
      StripeModule.forRoot(process.env.SECRET_KEY, {'apiVersion': '2024-11-20.acacia'})
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
