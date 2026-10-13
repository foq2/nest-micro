import { JwtTokenType } from '../enums';

export class TokenPayload {
  jti: string;
  userId: string;
  type: JwtTokenType;
  iat?: number;
  exp?: number;
}

export class UserRequestPayload {
  id: string;
  jti: string;
}
