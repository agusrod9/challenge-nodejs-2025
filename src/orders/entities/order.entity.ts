import { Column, Model, Table, HasMany, DataType } from "sequelize-typescript";
import { OrderItem } from "./orderItem.entity"
import { OrderStatus } from "../enums/orderStatus.enum";

@Table
export class Order extends Model{
    @Column
    declare clientName: string;

    @Column({
        type: DataType.ENUM(...Object.values(OrderStatus)),
        defaultValue: 'initiated',
        allowNull: false
    })
    declare status: string;

    @HasMany(()=>OrderItem)
    declare items: OrderItem[];
}