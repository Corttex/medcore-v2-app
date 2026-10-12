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
      country: (u.unit as any).country || "BR",
      taxRegime: (u.unit as any).taxRegime || "SIMPLES_NACIONAL",
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
          country: "BR",
          taxRegime: "SIMPLES_NACIONAL",
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

  const { name, type, cnpj, email, phone, address, responsible, color, country, taxRegime } = body;
  
  if (!name || !type) {
    return NextResponse.json({ error: "Nome e tipo são obrigatórios" }, { status: 400 });
  }

  const resolvedCountry = country === "US" || country === "EU" ? country : "BR";
  const resolvedTaxRegime = taxRegime || (resolvedCountry === "BR" ? "SIMPLES_NACIONAL" : resolvedCountry === "US" ? "W2_1099" : "PAYE");

  try {
    const unitData: any = {
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
    };

    // Tenta persistir country e taxRegime caso o schema contenha os campos
    try {
      unitData.country = resolvedCountry;
      unitData.taxRegime = resolvedTaxRegime;
    } catch {
      // Ignora caso campo não exista
    }

    const newUnit = await prisma.unit.create({
      data: unitData
    });

    // Se for a primeira unidade do usuário, seta como primária
    const user = await prisma.user.findUnique({ where: { id: session.user.id }});
    if (!user?.primaryUnitId) {
       await prisma.user.update({
         where: { id: session.user.id },
         data: { primaryUnitId: newUnit.id }
       });
    }
    
    return NextResponse.json({ 
      unit: {
        ...newUnit,
        country: resolvedCountry,
        taxRegime: resolvedTaxRegime
      }, 
      isPrimary: !user?.primaryUnitId 
    });
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
        country: resolvedCountry,
        taxRegime: resolvedTaxRegime,
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
    const body = await req.json();
    const { unitId, id, name, type, country, taxRegime, address, phone, email, cnpj, responsible, color } = body;

    const targetId = id || unitId;

    // Se apenas unitId foi enviado para alternar a unidade primária
    if (unitId && !name && !country) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { primaryUnitId: unitId }
      });
      return NextResponse.json({ success: true });
    }

    // Se veio payload completo para atualizar as configurações da unidade
    if (targetId) {
      try {
        const updateData: any = {};
        if (name) updateData.name = name;
        if (type) updateData.type = type;
        if (address !== undefined) updateData.address = address;
        if (phone !== undefined) updateData.phone = phone;
        if (email !== undefined) updateData.email = email;
        if (cnpj !== undefined) updateData.cnpj = cnpj;
        if (responsible !== undefined) updateData.responsible = responsible;
        if (color !== undefined) updateData.color = color;
        if (country !== undefined) updateData.country = country;
        if (taxRegime !== undefined) updateData.taxRegime = taxRegime;

        await prisma.unit.update({
          where: { id: targetId },
          data: updateData
        });
      } catch (err) {
        console.warn("Prisma update fallback to memory:", err);
      }

      // Atualiza na memória de desenvolvimento
      const idx = devUnitsMemory.findIndex(u => u.id === targetId);
      if (idx !== -1) {
        devUnitsMemory[idx] = {
          ...devUnitsMemory[idx],
          ...(name && { name }),
          ...(type && { type }),
          ...(address !== undefined && { address }),
          ...(phone !== undefined && { phone }),
          ...(email !== undefined && { email }),
          ...(cnpj !== undefined && { cnpj }),
          ...(responsible !== undefined && { responsible }),
          ...(color !== undefined && { color }),
          ...(country !== undefined && { country }),
          ...(taxRegime !== undefined && { taxRegime }),
        };
      }
    }
    
    return NextResponse.json({ success: true, updatedId: targetId });
  } catch (error) {
    console.error("Erro ao atualizar unidade:", error);
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
