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
    // Create payments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(255) NOT NULL,
        payment_id VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'USD',
        package_id VARCHAR(100),
        package_name VARCHAR(255),
        customer_email VARCHAR(255),
        customer_name VARCHAR(255),
        status VARCHAR(50) DEFAULT 'completed',
        onboarding_data JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log("Payments table created successfully");

    return NextResponse.json({
      success: true,
      message: "Payments table created successfully"
    });

  } catch (error) {
    console.error("Error creating payments table:", error);
    return NextResponse.json(
      { error: "Failed to create payments table" },
      { status: 500 }
    );
  }
}
