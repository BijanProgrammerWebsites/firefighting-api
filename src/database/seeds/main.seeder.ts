import { Seeder } from "typeorm-extension";
import { DataSource } from "typeorm";

import { UserSeeder } from "./user.seeder";
import { ResourcesSeeder } from "./resources.seeder";
import { RefinerySeeder } from "./refinery.seeder";

export default class MainSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    await new UserSeeder().run(dataSource);
    await new RefinerySeeder().run(dataSource);
    await new ResourcesSeeder().run(dataSource);
  }
}
