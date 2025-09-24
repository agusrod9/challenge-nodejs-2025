import { Test, TestingModule } from '@nestjs/testing';
import { DeliveredOrdersService } from './delivered-orders.service';

describe('DeliveredOrdersService', () => {
  let service: DeliveredOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliveredOrdersService],
    }).compile();

    service = module.get<DeliveredOrdersService>(DeliveredOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
