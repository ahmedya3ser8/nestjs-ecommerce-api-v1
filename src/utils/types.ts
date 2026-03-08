import { UserRole } from "./enums"

export type JwtPayload = {
  id: number,
  fullName: string,
  email: string,
  role: UserRole;
  iat?: number;
  exp?: number;
}

export type ImageType = {
  url: string;
  publicId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

