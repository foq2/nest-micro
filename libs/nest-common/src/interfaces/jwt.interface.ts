import { JwtTokenType } from '../enums';

export interface TokenPayload {
  jti: string;
  userId: string;
  type: JwtTokenType;
}
