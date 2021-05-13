import { IsDefined, IsInt, IsNotEmpty, IsNumber, IsObject, IsString, ValidateNested } from "class-validator";
import { Type } from 'class-transformer';

export class TradeUserDTO {
  @IsDefined()
  @IsString()
  id: string;

  @IsDefined()
  @IsString()
  name: string;
}

export class CreateTradeDTO {
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  public type: string;

  @IsNotEmpty()
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => TradeUserDTO)
  public user: TradeUserDTO;

  @IsNotEmpty()
  @IsDefined()
  @IsString()
  public symbol: string;

  @IsNotEmpty()
  @IsDefined()
  @IsInt()
  public shares: number;

  @IsNotEmpty()
  @IsDefined()
  @IsNumber()
  public price: number;

  @IsNotEmpty()
  @IsDefined()
  @IsString()
  public timestamp: string;
}

export const TradeSchema: any = {
  //  TODO format timestamp to yyyy-MM-dd HH:mm:ss
  type: 'object',
  properties: {
    type: { type: 'string' },
    user: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
      },
      additionalProperties: false,
    },
    symbol: { type: 'string' },
    shares: { type: 'integer' },
    price: { type: 'number' },
    timestamp: { type: 'string' },
  },
  additionalProperties: false
};

export const CreateTradeSchema = {
  type: 'object',
  properties:  TradeSchema.properties,
  required: ['type', 'user', 'symbol', 'shares', 'price', 'timestamp']
};