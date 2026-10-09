import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  
  try {
    const unitId = params.id;
    if (!unitId) {
      return NextResponse.json({ error: "ID da unidade é obrigatório" }, { status: 400 });
    }

    // Verificar se o usuário pertence à unidade e tem permissão (é owner)
    const userUnit = await prisma.userUnit.findFirst({
      where: {
        userId: session.user.id,
        unitId: unitId,
        role: "owner"
      },
      include: {
        unit: true
      }
    });

    if (!userUnit) {
      return NextResponse.json({ error: "Sem permissão para excluir esta unidade" }, { status: 403 });
    }

    const unitName = userUnit.unit.name;

    // Excluir a unidade (Cascade deletará convênios, contas, procedimentos, etc)
    await prisma.unit.delete({
      where: { id: unitId }
    });

    // Tentar enviar e-mail via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resendApiKey}`
          },
          body: JSON.stringify({
            from: "Medcore Security <no-reply@medcore.app>", // Assuma que o domínio foi validado ou use o de sandbox caso aplicável
            to: [session.user.email || "admin@medcore.app"],
            subject: `ALERTA DE SEGURANÇA: Unidade Excluída (${unitName})`,
            html: `
              <div style="font-family: sans-serif; color: #333;">
                <h2 style="color: #e53e3e;">Aviso de Segurança - MedCore</h2>
                <p>Olá,</p>
                <p>Informamos que o hospital/unidade <strong>${unitName}</strong> foi <strong>permanentemente excluído</strong> da plataforma.</p>
                <p>Todos os dados vinculados, incluindo contas financeiras, convênios e usuários atrelados a esta unidade, foram removidos.</p>
                <br />
                <p>Se você não realizou esta ação, entre em contato imediatamente com o suporte.</p>
                <p>Equipe MedCore</p>
              </div>
            `
          })
        });
      } catch (emailError) {
        console.error("Erro ao enviar e-mail via Resend:", emailError);
      }
    }

    // Limpar o primaryUnitId do usuário caso fosse a unidade apagada
    const user = await prisma.user.findUnique({ where: { id: session.user.id }});
    if (user?.primaryUnitId === unitId) {
       await prisma.user.update({
         where: { id: session.user.id },
         data: { primaryUnitId: null }
       });
    }

    return NextResponse.json({ success: true, message: "Unidade excluída com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar unidade:", error);
    return NextResponse.json({ error: "Erro interno ao deletar" }, { status: 500 });
  }
}
