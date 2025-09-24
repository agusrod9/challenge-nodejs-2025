import { Controller, Post, Body, Get, Param  } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/createOrder.dto';

@Controller('orders')
export class OrdersController{
    constructor(private readonly ordersService: OrdersService){};

    @Post()
        create(@Body() body: CreateOrderDto){
            return this.ordersService.createOrder(body);
    }

    @Post(':id/advance')
    async advanceOrderStatus(@Param('id') id: string){
        return this.ordersService.advanceOrderStatus(+id)
    }


    @Get()
    async findAll(){
        return this.ordersService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string){
        return this.ordersService.findById(+id);
    }
}