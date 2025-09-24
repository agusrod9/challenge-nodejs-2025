import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DeliveredOrdersService } from './delivered-orders.service';
import { CreateDeliveredOrderDto } from './dto/createDeliveredOrder.dto';

@Controller('delivered-orders')
export class DeliveredOrdersController {
    constructor(private readonly deliveredOrderService: DeliveredOrdersService){};

    @Post()
    create(@Body() body: CreateDeliveredOrderDto){
        return this.deliveredOrderService.createDeliveredOrder(body)
    }

    @Get()
    async findAll(){
        return this.deliveredOrderService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string){
        return this.deliveredOrderService.findById(+id);
    }

}
