import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import { User } from "../../users/user.entity";
import { Role } from "../../shared/enums/role.enum";
import * as bcrypt from "bcrypt";

export class UserSeeder implements Seeder {
  async run(dataSource: DataSource) {
    const repo = dataSource.getRepository(User);

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash("admin", salt);

    await repo.upsert(
      [{ username: "admin", password: hashedPassword, role: Role.ADMIN }],
      ["username"],
    );
  }
}
