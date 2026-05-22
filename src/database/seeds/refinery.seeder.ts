import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import { Refinery } from "../../refinery/entities/refinery.entity";
import path from "node:path";
import fs from "node:fs/promises";

export class RefinerySeeder implements Seeder {
  async run(dataSource: DataSource) {
    const repo = dataSource.getRepository(Refinery);

    const fileStoragePath = process.env.FILE_STORAGE_PATH!;

    const sourcePath = path.join(
      process.cwd(),
      "src/database/seeds/assets/sample-logo.png",
    );

    const destinationPath = path.join(fileStoragePath, "sample-logo.png");

    await fs.mkdir(fileStoragePath, { recursive: true });
    await fs.copyFile(sourcePath, destinationPath);

    await repo.save([
      { title: "پالایشگاه ستاره خلیج فارس", picture: "sample-logo.png" },
    ]);
  }
}
