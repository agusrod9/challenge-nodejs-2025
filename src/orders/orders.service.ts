import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/orderItem.entity';
import { Op } from 'sequelize';

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order)
        private orderModel: typeof Order,
        @InjectModel(OrderItem)
        private orderItemModel: typeof OrderItem,
    ) {}

    async createOrder(data: {
        clientName: string;
        items: { description: string; quantity: number; unitPrice: number; }[];
    }):Promise<Order> {
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
        const orders = await this.orderModel.findAll({
            where: {
                status: {[Op.ne]: 'delivered'},
            },
            include: [OrderItem],
            order: [['createdAt', 'DESC']],
        });
        return orders;
    }

    async findById(id: number):Promise<Order>{
        const order = await this.orderModel.findByPk(id, {include: [OrderItem]});
        if(!order){
            throw new NotFoundException(`Order with Id ${id} not found.`);
        }
        return order;
    }
}
