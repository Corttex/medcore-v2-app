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

    let user = null;
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Este e-mail já está em uso. Tente fazer login." },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          fullName,
          role: "owner",
        },
      });
    } catch (dbError: any) {
      console.warn("DB connection failed during register:", dbError);
      if (process.env.NODE_ENV !== "production") {
        user = {
          id: `dev-user-${Date.now()}`,
          email,
          role: "owner",
          fullName
        };
      } else {
        throw dbError;
      }
    }

    if (user) {
      await setSession({
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName || fullName
      });

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
        },
      });
    }

    return NextResponse.json({ error: "Falha ao registrar usuário." }, { status: 400 });
  } catch (error: any) {
    console.error("Global Register Route Error:", error);
    return NextResponse.json(
      {
        error: "Erro ao processar o cadastro no servidor.",
        details: error.message || "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
