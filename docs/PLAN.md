# Fase 2: Infraestrutura de Dados (Supabase)

Este plano detalha a implementação da infraestrutura de dados para a plataforma **Medcore SaaS**, focando em segurança, multi-tenancy (múltiplos inquilinos) e integração robusta com o Next.js utilizando o Supabase.

## Proposed Changes

### 1. Database Layer (`database-architect`, `security-auditor`)
A base de dados atual (`supabase_setup.sql`) será refinada e aplicada.
- **Triggers Automáticos:** Criar trigger no PostgreSQL que escuta a tabela `auth.users` e automaticamente insere um registro em `public.profiles`.
- **Refinamento RLS:** Garantir que todas as consultas (SELECT/INSERT/UPDATE/DELETE) estão rigorosamente protegidas limitando o acesso ao `company_id` do usuário logado.
- **Segurança:** Desativar acesso anônimo onde não for estritamente necessário.

### 2. Configuração do Cliente Next.js (`backend-specialist`)
Migrar/Atualizar o cliente atual para suportar as boas práticas do Next.js App Router (usando `@supabase/ssr`).

#### [NEW] `src/utils/supabase/server.ts`
Cliente para Server Components, capaz de ler cookies.

#### [NEW] `src/utils/supabase/client.ts`
Cliente para Client Components (Browser).

#### [NEW] `src/utils/supabase/middleware.ts`
Middleware do Next.js (`src/middleware.ts`) para renovação contínua do token JWT e bloqueio de rotas protegidas.

### 3. Integração TypeScript (`frontend-specialist`)

#### [NEW] `src/types/supabase.ts`
Geração automática dos tipos do schema do Supabase para garantir end-to-end type safety nas consultas ao DB.

### 4. Camada de Autenticação na UI (`frontend-specialist`)

#### [NEW] `src/contexts/AuthContext.tsx` e `src/hooks/useAuth.ts`
Contexto para disponibilizar os dados do usuário, sua `role` e seu `company_id` globalmente no frontend.

## Open Questions

> [!IMPORTANT]
> 1. Vocês já possuem o projeto criado no painel online do Supabase ou estão rodando localmente (Supabase CLI)?
> 2. Deseja que a geração dos tipos TypeScript seja integrada ao comando `npm run dev` / package.json?

## Verification Plan

### Testes Manuais e Automatizados (`test-engineer`)
- **Login/Signup Flow**: Validar que tokens são armazenados corretamente via cookies (SSR compliance).
- **Isolamento Multi-Tenant**: Testar o vazamento de dados tentando acessar um `medical_record` usando um usuário autenticado pertencente a uma `company_id` diferente.
- **Permissões de Role**: Verificar se um usuário recém-criado (sem cargo/role administrativa) não consegue executar operações do `super_admin`.

### Scripts
- `python .agent/skills/vulnerability-scanner/scripts/security_scan.py .` para confirmar a ausência de chaves vazadas ou vulnerabilidades de cookie-hijacking.
