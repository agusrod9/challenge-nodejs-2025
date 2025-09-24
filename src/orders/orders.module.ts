import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/orderItem.entity';
import { DeliveredOrder } from 'src/delivered-orders/entities/deliveredOrder.entity';
import { DeliveredOrderItem } from 'src/delivered-orders/entities/deliveredOrderItem.entity';

@Module({
  imports: [SequelizeModule.forFeature([Order, OrderItem, DeliveredOrder, DeliveredOrderItem])],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}