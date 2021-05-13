import { InstanceEntity } from "../../common/entities/instance.entity";
import { Entity, Column, CreateDateColumn, JoinColumn } from "typeorm";
import { ManyToOne } from "typeorm";
import { StockEntity } from "../../stocks/entities/stock.entity";

interface ITradeUser {
  id: string;
  name: string;
}

@Entity('trades')
export class TradeEntity extends InstanceEntity {
  @Column()
  public type: string;

  @Column({ type: 'jsonb', nullable: true })
  public user: ITradeUser;

  @Column({ type: 'text', nullable: false })
  public symbol: string;

  @Column({ type: 'integer', nullable: false })
  public shares: number;

  @Column({ type: 'float', nullable: false })
  public price: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  public timestamp: Date;

  // TODO - Index user and symbol

  @ManyToOne(
    () => StockEntity,
    (stock) => stock.trades,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'symbol', referencedColumnName: 'symbol' })
  stock: StockEntity;

}