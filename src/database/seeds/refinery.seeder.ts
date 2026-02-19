import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import { Refinery } from "../../refinery/entities/refinery.entity";

export class RefinerySeeder implements Seeder {
  track = true;

  async run(dataSource: DataSource) {
    const repo = dataSource.getRepository(Refinery);
    await repo.clear();
    await repo.save([{ title: "Refinery", picture: null }]);
  }
}
