import { Test, TestingModule } from '@nestjs/testing';
import { DeliveredOrdersController } from './delivered-orders.controller';

describe('DeliveredOrdersController', () => {
  let controller: DeliveredOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveredOrdersController],
    }).compile();

    controller = module.get<DeliveredOrdersController>(DeliveredOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
