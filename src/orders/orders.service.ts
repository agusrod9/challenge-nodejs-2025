import { BadRequestException, Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/orderItem.entity';
import { Op } from 'sequelize';
import { OrderStatus } from '../shared/enums/orderStatus.enum';
import { CreateOrderDto } from './dto/createOrder.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { DeliveredOrder } from 'src/delivered-orders/entities/deliveredOrder.entity';
import { DeliveredOrderItem } from 'src/delivered-orders/entities/deliveredOrderItem.entity';

@Injectable()
export class OrdersService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        @InjectModel(Order)
        private orderModel: typeof Order,
        @InjectModel(OrderItem)
        private orderItemModel: typeof OrderItem,
        @InjectModel(DeliveredOrder)
        private deliveredOrderModel : typeof DeliveredOrder,
        @InjectModel(DeliveredOrderItem)
        private deliveredOrderItemModel : typeof DeliveredOrderItem
    ) {}

    async createOrder(data: CreateOrderDto):Promise<Order> {
        const order = await this.orderModel.create(
        {
            clientName: data.clientName,
            items: data.items,
        },
        { include: [OrderItem] },
        );
        return order;
    }

    async findAll():Promise<Order[]>{
        const cacheKey = 'active_orders';
        const cached = await this.cacheManager.get<Order[]>(cacheKey);
        if(cached){
            return cached;
        }
        const orders = await this.orderModel.findAll({
            where: {
                status: {[Op.ne]: 'delivered'},
            },
            include: [OrderItem],
            order: [['createdAt', 'DESC']],
        });
        await this.cacheManager.set(cacheKey, orders, 30*1000); 
        return orders;
    }

    async findById(id: number):Promise<Order>{
        const cacheKey = `active_order_${id}`;
        const cached = await this.cacheManager.get<Order>(cacheKey);
        if(cached){
            return cached;
        }
        const order = await this.orderModel.findByPk(id, {include: [OrderItem]});
        if(!order){
            throw new NotFoundException(`Order with Id ${id} not found.`);
        }
        await this.cacheManager.set(cacheKey, order, 30*1000);
        return order;
    }

    async advanceOrderStatus(id:number):Promise<Order>{
        const order = await this.orderModel.findByPk(id, {include: [OrderItem]});

        if(!order){
            throw new NotFoundException(`Order with Id ${id} not found`);
        }
        let nextStatus: OrderStatus;

        switch(order.status){
            case OrderStatus.I:
                nextStatus = OrderStatus.S;
                break;
            case OrderStatus.S:
                nextStatus = OrderStatus.D;
                break;
            case OrderStatus.D:
                throw new BadRequestException('Order already delivered');
            default:
                throw new BadRequestException(`Unknow order status: ${order.status}`);
        }

        if(nextStatus== OrderStatus.D){
            order.status=nextStatus; // por coherencia de los datos a borrar nomás.
            const deliveredOrder = await this.deliveredOrderModel.create({
                ...order.get({plain: true})
            })

            for(const item of order.items){
                await this.deliveredOrderItemModel.create({
                    ...item.get({plain: true}),
                    orderId: deliveredOrder.id
                })
            }
            await this.cacheManager.del(`active_order_${order.id}`);
            const activeOrdersCached = await this.cacheManager.get<Order[]>('active_orders');
            if(activeOrdersCached){
                const cachedOrders = activeOrdersCached as Order[];
                const updatedActiveOrders = cachedOrders.filter((ord)=> ord.id !== id);
                await this.cacheManager.set('active_orders',updatedActiveOrders,30*1000); //de cierta forma resetea el timer, se podría optimizar eso??
            }
            await order.destroy();
        }
        order.status=nextStatus;
        await order.save();
        return order;
    }
}
