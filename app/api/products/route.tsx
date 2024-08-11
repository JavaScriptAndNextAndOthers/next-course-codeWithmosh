import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import schema from "../products/schema";

// GET /api/products
export async function GET(request: NextRequest) {
  const products = await prisma.product.findMany();

  return NextResponse.json(products);
}


// POST /api/products
export async function POST(request: NextRequest) {
    const body = await request.json();
    const validation = schema.safeParse(body);
    if (!validation.success)
      return NextResponse.json(validation.error.errors, { status: 400 });

    const newProduct = await prisma.product.create({
      data: {
        name: body.name,
        price: body.price,
        description: body.description,
      },
    });
    return NextResponse.json(newProduct, { status: 201 })
  }
