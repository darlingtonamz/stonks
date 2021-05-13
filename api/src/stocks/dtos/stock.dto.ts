import { IsDefined, IsNotEmpty, IsString } from "class-validator";

export class StockUserDTO {
  @IsDefined()
  @IsString()
  id: string;

  @IsDefined()
  @IsString()
  name: string;
}

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