import { createParamDecorator, ExecutionContext } from "@nestjs/common";

import { JwtPayload } from "../../utils/types";

export const CurrentUser = createParamDecorator((data, context: ExecutionContext) => {
  const req = context.switchToHttp().getRequest();
  const payload: JwtPayload = req.user;
  return payload;
})
