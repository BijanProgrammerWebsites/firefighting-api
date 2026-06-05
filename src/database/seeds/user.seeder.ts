import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import { User } from "../../users/entities/user.entity";
import { RoleEnum } from "../../shared/enums/role.enum";
import * as bcrypt from "bcrypt";

export class UserSeeder implements Seeder {
  async run(dataSource: DataSource) {
    const repo = dataSource.getRepository(User);

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash("1234", salt);

    await repo.save([
      {
        fullName: "محمدامین شاکری",
        username: "admin",
        password: hashedPassword,
        role: RoleEnum.ADMIN,
      },
      {
        fullName: "مسعود سعادتمند",
        username: "inspector",
        password: hashedPassword,
        role: RoleEnum.INSPECTOR,
      },
      {
        fullName: "مرتضی فکوری",
        username: "viewer",
        password: hashedPassword,
        role: RoleEnum.VIEWER,
      },
    ]);
  }
}
