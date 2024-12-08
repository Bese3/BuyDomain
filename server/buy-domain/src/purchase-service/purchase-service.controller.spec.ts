import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseServiceController } from './purchase-service.controller';
import { PurchaseServiceService } from './purchase-service.service';

describe('PurchaseServiceController', () => {
  let controller: PurchaseServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseServiceController],
      providers: [PurchaseServiceService],
    }).compile();

    controller = module.get<PurchaseServiceController>(PurchaseServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
