import { DtoField } from '@repo/nest-common';

export class LoginBodyDto {
  @DtoField({
    type: String,
    required: true,
    validated: true,
    example: 'testUser',
  })
  username: string;

  @DtoField({
    type: String,
    required: true,
    validated: true,
    example: '12345678Aa@',
  })
  password: string;
}
