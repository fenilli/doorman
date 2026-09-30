import { createConfig } from "@/config/index.js";
import { createDatabase } from "@/database/index.js";
import { createKeysService } from "@/modules/keys/keys.service.js";


const run = async () => {
  const config = createConfig();
  const db = createDatabase({
    connectionString: config.database.url
  });

  try {
    const kid = await createKeysService(db).rotate();
    console.log(`rotated: new active key ${kid}`);
  } finally {
    await db.destroy();
  }
};

await run().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
