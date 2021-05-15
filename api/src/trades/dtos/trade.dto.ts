import { IsDefined, IsInt, IsNotEmpty, IsNumber, IsObject, IsString, ValidateNested } from "class-validator";
import { Type } from 'class-transformer';
import { TradeType } from "../../common/constants/constants";

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
  type: 'object',
  properties: {
    type: {
      type: 'string',
      enum: Object.values(TradeType),
      // errorMessage: {
      //   type: 'Bad age',
      //   enum: `body.type should be equal to one of the allowed values [${Object.values(TradeType)}]`
      // //   // min: 'Too young',
      // }
    },
    user: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
      },
      additionalProperties: false,
    },
    symbol: { type: 'string' },
    shares: {
      type: 'integer',
      minimum: 10,
      maximum: 30,
    },
    price: {
      type: 'number',
      minimum: 130.42,
      maximum: 195.65,
    },
    timestamp: {
      type: 'string',
    },
  },
  additionalProperties: false
};

export const CreateTradeSchema = {
  type: 'object',
  properties:  TradeSchema.properties,
  required: ['type', 'user', 'symbol', 'shares', 'price', 'timestamp']
};