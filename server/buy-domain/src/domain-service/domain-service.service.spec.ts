import { Test, TestingModule } from '@nestjs/testing';
import { DomainServiceService } from './domain-service.service';

describe('DomainServiceService', () => {
  let service: DomainServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DomainServiceService],
    }).compile();

    service = module.get<DomainServiceService>(DomainServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
