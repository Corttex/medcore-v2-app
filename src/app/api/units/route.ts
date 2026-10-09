import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

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
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  
  try {
    const body = await req.json();
    const { name, type, cnpj, email, phone, address, responsible, color } = body;
    
    if (!name || !type) {
      return NextResponse.json({ error: "Nome e tipo são obrigatórios" }, { status: 400 });
    }
    
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
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
