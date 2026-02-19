import { runSeeders } from "typeorm-extension";
import { AppDataSource } from "./data-source";

AppDataSource.initialize()
  .then(async (dataSource) => {
    await runSeeders(dataSource);
    console.log("Seed completed successfully.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seed failed.");
    console.error(err);
    process.exit(1);
  });
