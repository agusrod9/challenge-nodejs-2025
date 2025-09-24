import { Module } from '@nestjs/common';
import { DeliveredOrdersController } from './delivered-orders.controller';
import { DeliveredOrdersService } from './delivered-orders.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { DeliveredOrder } from './entities/deliveredOrder.entity';
import { DeliveredOrderItem } from './entities/deliveredOrderItem.entity';

@Module({
  imports: [SequelizeModule.forFeature([DeliveredOrder, DeliveredOrderItem])],
  controllers: [DeliveredOrdersController],
  providers: [DeliveredOrdersService]
})
export class DeliveredOrdersModule {}
