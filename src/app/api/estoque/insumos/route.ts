import { NextResponse } from "next/server";

// Simulação de banco em memória com dados ricos para clínicas médicas, dermatologia, cirurgia plástica e imunização
let itensInsumos = [
  {
    id: "ins-01",
    nome: "Toxina Botulínica Tipo A 100UI (Botox)",
    categoria: "INJETAVEIS",
    tipo: "Toxina Botulínica",
    fabricante: "Allergan",
    lote: "AB94821",
    validade: "2027-05-18",
    estoqueAtual: 14,
    estoqueMinimo: 8,
    unidade: "Frascos",
    valorUnitario: 890.00,
    temperaturaMin: 2,
    temperaturaMax: 8,
    temperaturaAtual: 4.2,
    statusTemperatura: "OK",
    salaArmazenamento: "Geladeira Farmácia - Sala 02",
    indicacao: "Harmonização Orofacial, Rugas Dinâmicas, Espasmos"
  },
  {
    id: "ins-02",
    nome: "Dysport 300UI (Toxina Botulínica)",
    categoria: "INJETAVEIS",
    tipo: "Toxina Botulínica",
    fabricante: "Galderma",
    lote: "DY77210",
    validade: "2026-11-30",
    estoqueAtual: 5,
    estoqueMinimo: 6,
    unidade: "Frascos",
    valorUnitario: 720.00,
    temperaturaMin: 2,
    temperaturaMax: 8,
    temperaturaAtual: 4.5,
    statusTemperatura: "OK",
    salaArmazenamento: "Geladeira Farmácia - Sala 02",
    indicacao: "Estética Facial e Cervical"
  },
  {
    id: "ins-03",
    nome: "Ácido Hialurônico Reticulado 1ml (Ultra 4)",
    categoria: "INJETAVEIS",
    tipo: "Preenchedor Dérmico",
    fabricante: "Juvéderm",
    lote: "JV44391",
    validade: "2027-08-10",
    estoqueAtual: 22,
    estoqueMinimo: 10,
    unidade: "Seringas Preenchidas",
    valorUnitario: 480.00,
    temperaturaMin: 15,
    temperaturaMax: 25,
    temperaturaAtual: 21.0,
    statusTemperatura: "OK",
    salaArmazenamento: "Armário A climatizado",
    indicacao: "Preenchimento Labial, Malar e Mandibular"
  },
  {
    id: "ins-04",
    nome: "Sculptra (Ácido Poli-L-Láctico PLLA)",
    categoria: "INJETAVEIS",
    tipo: "Bioestimulador de Colágeno",
    fabricante: "Galderma",
    lote: "SC11093",
    validade: "2026-12-15",
    estoqueAtual: 7,
    estoqueMinimo: 5,
    unidade: "Frascos",
    valorUnitario: 1150.00,
    temperaturaMin: 15,
    temperaturaMax: 30,
    temperaturaAtual: 22.0,
    statusTemperatura: "OK",
    salaArmazenamento: "Armário A climatizado",
    indicacao: "Estímulo de Colágeno Facial e Corporal"
  },
  {
    id: "ins-05",
    nome: "Vacina Herpes Zóster Recombinante (Shingrix)",
    categoria: "INJETAVEIS",
    tipo: "Imunobiológico / Vacina",
    fabricante: "GSK",
    lote: "SH88412",
    validade: "2027-03-20",
    estoqueAtual: 18,
    estoqueMinimo: 10,
    unidade: "Doses",
    valorUnitario: 680.00,
    temperaturaMin: 2,
    temperaturaMax: 8,
    temperaturaAtual: 4.1,
    statusTemperatura: "OK",
    salaArmazenamento: "Câmara Fria Vacinas - 01",
    indicacao: "Prevenção de Herpes Zóster e Nevralgia"
  },
  {
    id: "ins-06",
    nome: "Vacina HPV Nonavalente (Gardasil 9)",
    categoria: "INJETAVEIS",
    tipo: "Imunobiológico / Vacina",
    fabricante: "MSD",
    lote: "GD90214",
    validade: "2026-12-05",
    estoqueAtual: 12,
    estoqueMinimo: 8,
    unidade: "Doses",
    valorUnitario: 520.00,
    temperaturaMin: 2,
    temperaturaMax: 8,
    temperaturaAtual: 3.9,
    statusTemperatura: "OK",
    salaArmazenamento: "Câmara Fria Vacinas - 01",
    indicacao: "Proteção contra 9 tipos de HPV"
  },
  {
    id: "ins-07",
    nome: "Seringa 1ml BD Ultra-Fine Luer Lock Sem Agulha",
    categoria: "DESCARTAVEIS",
    tipo: "Seringa de Precisão",
    fabricante: "BD Medical",
    lote: "BD40922",
    validade: "2028-10-30",
    estoqueAtual: 340,
    estoqueMinimo: 100,
    unidade: "Unidades",
    valorUnitario: 3.40,
    salaArmazenamento: "Almoxarifado Central - Prateleira B2",
    indicacao: "Injeções intradérmicas e toxina botulínica"
  },
  {
    id: "ins-08",
    nome: "Agulha de Precisão 30G x 4mm (Amarela)",
    categoria: "DESCARTAVEIS",
    tipo: "Agulha Hipodérmica",
    fabricante: "BD Medical",
    lote: "AG30441",
    validade: "2028-06-15",
    estoqueAtual: 450,
    estoqueMinimo: 150,
    unidade: "Unidades",
    valorUnitario: 1.10,
    salaArmazenamento: "Almoxarifado Central - Prateleira B2",
    indicacao: "Aplicação facial de alta precisão"
  },
  {
    id: "ins-09",
    nome: "Microcânula 22G x 50mm com Agulha Auxiliar",
    categoria: "DESCARTAVEIS",
    tipo: "Cânula Cirúrgica",
    fabricante: "SoftFil",
    lote: "SF99014",
    validade: "2027-11-20",
    estoqueAtual: 68,
    estoqueMinimo: 30,
    unidade: "Unidades",
    valorUnitario: 28.50,
    salaArmazenamento: "Almoxarifado Central - Prateleira B3",
    indicacao: "Preenchimento volumétrico atraumático"
  },
  {
    id: "ins-10",
    nome: "Compressa de Gaze Hidrófila Estéril 7,5 x 7,5cm",
    categoria: "DESCARTAVEIS",
    tipo: "Gaze Estéril",
    fabricante: "Cremer",
    lote: "CR39401",
    validade: "2029-01-10",
    estoqueAtual: 850,
    estoqueMinimo: 200,
    unidade: "Pacotes",
    valorUnitario: 1.80,
    salaArmazenamento: "Almoxarifado Central - Prateleira C1",
    indicacao: "Assepsia, hemostasia e procedimentos cirúrgicos"
  },
  {
    id: "ins-11",
    nome: "Kit Avental Cirúrgico Estéril Descartável 40g (SMS)",
    categoria: "EPIS",
    tipo: "Paramentação Cirúrgica",
    fabricante: "Descarpack",
    lote: "DC88129",
    validade: "2027-04-12",
    estoqueAtual: 45,
    estoqueMinimo: 25,
    unidade: "Kits",
    valorUnitario: 14.50,
    salaArmazenamento: "Almoxarifado Central - Bloco Cirúrgico",
    indicacao: "Procedimentos invasivos e cirurgias ambulatoriais"
  },
  {
    id: "ins-12",
    nome: "Luva Cirúrgica Estéril de Látex Nº 7.5",
    categoria: "EPIS",
    tipo: "EPI Cirúrgico",
    fabricante: "Mucambo",
    lote: "MC10294",
    validade: "2028-09-01",
    estoqueAtual: 120,
    estoqueMinimo: 50,
    unidade: "Pares",
    valorUnitario: 4.80,
    salaArmazenamento: "Almoxarifado Central - Prateleira A1",
    indicacao: "Proteção biológica em cirurgias e procedimentos"
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get("categoria");
    const termo = searchParams.get("q")?.toLowerCase();

    let filtrados = [...itensInsumos];

    if (categoria && categoria !== "TODOS") {
      filtrados = filtrados.filter(i => i.categoria === categoria);
    }

    if (termo) {
      filtrados = filtrados.filter(i => 
        i.nome.toLowerCase().includes(termo) ||
        i.lote.toLowerCase().includes(termo) ||
        i.fabricante.toLowerCase().includes(termo) ||
        i.tipo.toLowerCase().includes(termo)
      );
    }

    return NextResponse.json({
      success: true,
      data: filtrados,
      resumo: {
        totalItens: itensInsumos.length,
        totalInjetaveis: itensInsumos.filter(i => i.categoria === "INJETAVEIS").length,
        totalDescartaveis: itensInsumos.filter(i => i.categoria === "DESCARTAVEIS").length,
        totalEpis: itensInsumos.filter(i => i.categoria === "EPIS").length,
        temperaturaMediaCamaras: 4.2
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro ao buscar insumos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const novoItem = {
      id: `ins-${Date.now()}`,
      nome: body.nome,
      categoria: body.categoria || "INJETAVEIS",
      tipo: body.tipo || "Insumo Crítico",
      fabricante: body.fabricante || "Fabricante Padrão",
      lote: body.lote || `LT-${Math.floor(100000 + Math.random() * 900000)}`,
      validade: body.validade || "2027-12-31",
      estoqueAtual: Number(body.estoqueAtual) || 0,
      estoqueMinimo: Number(body.estoqueMinimo) || 5,
      unidade: body.unidade || "UN",
      valorUnitario: Number(body.valorUnitario) || 0,
      temperaturaMin: body.temperaturaMin ? Number(body.temperaturaMin) : null,
      temperaturaMax: body.temperaturaMax ? Number(body.temperaturaMax) : null,
      temperaturaAtual: body.temperaturaAtual ? Number(body.temperaturaAtual) : 4.0,
      statusTemperatura: "OK",
      salaArmazenamento: body.salaArmazenamento || "Estoque Central",
      indicacao: body.indicacao || ""
    };

    itensInsumos.unshift(novoItem);

    return NextResponse.json({ success: true, data: novoItem });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro ao cadastrar insumo" }, { status: 500 });
  }
}
