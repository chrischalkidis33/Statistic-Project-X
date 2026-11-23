import pg from "pg";
const { Pool } = pg;
//ρύθμιση της σύνδεσης με την βάση postgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
async function totalRevenue() {}
async function sumOrder() {}
async function avgRevenueOrders() {}
async function bestClient(user, uploadId) {
  try {
    const result = await pool.query(
      `
      SELECT 
        COALESCE(NULLIF(TRIM(row_data ->> 'Κωδικός'), ''), 'Χωρίς Κωδικό') AS customer_code,
        COALESCE(NULLIF(TRIM(row_data ->> 'Επωνυμία'), ''), 'Άγνωστος Πελάτης') AS customer_name,
        SUM(
          COALESCE(
            NULLIF(TRIM(row_data ->> 'Αξία πώλησης'), '')::NUMERIC, 
            0
          )
        ) AS total_revenue,
        COUNT(*) AS total_records
      FROM dynamic_erp_records
      WHERE user_id = $1
      GROUP BY 
        row_data ->> 'Κωδικός',
        row_data ->> 'Επωνυμία'
      ORDER BY total_revenue DESC
      LIMIT 10
      `,
      [user.userId],
    );

    return result.rows;
  } catch (error) {
    console.error("Σφάλμα στη συνάρτηση bestClient:", error);
    throw error; // Προωθούμε το σφάλμα ώστε να το πιάσει το try/catch του DataService
  }
}

export { totalRevenue, sumOrder, avgRevenueOrders, bestClient };
