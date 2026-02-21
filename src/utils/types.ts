import { UserRole } from "./enums"

export type JwtPayload = {
  id: number,
  fullName: string,
  email: string,
  role: UserRole
}