import { NextResponse } from "next/server";
import { Pool } from "pg";

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
    ca: undefined,
    key: undefined,
    cert: undefined
  }
});

export async function GET() {
  try {
    // Get all payments ordered by most recent first
    const result = await pool.query(`
      SELECT 
        id,
        order_id,
        payment_id,
        amount,
        currency,
        package_id,
        package_name,
        customer_email,
        customer_name,
        status,
        created_at
      FROM payments 
      ORDER BY created_at DESC
      LIMIT 100;
    `);

    console.log(`Found ${result.rows.length} payments`);

    return NextResponse.json({
      success: true,
      payments: result.rows,
      count: result.rows.length
    });

  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}
