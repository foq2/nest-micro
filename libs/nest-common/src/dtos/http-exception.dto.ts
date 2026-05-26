import { DtoField } from '../decorators';

export class HttpErrorResponseDto {
  @DtoField()
  statusCode: number;

  @DtoField()
  timestamps?: string;

  @DtoField()
  path?: string;

  @DtoField()
  errorCode: string;

  @DtoField()
  message: string;

  @DtoField()
  details?: object;
}
