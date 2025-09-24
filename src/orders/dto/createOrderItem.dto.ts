import { IsInt, IsPositive, IsString, Min } from "class-validator";

export class CreateOrderItemDto{
    @IsString()
    description: string;

    @IsInt()
    @IsPositive()
    quantity: number;

    @IsInt()
    @Min(0)
    unitPrice: number;
}