import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "super_secret_jwt_key");
  } catch (error) {
    return null;
  }
};

export async function POST(request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    const products = await prisma.products.findMany({
      select: {
        product_id: true,
        product_name: true,
        product_brand: true,
        products_owners: {
          select: {
            owners: {
              select: {
                owner_name: true,
              },
            },
          },
        },
      },
    });

    const formattedProducts = products.map((product) => ({
      id: product.product_id,
      product_name: product.product_name,
      product_brand: product.product_brand,
      product_owner: product.products_owners?.owners?.owner_name || "N/A",
    }));

    console.log("Query executed successfully, rows:", formattedProducts.length);
    return NextResponse.json(formattedProducts, { status: 200 });
  } catch (error) {
    console.error("Database error:", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to fetch products", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method GET not allowed. Use POST instead." },
    { status: 405 }
  );
}
