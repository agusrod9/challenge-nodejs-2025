import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';


describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  const mockedOrders = [
    {
      clientName: 'Agustin R.',
      status: 'initiated',
      items: [
        {description: 'Milanesa con papas fritas', quantity: 2, unitPrice: 890},
        {description: 'Coca Cola 1.5L', quantity: 1, unitPrice: 230}
      ]
    },
    {
      clientName: 'José R.',
      status: 'sent',
      items: [
        {description: 'Paella', quantity: 2, unitPrice: 1490},
        {description: 'Coca Cola 1.5L', quantity: 1, unitPrice: 230}
      ]
    }
  ];

  const mockOrdersService = {
    findAll: jest.fn().mockResolvedValue(mockedOrders)
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {provide: OrdersService, useValue: mockOrdersService}
      ]
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return Array of orders', async()=>{
    const orders = await controller.findAll();
    expect(orders).toEqual(mockedOrders);
    expect(service.findAll).toHaveBeenCalled();
  });
});
