import { NextResponse } from "next/server";
import { setSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Corpo da requisição inválido" }, { status: 400 });
    }

    const { email, password, fullName } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "Dados incompletos para registro" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Este email já está em uso" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        role: "viewer",
      },
    });

    await setSession({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
      },
    });

  } catch (error: any) {
    console.error("Global Register Route Error:", error);
    return NextResponse.json(
      {
        error: "Erro crítico no servidor de registro",
        details: error.message || "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
