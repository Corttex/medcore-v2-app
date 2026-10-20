/**
 * Gerador de Arquivo CNAB 240 (Padrão FEBRABAN)
 * Módulo de Folha de Pagamento & Liquidação de Prestadores PJ (MedCore)
 */

export interface CNABPaymentRecord {
  id: string;
  nome: string;
  documento: string; // CPF ou CNPJ
  bancoCodigo?: string; // Ex: "341" (Itaú), "033" (Santander), "077" (Inter), "001" (BB)
  agencia?: string;
  conta?: string;
  chavePix?: string;
  valorLiquido: number;
  tipoPagamento: "SALARIO_CLT" | "REPASSE_PJ";
}

export interface CNABHeaderConfig {
  bancoCodigo?: string; // Padrão: 341 (Itaú) ou 077 (Inter)
  cnpjHospital?: string;
  razaoSocialHospital?: string;
  agencia?: string;
  conta?: string;
  competencia?: string;
}

function padRight(str: string, length: number): string {
  return (str || "").slice(0, length).padEnd(length, " ");
}

function padLeft(str: string | number, length: number): string {
  const s = String(str || "");
  return s.slice(0, length).padStart(length, "0");
}

function formatCurrencyToCNAB(amount: number): string {
  const cents = Math.round(amount * 100);
  return padLeft(cents, 15);
}

function cleanDigits(val: string): string {
  return (val || "").replace(/\D/g, "");
}

/**
 * Gera arquivo CNAB 240 posicional completo com 240 colunas por linha
 */
