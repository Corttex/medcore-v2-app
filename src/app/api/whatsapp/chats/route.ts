import { NextResponse } from "next/server";

const EVOLUTION_URL = process.env.EVOLUTION_API_URL || "https://wa.gestaocomercial360.com.br";
const EVOLUTION_KEY = process.env.EVOLUTION_API_KEY || "medcore_secret_key_2026";
const INSTANCE_NAME = process.env.EVOLUTION_INSTANCE_NAME || "medcore";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const remoteJid = searchParams.get("remoteJid");

    // 1. Se remoteJid foi fornecido, buscar mensagens dessa conversa específica
    if (remoteJid) {
      const msgRes = await fetch(`${EVOLUTION_URL}/chat/findMessages/${INSTANCE_NAME}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": EVOLUTION_KEY
        },
        body: JSON.stringify({
          where: {
            key: {
              remoteJid
            }
          },
          take: 30
        }),
        cache: "no-store"
      });

      if (msgRes.ok) {
        const msgData = await msgRes.json();
        const records = msgData?.messages?.records || (Array.isArray(msgData) ? msgData : []);
        
        const formatted = records.map((m: any) => ({
          id: m.key?.id || m.id,
          fromMe: m.key?.fromMe ?? false,
          sender: m.pushName || (m.key?.fromMe ? "Clínica" : "Paciente"),
          text: m.message?.conversation || 
                m.message?.extendedTextMessage?.text || 
                m.message?.imageMessage?.caption || 
                (m.message?.audioMessage ? "🎵 [Áudio]" : "Mensagem"),
          timestamp: m.messageTimestamp ? new Date(Number(m.messageTimestamp) * 1000).toISOString() : new Date().toISOString()
        })).sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        return NextResponse.json({ success: true, messages: formatted });
      }
    }

    // 2. Se não tem remoteJid, lista todos os chats vivos
    const chatsRes = await fetch(`${EVOLUTION_URL}/chat/findChats/${INSTANCE_NAME}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": EVOLUTION_KEY
      },
      body: JSON.stringify({}),
      cache: "no-store"
    });

    if (chatsRes.ok) {
      const chatsData = await chatsRes.json();
      const rawChats = Array.isArray(chatsData) ? chatsData : [];

      const formattedChats = rawChats.map((c: any) => {
        const phone = c.remoteJid ? c.remoteJid.replace(/@.*$/, "") : "";
        return {
          id: c.id || c.remoteJid,
          remoteJid: c.remoteJid,
          name: c.pushName || c.name || `WhatsApp ${phone}`,
          phone,
          profilePicUrl: c.profilePicUrl || null,
          unreadCount: c.unreadCount || 0,
          updatedAt: c.updatedAt || new Date().toISOString()
        };
      });

      return NextResponse.json({
        success: true,
        total: formattedChats.length,
        chats: formattedChats
      });
    }

    return NextResponse.json({ success: true, chats: [] });

  } catch (error: any) {
    console.error("Erro ao sincronizar chats da Evolution API:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
