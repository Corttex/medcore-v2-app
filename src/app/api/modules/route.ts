import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const modules = await prisma.systemModule.findMany({
      orderBy: { id: "asc" }
    });
    return NextResponse.json(modules);
  } catch (error) {
    console.error("Erro ao buscar módulos:", error);
    return NextResponse.json([], { status: 500 });
  }
}
