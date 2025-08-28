import express from 'express';
import dotenv from 'dotenv';
import routes from './routes.js';
import { init } from './db.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function main() {
  await init();
  const app = express();
  app.use(express.json());
  app.use(routes);

  app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
}

main();
