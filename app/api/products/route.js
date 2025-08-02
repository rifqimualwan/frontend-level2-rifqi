// app/api/products/route.js
import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

export async function GET() {
  let connection;
  try {
    // Verify environment variables
    if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
      console.error("Missing environment variables:", {
        DB_HOST: process.env.DB_HOST,
        DB_USER: process.env.DB_USER,
        DB_NAME: process.env.DB_NAME,
      });
      return NextResponse.json(
        { error: "Server configuration error: Missing environment variables" },
        { status: 500 }
      );
    }

    // Create a connection to the database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || "", // Handle empty password
      database: process.env.DB_NAME,
    });

    // Test connection
    await connection.connect();
    console.log("Successfully connected to the database");

    // Execute the SQL query
    const query = `
      SELECT 
        p.product_id AS id,
        p.product_name AS product_name,
        p.product_brand AS product_brand,
        o.owner_name AS product_owner
      FROM products p
      LEFT JOIN products_owners po ON p.product_id = po.products_id
      LEFT JOIN owners o ON po.owners_id = o.id
    `;
    const [rows] = await connection.execute(query);
    console.log("Query executed successfully, rows:", rows.length);

    // Return the results as JSON
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Database error:", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to fetch products", details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      try {
        await connection.end();
        console.log("Database connection closed");
      } catch (err) {
        console.error("Error closing connection:", err.message);
      }
    }
  }
}
