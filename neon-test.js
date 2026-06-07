import dotenv from "dotenv";
import pkg from "pg";

dotenv.config({ path: ".env.local" });

const { Client } = pkg;
const connectionString = process.env.VITE_NEON_DB_URL;

if (!connectionString) {
  console.error("Missing VITE_NEON_DB_URL in environment. Make sure .env.local exists and contains the Neon URL.");
  process.exit(1);
}

const client = new Client({ connectionString });

async function main() {
  await client.connect();
  const res = await client.query("SELECT version()");
  console.log("Connected to Neon successfully:", res.rows[0].version);
  await client.end();
}

main().catch((error) => {
  console.error("Neon connection failed:", error.message || error);
  process.exit(1);
});
