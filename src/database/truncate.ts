import { AppDataSource } from "./data-source";

async function truncate() {
  const dataSource = await AppDataSource.setOptions({
    synchronize: false,
  }).initialize();

  await dataSource.query(`
    TRUNCATE TABLE
      "answer",
      "inspection",
      "equipment",
      "unit",
      "zone",
      "site",
      "template",
      "question",
      "standard",
      "refinery",
      "user"
    RESTART IDENTITY CASCADE;
  `);
}

truncate()
  .then(() => {
    console.log("Truncate completed successfully.");
    return AppDataSource.destroy();
  })
  .catch(async (err) => {
    console.error("Truncate failed.");
    console.error(err);

    try {
      return await AppDataSource.destroy();
    } finally {
      process.exit(1);
    }
  });
