# 🚀 Guia Oficial de Deploy & Atualização na Hetzner via Coolify — MEDCore

Este documento contém o passo a passo exato e mastigado para realizar o deploy do **MEDCore** na VPS Hetzner através do Coolify, sem precisar enviar `.env` por SSH nem fazer processos manuais complexos.

---

## 📋 Resumo das Informações do Projeto
- **Repositório GitHub:** `https://github.com/Corttex/medcore-v2-app.git`
- **Branch:** `main`
- **Porta da Aplicação:** `3000`
- **Acesso Inicial Admin:**
  - **E-mail:** `admin@medcore.com.br`
  - **Senha:** `123456`

---

## 🛠️ Passo 1: Criar a Aplicação no Coolify

1. Acesse o painel do seu **Coolify** no navegador.
2. Selecione seu **Projeto** e o **Ambiente** (ex: `Production`).
3. Clique no botão **+ New Resource**.
4. Escolha **Public Repository** ou **Private Repository (GitHub App)**.
5. Preencha os dados do repositório:
   - **Repository URL:** `https://github.com/Corttex/medcore-v2-app`
   - **Branch:** `main`
   - **Build Pack:** Selecione **Nixpacks** (o Coolify detecta automaticamente como Next.js).
6. Na tela de configurações da aplicação recém-criada:
   - Defina a **Port** (porta interna): `3000`
   - Defina o **Domain** (seu domínio com HTTPS): ex. `https://app.medcore.com.br` ou `https://medcore.seudominio.com`

---

## 🔑 Passo 2: Configurar as Variáveis de Ambiente (Sem enviar `.env`)

No Coolify, você **não precisa enviar o arquivo `.env` para o servidor**.

1. Na aplicação no Coolify, clique na aba **Environment Variables**.
2. Clique no botão **Developer View** (ou *Bulk Edit*), que abre uma caixa de texto grande para colar tudo de uma vez.
3. Copie todo o bloco abaixo e cole diretamente na caixa:

```env
DATABASE_URL="file:./prisma/dev.db"
PORT=3000
NODE_ENV=production

JWT_SECRET=orion-crm-super-secret-key-2026-v2

# API IA (Google Gemini)
GEMINI_API_KEY=AQ.Ab8RN6IPEGqfpVJYBJtylYOSj1CnLSkJTNUyWoixqv2Qzdx03w
GOOGLE_API_KEY=AQ.Ab8RN6JqySlRYlPaYgodnUYatpah6Vj5T-GcAhI5LVgeSFSmIg

# OpenRouter
OPENROUTER_API_KEY=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
NEXT_PUBLIC_OPENROUTER_API_KEY=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

# E-mail Corporativo & Disparos (Resend)
RESEND_API_KEY=re_GuPuMtVK_NgKZENvZubd9sBcp3vNEDtTo

# Cloudflare R2 (Armazenamento de Arquivos e Laudos)
R2_ACCOUNT_ID=1cfab13e4d7d62d5ea0d99f5a6d75d17
R2_ACCESS_KEY_ID=79a48cbeb5d23d635585e7a49cec81a0
R2_SECRET_ACCESS_KEY=3c43e688d2a0962003fe2f0a3d965e8046ad5bbd9ff0af0fa9d2cf35ad05a606
R2_BUCKET_NAME=medcore
NEXT_PUBLIC_R2_PUBLIC_URL=https://1cfab13e4d7d62d5ea0d99f5a6d75d17.r2.cloudflarestorage.com

# WhatsApp API (Z-API)
ZAPI_INSTANCE_ID=3F852DE7C94081066DE52AA1C12435ED
ZAPI_INSTANCE_TOKEN=B65023E68FBF0689F6146E25
```

4. Clique em **Save**.

---

## 💾 Passo 3: Garantir a Persistência do Banco (Persistent Storage)

Como o banco utilizado é SQLite (`dev.db`), precisamos garantir que os dados não sejam apagados quando o container reiniciar ou atualizar:

1. No Coolify, na aplicação, acesse a aba **Storages** (ou *Persistent Storage*).
2. Clique em **Add Storage**.
3. Preencha:
   - **Name:** `medcore-db-data`
   - **Destination Path:** `/app/prisma`
4. Clique em **Save**.

---

## ⚡ Passo 4: Post-Deployment Command (Inicialização Automática do Banco)

Para inicializar o banco zerado com o usuário Admin, a Unidade Matriz e os Módulos ativos sem você precisar abrir terminal:

1. Na aplicação no Coolify, vá em **Configuration** → **General**.
2. No campo **Post Deployment Command**, digite:
   ```bash
   node scripts/reset-clean-db.js
   ```
3. Salve as alterações.

> **Nota:** Caso prefira rodar isso manualmente apenas uma vez na vida:
> - Deixe o campo vazio.
> - Após o primeiro deploy, vá na aba **Terminal** da aplicação no Coolify e rode:
>   `node scripts/reset-clean-db.js`

---

## 🚀 Passo 5: Executar o Deploy

1. No canto superior direito do Coolify, clique no botão **Deploy**.
2. Acompanhe os logs em tempo real na aba **Deployments**. O Coolify vai:
   - Baixar o código do GitHub (`main`)
   - Instalar dependências (`npm install`)
   - Executar o build do Next.js
   - Rodar o post-deploy criando o admin
   - Gerar o certificado SSL (HTTPS) Let's Encrypt automaticamente
3. Quando o status mudar para **Healthy (Verde)**, acesse a URL configurada (ex: `https://app.medcore.com.br`).
4. Faça login com:
   - **E-mail:** `admin@medcore.com.br`
   - **Senha:** `123456`

---

## 🔄 Como Atualizar em Deploys Futuros

Sempre que fizermos novas alterações no código e dermos `git push`:
1. Entre no Coolify.
2. Clique na aplicação **MEDCore**.
3. Clique em **Deploy** (ou configure o **Webhook do GitHub** no Coolify para deploy 100% automático a cada push).
4. O Coolify baixa a nova versão, compila e substitui o container sem perder o banco de dados (graças ao volume `/app/prisma`).