export function generateCNAB240File(
  payments: CNABPaymentRecord[],
  config?: CNABHeaderConfig
): string {
  const banco = padLeft(config?.bancoCodigo || "341", 3);
  const cnpj = padLeft(cleanDigits(config?.cnpjHospital || "45182934000192"), 14);
  const razaoSocial = padRight(config?.razaoSocialHospital || "HOSPITAL CENTRAL MEDCORE LTDA", 30);
  const agencia = padLeft(cleanDigits(config?.agencia || "1800"), 5);
  const conta = padLeft(cleanDigits(config?.conta || "928174"), 12);
  const dateStr = new Date().toISOString().replace(/\D/g, "").slice(0, 8); // YYYYMMDD
  const timeStr = new Date().toISOString().replace(/\D/g, "").slice(8, 14); // HHMMSS

  const lines: string[] = [];

  // 1. HEADER DE ARQUIVO (Tipo 0)
  let headerArquivo = "";
  headerArquivo += banco; // 1-3: Código do Banco
  headerArquivo += "0000"; // 4-7: Lote de serviço
  headerArquivo += "0"; // 8: Tipo de registro (0 = Header de Arquivo)
  headerArquivo += padRight("", 9); // 9-17: Reservado Banco
  headerArquivo += "2"; // 18: Tipo de inscrição (2 = CNPJ)
  headerArquivo += cnpj; // 19-32: CNPJ da Empresa
  headerArquivo += padRight("", 20); // 33-52: Convênio com o Banco
  headerArquivo += agencia; // 53-57: Agência
  headerArquivo += " "; // 58: DV Agência
  headerArquivo += conta; // 59-70: Conta Corrente
  headerArquivo += "0"; // 71: DV Conta
  headerArquivo += " "; // 72: DV Agência/Conta
  headerArquivo += razaoSocial; // 73-102: Nome da Empresa
  headerArquivo += padRight("BANCO MEDCORE INTEGRATION", 30); // 103-132: Nome do Banco
  headerArquivo += padRight("", 10); // 133-142: Reservado
  headerArquivo += "1"; // 143: Código Remessa (1 = Remessa)
  headerArquivo += dateStr; // 144-151: Data de geração
  headerArquivo += timeStr; // 152-157: Hora de geração
  headerArquivo += "000001"; // 158-163: Sequencial do arquivo
  headerArquivo += "084"; // 164-166: Versão do layout
  headerArquivo += padRight("", 5); // 167-171: Densidade de gravação
  headerArquivo += padRight("", 69); // 172-240: Reservado Febraban
  lines.push(headerArquivo.slice(0, 240).padEnd(240, " "));

  // 2. HEADER DE LOTE (Tipo 1)
  let headerLote = "";
  headerLote += banco; // 1-3
  headerLote += "0001"; // 4-7: Lote de serviço 0001
  headerLote += "1"; // 8: Tipo de registro (1 = Header de Lote)
  headerLote += "C"; // 9: Tipo de operação (C = Crédito)
  headerLote += "30"; // 10-11: Tipo de serviço (30 = Pagamento Salários / Fornecedores)
  headerLote += "01"; // 12-13: Forma de lançamento (01 = Crédito em Conta / Pix)
  headerLote += "040"; // 14-16: Versão do layout do lote
  headerLote += " "; // 17: Reservado
  headerLote += "2"; // 18: Inscrição 2 = CNPJ
  headerLote += cnpj; // 19-32: CNPJ
  headerLote += padRight("", 20); // 33-52: Convênio
  headerLote += agencia; // 53-57
  headerLote += " "; // 58
  headerLote += conta; // 59-70
  headerLote += "0 "; // 71-72
  headerLote += razaoSocial; // 73-102
  headerLote += padRight("FOLHA MEDCORE HEALTH", 40); // 103-142: Informação de mensagem
  headerLote += padRight("AV PAULISTA 1800", 30); // 143-172: Endereço
  headerLote += padRight("1400", 5); // 173-177: Número
  headerLote += padRight("BELA VISTA", 15); // 178-192: Bairro
  headerLote += padRight("SAO PAULO", 20); // 193-212: Cidade
  headerLote += "01310100"; // 213-220: CEP
  headerLote += "SP"; // 221-222: UF
  headerLote += padRight("", 18); // 223-240: Reservado
  lines.push(headerLote.slice(0, 240).padEnd(240, " "));

  // 3. SEGMENTOS A E B PARA CADA COLABORADOR / PRESTADOR
  let seqRegistro = 1;
  let valorTotalLote = 0;

  payments.forEach((pay) => {
    valorTotalLote += pay.valorLiquido;
    const isDocCNPJ = cleanDigits(pay.documento).length > 11;

    // Segmento A: Dados do Favorecido & Valor
    let segA = "";
    segA += banco; // 1-3
    segA += "0001"; // 4-7: Lote 1
    segA += "3"; // 8: Tipo 3 (Detalhe)
    segA += padLeft(seqRegistro++, 5); // 9-13: Nº Sequencial
    segA += "A"; // 14: Segmento A
    segA += "000"; // 15-17: Tipo de movimento (000 = Inclusão de Pagamento)
    segA += "000"; // 18-20: Código da câmara de compensação (000 = TED/Pix)
    segA += padLeft(cleanDigits(pay.bancoCodigo || "341"), 3); // 21-23: Banco favorecido
    segA += padLeft(cleanDigits(pay.agencia || "0001"), 5); // 24-28: Agência favorecido
    segA += " "; // 29
    segA += padLeft(cleanDigits(pay.conta || "123456"), 12); // 30-41: Conta corrente
    segA += "0 "; // 42-43: DV
    segA += padRight(pay.nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase(), 30); // 44-73: Nome Favorecido
    segA += padRight(`MED-${pay.id}`, 20); // 74-93: Seu Número / Protocolo
    segA += dateStr; // 94-101: Data do pagamento
    segA += "BRL"; // 102-104: Moeda Real
    segA += padLeft(0, 15); // 105-119: Quantidade moeda
    segA += formatCurrencyToCNAB(pay.valorLiquido); // 120-134: Valor Líquido (15 dígitos com centavos)
    segA += padRight("", 20); // 135-154: Nosso Número banco
    segA += dateStr; // 155-162: Data efetiva
    segA += formatCurrencyToCNAB(pay.valorLiquido); // 163-177: Valor efetivo
    segA += padRight("FOLHA MEDCORE", 40); // 178-217: Finalidade
    segA += padRight("", 23); // 218-240: Reservado
    lines.push(segA.slice(0, 240).padEnd(240, " "));

    // Segmento B: Dados Complementares (Chave Pix / CPF / CNPJ)
    let segB = "";
    segB += banco; // 1-3
    segB += "0001"; // 4-7
    segB += "3"; // 8
    segB += padLeft(seqRegistro++, 5); // 9-13
    segB += "B"; // 14: Segmento B
    segB += padRight("", 3); // 15-17
    segB += isDocCNPJ ? "2" : "1"; // 18: Inscrição 1 = CPF, 2 = CNPJ
    segB += padLeft(cleanDigits(pay.documento), 14); // 19-32: CPF ou CNPJ
    segB += padRight("AVENIDA PAULISTA 1800", 30); // 33-62: Logradouro
    segB += padRight("1400", 5); // 63-67: Número
    segB += padRight("", 15); // 68-82: Complemento
    segB += padRight("CENTRO", 15); // 83-97: Bairro
    segB += padRight("SAO PAULO", 20); // 98-117: Cidade
    segB += "01310100"; // 118-125: CEP
    segB += "SP"; // 126-127: UF
    segB += dateStr; // 128-135: Data Vencimento
    segB += formatCurrencyToCNAB(pay.valorLiquido); // 136-150: Valor
    segB += padLeft(0, 15); // 151-165: Abatimento
    segB += padLeft(0, 15); // 166-180: Desconto
    segB += padLeft(0, 15); // 181-195: Mora
    segB += padLeft(0, 15); // 196-210: Multa
    segB += padRight(pay.chavePix || pay.documento, 30); // 211-240: Chave Pix ou Identificador
    lines.push(segB.slice(0, 240).padEnd(240, " "));
  });

  // 4. TRAILER DE LOTE (Tipo 5)
  let trailerLote = "";
  trailerLote += banco; // 1-3
  trailerLote += "0001"; // 4-7: Lote 1
  trailerLote += "5"; // 8: Tipo 5 (Trailer de Lote)
  trailerLote += padRight("", 9); // 9-17
  trailerLote += padLeft(seqRegistro + 1, 6); // 18-23: Quantidade de registros do lote
  trailerLote += formatCurrencyToCNAB(valorTotalLote); // 24-38: Somatório dos valores do lote
  trailerLote += padLeft(0, 18); // 39-56: Quantidade de moedas
  trailerLote += padRight("", 184); // 57-240: Reservado
  lines.push(trailerLote.slice(0, 240).padEnd(240, " "));

  // 5. TRAILER DE ARQUIVO (Tipo 9)
  let trailerArquivo = "";
  trailerArquivo += banco; // 1-3
  trailerArquivo += "9999"; // 4-7: Lote 9999
  trailerArquivo += "9"; // 8: Tipo 9 (Trailer de Arquivo)
  trailerArquivo += padRight("", 9); // 9-17
  trailerArquivo += "000001"; // 18-23: Quantidade de lotes (1)
  trailerArquivo += padLeft(lines.length + 1, 6); // 24-29: Total de registros do arquivo
  trailerArquivo += padRight("", 211); // 30-240: Reservado
  lines.push(trailerArquivo.slice(0, 240).padEnd(240, " "));

  return lines.join("\r\n");
}

