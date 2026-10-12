import { DtoField } from '../../decorators';

// Message Pattern
export class VerifyUserPayloadDto {
  @DtoField({ type: String, required: true, validated: true })
  username: string;

  @DtoField({ type: String, required: true, validated: true })
  password: string;
}

// Event Pattern
