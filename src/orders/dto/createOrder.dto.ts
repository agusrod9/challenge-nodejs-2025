import { IsArray, IsString, ValidateNested  } from "class-validator";
import { Type } from "class-transformer";
import { CreateOrderItemDto } from "./createOrderItem.dto";

export class CreateOrderDto{
    @IsString()
    clientName: string;

    @IsArray()
    @ValidateNested({each: true})
    @Type(()=>CreateOrderItemDto)
    items: CreateOrderItemDto[];
}