import { Column, Model, Table, HasMany, DataType } from "sequelize-typescript";
import { DeliveredOrderItem } from "./deliveredOrderItem.entity";
import { OrderStatus } from "../../shared/enums/orderStatus.enum";

@Table
export class DeliveredOrder extends Model{
    @Column
    declare clientName: string;
    
    @Column({
        type: DataType.ENUM(...Object.values(OrderStatus)),
        defaultValue: 'delivered',
        allowNull: false
    })
    declare status: string;

    @HasMany(()=>DeliveredOrderItem)
    declare items: DeliveredOrderItem[]; 

}
