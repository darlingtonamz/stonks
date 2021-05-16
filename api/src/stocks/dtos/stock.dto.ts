import { IsDefined, IsNotEmpty, IsString } from "class-validator";

export class CreateStockDTO {
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  public symbol: string;
}

export const StockSchema: any = {
  type: 'object',
  properties: {
    symbol: { type: 'string' },
  },
  additionalProperties: false
};

export const CreateStockSchema = {
  type: 'object',
  properties:  StockSchema.properties,
  required: ['symbol']
};