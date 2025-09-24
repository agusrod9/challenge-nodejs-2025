import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DeliveredOrder } from './entities/deliveredOrder.entity';
import { DeliveredOrderItem } from './entities/deliveredOrderItem.entity';
import { CreateDeliveredOrderDto } from './dto/createDeliveredOrder.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class DeliveredOrdersService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        @InjectModel(DeliveredOrder)
        private deliveredOrderModel : typeof DeliveredOrder,
        @InjectModel(DeliveredOrderItem)
        private DeliveredOrderItemModel: typeof DeliveredOrderItem
    ){}

    async createDeliveredOrder(data: CreateDeliveredOrderDto):Promise<DeliveredOrder>{
        const deliveredOrder = await this.deliveredOrderModel.create(
            {
                clientName: data.clientName,
                items: data.items,
            },
            {include: [DeliveredOrderItem]}
        );
        return deliveredOrder;
    }

    async findAll():Promise<DeliveredOrder[]>{
        const cacheKey = 'delivered_orders';
        const cached = await this.cacheManager.get<DeliveredOrder[]>(cacheKey);
        if(cached){
            return cached;
        }
        const delivereredOrders = await this.deliveredOrderModel.findAll({include: [DeliveredOrderItem]});
        await this.cacheManager.set(cacheKey, delivereredOrders, 30*1000);
        return delivereredOrders;
    }

    async findById(id:number):Promise<DeliveredOrder>{
        const cacheKey = `delivered_order_${id}`;
        const cached = await this.cacheManager.get<DeliveredOrder>(cacheKey);
        if(cached){
            return cached;
        }
        const deliveredOrder = await this.deliveredOrderModel.findByPk(id, {include: [DeliveredOrderItem]});

        if(!deliveredOrder){
            throw new NotFoundException(`Order with Id ${id} not found in Delivered Orders.`);
        }
        await this.cacheManager.set(cacheKey, deliveredOrder, 30*1000);
        return deliveredOrder;
    }

}
