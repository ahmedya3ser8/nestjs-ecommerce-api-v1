import { UserRole } from "./enums"

export type JwtPayload = {
  id: number,
  fullName: string,
  email: string,
  role: UserRole;
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}