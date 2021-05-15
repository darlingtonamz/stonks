import { InstanceEntity } from "../../common/entities/instance.entity";
import { Entity, Column, OneToMany, Unique, Index } from "typeorm";
import { TradeEntity } from "../../trades/entities/trade.entity";

@Entity('stocks')
@Unique("UQ_STOCK_SYMBOL", ["symbol"])
export class StockEntity extends InstanceEntity {
  @Index('idx_stocks_symbol')
  @Column({ type: 'text', nullable: false })
  public symbol: string;

  @OneToMany(
    () => TradeEntity,
    (trade) => trade.stock,
  )
  trades: TradeEntity[];
}
