# 📋 Relatório Oficial de Implantação e Deploy — MEDCore v2.0

Este documento consolida todo o processo de engenharia, refatoração de infraestrutura, resolução de bugs de build e deploy em produção do ecossistema **MEDCore** na VPS Hetzner via Coolify.

---

## 🖥️ 1. Dados de Acesso e Infraestrutura

### Produção (Nuvem)
* **Domínio Público da Aplicação:** [https://medcore.gestaocomercial360.com.br](https://medcore.gestaocomercial360.com.br)
* **Login Master Admin:**
  * **E-mail:** `admin@medcore.com.br`
  * **Senha:** `123456`
* **Unidade Hospitalar Ativa:** Hospital Central - MEDCore (`f8248a1c-6246-465b-b382-756d28bfeb41`)
* **Módulos Ativos:** 11 módulos (Agenda, Prontuário IA, Faturamento TISS, CRM, Estoque, Painel TV, Telemedicina, etc.)

### Servidor VPS (Hetzner)
* **IP do Servidor:** `2.28.26.9`
* **SSH:** `root`
* **Painel Coolify:** Porta `8000` (`http://2.28.26.9:8000`)
* **Repositório GitHub:** `https://github.com/Corttex/medcore-v2-app.git` (Branch: `main`)

### Banco de Dados (PostgreSQL no Coolify)
* **Driver:** PostgreSQL (Prisma ORM)
* **Host Interno:** `ncpw3monwfxingioeycs7vw5:5432`
* **Connection String:**  
  `postgres://postgres:hS1nA9W5DMwiYffUnwhqC5V6s2nHQlwbCLfLmUsbJ25kby8DW48jk9sw8yDJ9UyT@ncpw3monwfxingioeycs7vw5:5432/postgres`

---

## 🛠️ 2. Problemas Enfrentados e Soluções Aplicadas

### 1. Migração de Banco de Dados (SQLite ➡️ PostgreSQL)
* **Contexto:** O projeto utilizava originalmente SQLite local (`dev.db`). Para atender ao ambiente de produção multi-instância e concorrência hospitalar, migramos o Prisma para PostgreSQL.
* **Ação:** Refatorado `prisma/schema.prisma` para `provider = "postgresql"` e configuradas as variáveis de ambiente de produção no Coolify.

### 2. Timeouts de Build com Google Fonts no Docker
* **Problema:** A compilação do Next.js travava ou estourava o timeout ao tentar baixar as fontes do Google Fonts (`next/font/google`) durante a fase de build dentro do container Docker.
* **Solução:** Removidas as chamadas de `next/font/google` no `src/app/layout.tsx` e centralizada a importação via `@import` CSS no `src/app/globals.css`.

### 3. Falha de Pré-renderização no Next.js 15 (`Missing Suspense`)
* **Problema:** O Next.js 15 exige que componentes ou páginas que utilizam `useSearchParams()` estejam encapsulados por um boundary `<Suspense>`. Sem isso, o comando `npm run build` falhava ao gerar as rotas estáticas.
* **Solução:** No arquivo `src/app/page.tsx`, o hook de autenticação por query param foi isolado no componente `AuthCallbackHandler` e envolvido em `<Suspense fallback={null}>`.

### 4. Crash do BullMQ por Conexão Imediata com Redis (`ECONNREFUSED`)
* **Problema:** Durante o `next build`, os endpoints de API são avaliados estaticamente. O arquivo `src/lib/queue/redis.ts` tentava estabelecer conexão imediata com o Redis (`127.0.0.1:6379`), que não existia na fase de build do Docker, abortando o processo com erro de conexão recusada.
* **Solução:** Adicionada a diretiva `lazyConnect: true` na configuração do `ioredis`. A conexão agora só é aberta sob demanda em tempo de execução, garantindo que o build passe sem depender de serviços externos.

### 5. Trava de Gravação do Redis do Coolify (`MISCONF RDB`)
* **Problema:** O Coolify reportou:  
  `Warning: Post-finished actions failed: MISCONF Redis is configured to save RDB snapshots, but it's currently unable to persist to disk...`
* **Causa:** O Redis interno do Coolify (`coolify-redis`) ativou a trava de proteção devido a acúmulo de cache de compilações do Docker ou falha de persistência de snapshot em disco.
* **Solução:** 
  * Destravado o Redis do Coolify com:
    ```bash
    docker exec coolify-redis redis-cli config set stop-writes-on-bgsave-error no
    ```
  * Limpeza de camadas antigas de build para liberar armazenamento na VPS:
    ```bash
    docker builder prune -af
    ```

### 6. Inicialização do Banco na VPS (Seed de Produção)
* **Ação Executada:** No container da aplicação na VPS, executou-se:
  ```bash
  node scripts/reset-clean-db.js
  ```
* **Resultado:**
  * Dados de teste/resíduos limpos;
  * Administrador `admin@medcore.com.br` cadastrado e com hash bcrypt gerado;
  * Unidade Matriz criada;
  * 11 módulos ativados com sucesso;
  * Regras de automação de CRM populadas.

### 7. Refinamento de UI no Dashboard de NPS (`/dashboard/nps`)
* **Problema:** O card de **Score NPS Geral** apresentava quebra de linha visual desconfortável no título e na tag `ZONA DE APERFEIÇOAMENTO` (em 2 linhas com letras gigantescas em caixa alta).
* **Solução:** 
  * Aplicado `whitespace-nowrap` e `shrink-0` nos elementos;
  * Badge redimensionada para `text-xs font-semibold` com Title Case;
  * Cores dinâmicas inteligentes (Excelência: Verde, Qualidade: Azul, Aperfeiçoamento: Âmbar);
  * Alinhamento responsivo perfeito em `flex items-center justify-between gap-2 min-w-0`.

---

## 🚀 3. Ciclo de Atualizações Futuras

Para qualquer nova alteração ou melhoria no código:
1. Faça as modificações locais no código.
2. No terminal local:
   ```bash
   git add .
   git commit -m "feat/fix: descricao da melhoria"
   git push origin main
   ```
3. O Coolify detectará o push no repositório `Corttex/medcore-v2-app` e executará o build e deploy automaticamente sem interrupção do banco de dados.
