import { config } from "@/config/index.js";
import { createDatabase } from "@/database/index.js";
import { KeysService } from "@/modules/oauth/keys.service.js";

const run = async () => {
  const db = createDatabase({
    connectionString: config.database.url
  });

  const service = new KeysService(db);

  try {
    const kid = await service.rotate();
    console.log(`rotated: new active key ${kid}`);
  } finally {
    await db.destroy();
  }
};

await run().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
