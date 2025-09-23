import { Column, Model, Table, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Order } from "./order.entity";

@Table
export class OrderItem extends Model{
    @Column
    declare description: string;

    @Column
    declare quantity: number;

    @Column
    declare unitPrice: number;

    @ForeignKey(()=>Order)
    @Column
    declare orderId:number;

    @BelongsTo(()=>Order)
    declare order:Order;
}