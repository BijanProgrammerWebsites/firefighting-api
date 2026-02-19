import { Role } from "../../shared/enums/role.enum";

export type JwtPayloadType = {
  sub: string;
  username: string;
  role: Role;
};
