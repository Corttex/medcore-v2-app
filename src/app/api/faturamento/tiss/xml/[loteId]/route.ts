import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { loteId: string } }
) {
  try {
    const { loteId } = params;

    const lote = await prisma.loteTISS.findUnique({
      where: { id: loteId },
      include: {
        guias: {
          include: {
            meeting: {
              include: { paciente: true }
            },
            convenio: true
          }
        }
      }
    });

    if (!lote) {
      return new NextResponse('Lote não encontrado', { status: 404 });
    }

    // Gerador MOCK de XML TISS (Estrutura Simplificada)
    // Em produção, isso usaria uma biblioteca de builder XML seguindo XSD da ANS
    let xml = `<?xml version="1.0" encoding="ISO-8859-1"?>
<ans:mensagemTISS xmlns:ans="http://www.ans.gov.br/padroes/tiss/schemas">
  <ans:cabecalho>
    <ans:identificacaoTransacao>
      <ans:tipoTransacao>ENVIO_LOTE_GUIAS</ans:tipoTransacao>
      <ans:numeroLote>${lote.numero}</ans:numeroLote>
      <ans:dataRegistroTransacao>${lote.createdAt.toISOString().split('T')[0]}</ans:dataRegistroTransacao>
    </ans:identificacaoTransacao>
  </ans:cabecalho>
  <ans:prestadorParaOperadora>
    <ans:loteGuias>
`;

    lote.guias.forEach((guia) => {
      xml += `      <ans:guiaConsulta>
        <ans:identificacaoGuia>
          <ans:numeroGuiaPrestador>${guia.id.substring(0, 8)}</ans:numeroGuiaPrestador>
        </ans:identificacaoGuia>
        <ans:dadosBeneficiario>
          <ans:nomeBeneficiario>${guia.meeting.paciente?.nome}</ans:nomeBeneficiario>
        </ans:dadosBeneficiario>
        <ans:dadosAtendimento>
          <ans:dataAtendimento>${guia.meeting.date}</ans:dataAtendimento>
          <ans:procedimento>
            <ans:codigoTabela>22</ans:codigoTabela>
            <ans:codigoProcedimento>10101012</ans:codigoProcedimento>
            <ans:valorProcedimento>${guia.valor}</ans:valorProcedimento>
          </ans:procedimento>
        </ans:dadosAtendimento>
      </ans:guiaConsulta>\n`;
    });

    xml += `    </ans:loteGuias>
  </ans:prestadorParaOperadora>
</ans:mensagemTISS>`;

    // Retorna como um arquivo para download
    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Content-Disposition': `attachment; filename="Lote_${lote.numero}.xml"`,
      },
    });

  } catch (error) {
    console.error('Erro ao gerar XML:', error);
    return new NextResponse('Falha ao gerar XML', { status: 500 });
  }
}
