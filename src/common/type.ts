import { KycStatus, UserRole } from './enum';

export interface LoggedUser {
  email: string;
  role: UserRole;
  id: string;
  kycStatus?: KycStatus;
}

export enum TokenType {
  access = 'access',
  refresh = 'refresh',
}

export interface TokenPayload {
  id: string;
  email: string;
  role: UserRole;
  type: TokenType;
}
