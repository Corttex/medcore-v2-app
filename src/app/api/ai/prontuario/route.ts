import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Groq from 'groq-sdk';
import { ChatAnthropic } from '@langchain/anthropic';
import { PromptTemplate } from '@langchain/core/prompts';
import { StructuredOutputParser } from '@langchain/core/output_parsers';
import { z } from 'zod';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '@/lib/storage/r2';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Definindo a estrutura de saída desejada com LangChain Zod
const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    sintomas: z.array(z.string()).describe("Lista de sintomas relatados pelo paciente"),
    diagnostico: z.string().describe("O diagnóstico principal ou hipótese diagnóstica"),
    prescricao: z.array(z.string()).describe("Remédios, exames ou procedimentos prescritos"),
    observacoes: z.string().describe("Observações gerais da consulta")
  })
);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('audio') as File;
    const meetingId = formData.get('meetingId') as string;

    if (!file || !meetingId) {
      return NextResponse.json({ error: 'Áudio e meetingId são obrigatórios' }, { status: 400 });
    }

    // 1. Converter o File para Buffer e Fazer Upload para o R2 (Backup do Prontuário)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filename = `prontuarios/${meetingId}_${uuidv4()}.m4a`;
    
    // Dispara o upload para a Cloudflare de forma assíncrona (não precisamos travar a thread de transcrição por isso)
    const uploadPromise = s3Client.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME || 'medcore',
      Key: filename,
      Body: buffer,
      ContentType: file.type || 'audio/m4a',
    })).catch(err => console.error("Falha ao salvar no R2:", err));

    // 2. Transcrever com Groq (Whisper ultrarrápido)
    // A API do Groq usa a mesma assinatura da OpenAI, que exige um objeto File-like.
    // Vamos criar um objeto compatível.
    const groqFile = new File([buffer], 'audio.m4a', { type: 'audio/m4a' });
    
    const transcription = await groq.audio.transcriptions.create({
      file: groqFile,
      model: "whisper-large-v3",
      prompt: "O contexto é uma consulta médica em português do Brasil.",
      response_format: "text",
      language: "pt"
    });

    const textoTranscrito = typeof transcription === 'string' ? transcription : (transcription as any).text;

    // 3. Summarizar e Estruturar com LangChain + Claude 3.5 Sonnet
    const model = new ChatAnthropic({
      modelName: 'claude-3-5-sonnet-20240620',
      temperature: 0,
      anthropicApiKey: process.env.ANTHROPIC_API_KEY
    });

    const formatInstructions = parser.getFormatInstructions();

    const prompt = new PromptTemplate({
      template: `Você é uma assistente médica (Dra. Conte). Sua função é ler a transcrição de uma consulta médica (onde o médico pode estar ditando ou gravando o áudio ambiente) e extrair os dados estruturados de forma extremamente precisa e clínica.

Transcrição da Consulta:
{transcricao}

Instruções de Saída:
{format_instructions}
`,
      inputVariables: ['transcricao'],
      partialVariables: { format_instructions: formatInstructions }
    });

    const chain = prompt.pipe(model).pipe(parser);
    const resumoEstruturado = await chain.invoke({ transcricao: textoTranscrito });

    // 4. Salvar tudo no Banco de Dados (Tabela Prontuario)
    await uploadPromise; // Garante que o R2 terminou
    const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${filename}`;

    const prontuario = await prisma.prontuario.upsert({
      where: { meetingId: meetingId },
      update: {
        transcricaoCrua: textoTranscrito,
        resumoJSON: JSON.stringify(resumoEstruturado),
        audioUrl: publicUrl
      },
      create: {
        meetingId: meetingId,
        transcricaoCrua: textoTranscrito,
        resumoJSON: JSON.stringify(resumoEstruturado),
        audioUrl: publicUrl
      }
    });

    // Marca o meeting como 'realizado'
    await prisma.meeting.update({
      where: { id: meetingId },
      data: { status: 'realizado' }
    });

    return NextResponse.json({ 
      success: true, 
      transcricao: textoTranscrito,
      resumo: resumoEstruturado,
      prontuarioId: prontuario.id
    });

  } catch (error) {
    console.error('Erro na pipeline de IA:', error);
    return NextResponse.json({ error: 'Falha ao processar o prontuário por IA' }, { status: 500 });
  }
}
