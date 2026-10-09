import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const unitId = searchParams.get("unitId");

    if (!unitId) {
      return NextResponse.json({ error: "unitId é obrigatório" }, { status: 400 });
    }

    const notas = await prisma.notaFiscal.findMany({
      where: { unitId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(notas);
  } catch (error) {
    console.error("Erro ao buscar Notas Fiscais:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      valor,
      descricao,
      cnae,
      codigoServico,
      tomadorNome,
      tomadorDocumento,
      tomadorEmail,
      tomadorEndereco,
      unitId,
      ambiente
    } = body;

    if (!unitId || !valor || !tomadorNome || !tomadorDocumento) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
    }

    // Simulando processamento da nota (Homologação sempre aprova)
    const status = "AUTORIZADA";
    const numero = Math.floor(1000 + Math.random() * 9000).toString();
    const rps = "RPS-" + Math.floor(10000 + Math.random() * 90000).toString();

    const novaNota = await prisma.notaFiscal.create({
      data: {
        valor: parseFloat(valor),
        descricao,
        cnae,
        codigoServico,
        tomadorNome,
        tomadorDocumento,
        tomadorEmail,
        tomadorEndereco,
        unitId,
        ambiente: ambiente || "HOMOLOGACAO",
        status,
        numero,
        rps,
        // Mocking URLs for demonstration
        pdfUrl: "https://medcore-demo.app/nfe/" + numero + ".pdf",
        xmlUrl: "https://medcore-demo.app/nfe/" + numero + ".xml"
      }
    });

    return NextResponse.json(novaNota, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar Nota Fiscal:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
