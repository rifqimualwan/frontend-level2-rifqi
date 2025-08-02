import { NextResponse } from "next/server";
import { getConnection } from "../../../lib/db";

export async function GET() {
  try {
    const connection = await getConnection();
    const query = `
      SELECT 
        p.product_id AS id,
        p.product_name AS \`Product Name\`,
        p.product_brand AS \`Product Brand\`,
        o.owner_name AS \`Product Owner\`
      FROM products p
      LEFT JOIN products_owners po ON p.product_id = po.products_id
      LEFT JOIN owners o ON po.owners_id = o.id
    `;
    const [rows] = await connection.execute(query);
    await connection.end();
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Query error:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch products", details: error.message },
      { status: 500 }
    );
  }
}
