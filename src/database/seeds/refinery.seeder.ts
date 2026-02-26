import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import { Refinery } from "../../refinery/entities/refinery.entity";

export class RefinerySeeder implements Seeder {
  async run(dataSource: DataSource) {
    const repo = dataSource.getRepository(Refinery);
    await repo.save([{ title: "Refinery", picture: null }]);
  }
}
