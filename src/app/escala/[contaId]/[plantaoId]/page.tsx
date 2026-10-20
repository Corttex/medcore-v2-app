import { Metadata } from "next";
import { EscalaPublicaView } from "./EscalaPublicaView";

interface PageProps {
  params: Promise<{
    contaId: string;
    plantaoId: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { contaId, plantaoId } = await params;
  return {
    title: `Painel de Escala - Conta ${contaId} | Plantão ${plantaoId} - MedCore`,
    description: `Visualização pública autorizada e em tempo real da escala de plantão para a conta ${contaId}. Acesso sem senha.`,
  };
}

export default async function EscalaPublicaPage({ params }: PageProps) {
  const { contaId, plantaoId } = await params;

  return <EscalaPublicaView contaId={contaId} plantaoId={plantaoId} />;
}
