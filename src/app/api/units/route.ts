import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// Armazenamento em memória para modo de desenvolvimento local (caso o banco remoto esteja inacessível)
let devUnitsMemory: any[] = [];

export async function GET() {
  const session = await getSession();
  
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        units: {
          include: {
            unit: true
          }
        }
      }
    });
    
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }
    
    const mappedUnits = user.units.map(u => ({
      ...u.unit,
      role: u.role
    }));
    
    return NextResponse.json({
      units: mappedUnits,
      primaryUnitId: user.primaryUnitId
    });
  } catch (error) {
    console.error("Erro ao buscar units:", error);
    if (process.env.NODE_ENV !== "production") {
      const fallback = devUnitsMemory.length > 0 ? devUnitsMemory : [
        {
          id: "dev-unit-default",
          name: "Hospital Central MedCore",
          type: "Hospital",
          active: true,
          role: "owner"
        }
      ];
      return NextResponse.json({
        units: fallback,
        primaryUnitId: fallback[0]?.id
      });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  
  let body: any = {};
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const { name, type, cnpj, email, phone, address, responsible, color } = body;
  
  if (!name || !type) {
    return NextResponse.json({ error: "Nome e tipo são obrigatórios" }, { status: 400 });
  }

  try {
    const newUnit = await prisma.unit.create({
      data: {
        name,
        type,
        cnpj,
        email,
        phone,
        address,
        responsible,
        color,
        users: {
          create: {
            userId: session.user.id,
            role: "owner"
          }
        }
      }
    });

    // Se for a primeira unidade do usuário, seta como primária
    const user = await prisma.user.findUnique({ where: { id: session.user.id }});
    if (!user?.primaryUnitId) {
       await prisma.user.update({
         where: { id: session.user.id },
         data: { primaryUnitId: newUnit.id }
       });
    }
    
    return NextResponse.json({ unit: newUnit, isPrimary: !user?.primaryUnitId });
  } catch (error) {
    console.error("Erro ao criar unit:", error);
    if (process.env.NODE_ENV !== "production") {
      const devUnit = {
        id: "dev-unit-" + Date.now(),
        name,
        type,
        cnpj: cnpj || "",
        email: email || "",
        phone: phone || "",
        address: address || "",
        responsible: responsible || "",
        color: color || "#06b6d4",
        active: true,
        role: "owner"
      };
      devUnitsMemory.push(devUnit);
      return NextResponse.json({ unit: devUnit, isPrimary: true });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getSession();
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { unitId } = await req.json();

    if (unitId) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { primaryUnitId: unitId }
      });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao definir unidade principal:", error);
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
