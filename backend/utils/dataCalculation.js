import { Pool } from "pg";

//ρύθμιση της σύνδεσης με την βάση postgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
async function totalRevenue() {}
async function sumOrder() {}
async function avgRevenueOrders() {}
async function bestClient() {}

export { totalRevenue, sumOrder, avgRevenueOrders, bestClient };
