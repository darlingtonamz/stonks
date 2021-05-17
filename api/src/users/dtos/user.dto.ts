import { IsDefined, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDTO {
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  public name: string;
}

export const UserSchema: any = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
  },
  additionalProperties: false
};

export const CreateUserSchema = {
  type: 'object',
  properties:  UserSchema.properties,
  required: ['name']
};