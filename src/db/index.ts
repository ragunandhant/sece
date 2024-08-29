
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Your migration logic here
const main =  async () =>  {
  
const sql = neon(process.env.DRIZZLE_DATABASE_URL!);

const db = drizzle(sql);
  console.log("Migrating database...")
  await migrate(db,{migrationsFolder : "drizzle"})
    console.log("Database migrated successfully")


}
main()