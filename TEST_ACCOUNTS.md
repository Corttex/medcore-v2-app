# Guia de Teste: Usuários Master por Painel

Para testar todos os 4 níveis de hierarquia do sistema, você pode usar as contas de demonstração que o sistema fornece ou criar as suas próprias. 

Como a autenticação é gerenciada seguramente pela Supabase, a maneira mais fácil de contruir as contas é **fazer o cadastro normal pela interface que acabamos de corrigir** e, em seguida, rodar um pequeno comando SQL no painel da Supabase para subir o nível de acesso delas.

## Passo a Passo

### 1. Cadastre 4 novos usuários na tela inicial
- **Visão Global (SuperAdmin)**: `admin@seu-dominio.com`
- **Gestão da Empresa**: `gestor@seu-dominio.com`
- **Staff/Funcionário**: `staff@seu-dominio.com`
- **Usuário Padrão/BioFlow**: `bioflow@seu-dominio.com`

*Use uma senha simples para todos (ex: `SenhaSegura123!`).*

### 2. Configure os Níveis de Acesso (Roles)
Vá ao **SQL Editor** do Supabase e rode este código para aplicar instantaneamente os privilégios corretos:

```sql
UPDATE profiles SET role = 'super_admin' WHERE email = 'admin@seu-dominio.com';
UPDATE profiles SET role = 'company_admin' WHERE email = 'gestor@seu-dominio.com';
UPDATE profiles SET role = 'employee' WHERE email = 'staff@seu-dominio.com';
UPDATE profiles SET role = 'individual_user' WHERE email = 'bioflow@seu-dominio.com';
```

### 3. Links de Teste & Redirecionamento 
Se você fizer o login com a conta correta, o Middleware agora irá rotear sua navegação automaticamente da seguinte forma:

1. **Conta Admin** ➔ Será redirecionada para `localhost:3000/admin`
2. **Conta Gestor** ➔ Será redirecionada para `localhost:3000/management`
3. **Conta Staff** ➔ Será redirecionada para `localhost:3000/workspace`
4. **Conta BioFlow** ➔ Será redirecionada para `localhost:3000/dashboard`

> **Nota de Segurança**: Se você tentar acessar `localhost:3000/admin` com a conta `staff@`, o middleware te barrará e enviará de volta ao seu painel correto (`/workspace`). Teste isso!