export interface CNABRetornoRecord {
  sequencial: number;
  tipoSegmento: string;
  codigoOcorrencia: string; // "00" = Crédito Efetivado / Pago, outros = Rejeição
  status: "PAGO" | "REJEITADO" | "PROCESSANDO";
  documentoFavorecido: string;
  nomeFavorecido: string;
  valorPago: number;
  dataPagamento: string;
  motivoRejeicao?: string;
}

export interface CNABRetornoResult {
  bancoCodigo: string;
  dataArquivo: string;
  totalRegistros: number;
  totalValorPago: number;
  pagamentosLiquidados: CNABRetornoRecord[];
  pagamentosRejeitados: CNABRetornoRecord[];
}

/**
 * Realiza o parse do arquivo de retorno bancário CNAB 240 (.RET)
 * Processa a liquidação financeira mudando o status dos pagamentos de Pendente para Pago
 */
export function parseCNAB240Retorno(retornoContent: string): CNABRetornoResult {
  const lines = retornoContent.split(/\r?\n/).filter(line => line.trim().length >= 240);
  
  let totalValorPago = 0;
  const pagamentosLiquidados: CNABRetornoRecord[] = [];
  const pagamentosRejeitados: CNABRetornoRecord[] = [];

  const bancoCodigo = lines[0] ? lines[0].slice(0, 3) : "341";
  const dataArquivoRaw = lines[0] ? lines[0].slice(143, 151) : "";
  const dataArquivo = dataArquivoRaw.length === 8 
    ? `${dataArquivoRaw.slice(6, 8)}/${dataArquivoRaw.slice(4, 6)}/${dataArquivoRaw.slice(0, 4)}` 
    : new Date().toLocaleDateString("pt-BR");

  lines.forEach((line) => {
    const tipoRegistro = line[7]; // Posição 8 (índice 7)
    if (tipoRegistro === "3") {
      // Registro detalhe de lote
      const segmento = line[13]; // Posição 14: Segmento A, B ou J
      if (segmento === "A") {
        const codigoOcorrencia = line.slice(230, 232).trim() || "00";
        const valorPagoCents = parseInt(line.slice(119, 134), 10) || 0;
        const valorPago = valorPagoCents / 100;
        const nomeFavorecido = line.slice(43, 73).trim();
        const dataPagamentoRaw = line.slice(93, 101);
        const dataPagamento = dataPagamentoRaw.length === 8 
          ? `${dataPagamentoRaw.slice(6, 8)}/${dataPagamentoRaw.slice(4, 6)}/${dataPagamentoRaw.slice(0, 4)}` 
          : new Date().toLocaleDateString("pt-BR");
        const docFavorecido = line.slice(73, 93).trim();

        const isPago = codigoOcorrencia === "00" || codigoOcorrencia === "BD";

        const record: CNABRetornoRecord = {
          sequencial: parseInt(line.slice(8, 13), 10) || 1,
          tipoSegmento: "A",
          codigoOcorrencia,
          status: isPago ? "PAGO" : "REJEITADO",
          documentoFavorecido: docFavorecido,
          nomeFavorecido,
          valorPago,
          dataPagamento,
          motivoRejeicao: isPago ? undefined : `Rejeição bancária código: ${codigoOcorrencia}`
        };

        if (isPago) {
          totalValorPago += valorPago;
          pagamentosLiquidados.push(record);
        } else {
          pagamentosRejeitados.push(record);
        }
      }
    }
  });

  return {
    bancoCodigo,
    dataArquivo,
    totalRegistros: pagamentosLiquidados.length + pagamentosRejeitados.length,
    totalValorPago: Math.round(totalValorPago * 100) / 100,
    pagamentosLiquidados,
    pagamentosRejeitados
  };
}
