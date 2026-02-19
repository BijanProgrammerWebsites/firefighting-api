import { User } from "../../users/user.entity";

export type SafeUser = Omit<User, "password" | "refreshToken">;
