import { IsArray, IsString, ValidateNested  } from "class-validator";
import { Type } from "class-transformer";
import { CreateOrderItemDto } from "src/orders/dto/createOrderItem.dto";

export class CreateDeliveredOrderDto{
    @IsString()
    clientName: string;

    @IsArray()
    @ValidateNested({each: true})
    @Type(()=>CreateOrderItemDto)
    items: CreateOrderItemDto[];
}