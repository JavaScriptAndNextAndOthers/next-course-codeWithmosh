import { NextRequest, NextResponse } from "next/server";
import schema from "../schema";
import { prisma } from "@/prisma/client";

// GET /api/users
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
  });

  if (!user)
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );

  return NextResponse.json(user);
}


// PUT /api/users/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const validation = schema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.errors, {
      status: 400,
    });

  const user = await prisma.user.findUnique({
    where: { id: params.id }
  });

  if (!user)
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      name: body.name,
      email: body.email
    }
  })

  return NextResponse.json(updatedUser);
}


// DELETE /api/users/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check if the user exists
  const user = await prisma.user.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!user)
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );

  // Delete the user
  await prisma.user.delete({
    where: { id: parseInt(params.id) },
  });

  return NextResponse.json({ success: true });
}


