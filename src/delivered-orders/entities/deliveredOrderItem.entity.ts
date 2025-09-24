import { Column, Model, Table, ForeignKey, BelongsTo } from "sequelize-typescript";
import { DeliveredOrder } from "./deliveredOrder.entity";

@Table
export class DeliveredOrderItem extends Model{
    @Column
    declare description: string;
    
    @Column
    declare quantity: number;

    @Column
    declare unitPrice: number;

    @ForeignKey(()=>DeliveredOrder)
    @Column
    declare orderId:number;

    @BelongsTo(()=>DeliveredOrder)
    declare order:DeliveredOrder;
}