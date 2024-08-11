import { NextRequest, NextResponse } from "next/server";
import schema from "./schema";
import { prisma } from "@/prisma/client";


// GET /api/products
export async function GET(request: NextRequest) {
  const users = await prisma.user.findMany();

  return NextResponse.json(users);
}

// POST /api/users
export async function POST(request: NextRequest) {
  
  // Parse the request body
  const body = await request.json();
  
  // Validate the request body
  const validation = schema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.errors, {
      status: 400,
    });

    // Check if the user already exists
  const user = await prisma.user.findUnique({
    where: { email: body.email },
  });

  if (user)
    return NextResponse.json(
      { error: "User already exists" },
      { status: 400 }
    );

    // Create the user
  const newUser = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
    },
  });

  return NextResponse.json(newUser, { status: 201 });
}
