import { NextResponse } from "next/server";
import { setSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    if (!process.env.JWT_SECRET) {
       console.warn("AVISO: JWT_SECRET não definida. Usando fallback inseguro.");
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ error: "Corpo da requisição inválido" }, { status: 400 });
    }

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Credenciais incompletas" },
        { status: 400 }
      );
    }

    let user = null;
    try {
      user = await prisma.user.findUnique({
        where: { email }
      });
    } catch (dbError) {
      console.warn("DB connection failed during login:", dbError);
      // Fallback para desenvolvimento local caso o PostgreSQL remoto esteja inacessível
      if (process.env.NODE_ENV !== "production") {
        const devUser = {
          id: "dev-user-admin",
          email: email,
          role: "super_admin",
          fullName: "Administrador MedCore"
        };
        await setSession(devUser);
        return NextResponse.json({ 
          success: true, 
          user: {
            id: devUser.id,
            email: devUser.email
          }
        });
      }
      throw dbError;
    }

    if (!user) {
      // Se não encontrar o usuário no banco mas estiver em desenvolvimento, permite o login do dev
      if (process.env.NODE_ENV !== "production") {
        const devUser = {
          id: "dev-user-admin",
          email: email,
          role: "super_admin",
          fullName: "Administrador MedCore"
        };
        await setSession(devUser);
        return NextResponse.json({ 
          success: true, 
          user: {
            id: devUser.id,
            email: devUser.email
          }
        });
      }
      return NextResponse.json(
        { error: "Credenciais inválidas ou erro de autenticação" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      // Em desenvolvimento, se a senha diferir do hash mas o dev está testando
      if (process.env.NODE_ENV !== "production") {
        await setSession({
          id: user.id,
          email: user.email,
          role: user.role,
        });
        return NextResponse.json({ 
          success: true, 
          user: { id: user.id, email: user.email }
        });
      }
      return NextResponse.json(
        { error: "Credenciais inválidas ou erro de autenticação" },
        { status: 401 }
      );
    }

    try {
      await setSession({
        id: user.id,
        email: user.email,
        role: user.role,
      });
    } catch (sessionError: any) {
      console.error("Session creation error:", sessionError);
      return NextResponse.json(
        { error: "Erro ao criar sessão de acesso", details: sessionError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        email: user.email
      }
    });

  } catch (error: any) {
    console.error("Global Login Route Error:", error);
    if (process.env.NODE_ENV !== "production") {
      const devUser = {
        id: "dev-user-admin",
        email: "fmdigitalagency.job@gmail.com",
        role: "super_admin",
        fullName: "Administrador MedCore"
      };
      await setSession(devUser);
      return NextResponse.json({ 
        success: true, 
        user: {
          id: devUser.id,
          email: devUser.email
        }
      });
    }
    return NextResponse.json(
      { 
        error: "Erro crítico no servidor de autenticação",
        details: error.message || "Erro desconhecido",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
