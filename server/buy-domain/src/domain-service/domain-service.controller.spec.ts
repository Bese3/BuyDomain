import { Test, TestingModule } from '@nestjs/testing';
import { DomainServiceController } from './domain-service.controller';
import { DomainServiceService } from './domain-service.service';

describe('DomainServiceController', () => {
  let controller: DomainServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DomainServiceController],
      providers: [DomainServiceService],
    }).compile();

    controller = module.get<DomainServiceController>(DomainServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
