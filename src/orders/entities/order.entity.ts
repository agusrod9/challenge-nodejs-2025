import { Column, Model, Table, HasMany } from "sequelize-typescript";
import { OrderItem } from "./orderItem.entity"


@Table
export class Order extends Model{
    @Column
    declare clientName: string;

    @Column({defaultValue: 'initiated'})
    declare status: string;

    @HasMany(()=>OrderItem)
    declare items: OrderItem[];
}