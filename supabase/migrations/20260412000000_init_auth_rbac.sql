-- 1. Definição de Roles (Níveis de Acesso)
CREATE TYPE public.user_role AS ENUM (
    'super_admin', 
    'executive', 
    'manager', 
    'employee', 
    'viewer'
);

-- 2. Tabela de Perfis (Profiles)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    role public.user_role DEFAULT 'viewer',
    pin_hash TEXT, -- PIN de 4 dígitos (encriptado ou simples para validação RPC)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabela de Permissões de Módulos (Ativação Dinâmica)
CREATE TABLE public.module_permissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    module_name TEXT NOT NULL, -- 'auditoria', 'financeiro', 'juridico', 'operacional'
    is_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, module_name)
);

-- 4. Tabela de Links de Acesso Executivo (Links com PIN)
CREATE TABLE public.access_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    link_token TEXT UNIQUE NOT NULL,
    target_role public.user_role DEFAULT 'executive',
    pin_code TEXT NOT NULL, -- PIN de 4 dígitos
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB, -- Documenta se é p/ 'Diretor', 'Auditor' ou 'Jurídico'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Habilitar RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_links ENABLE ROW LEVEL SECURITY;

-- 6. Políticas de Segurança (RLS)
-- Profiles: Usuário vê apenas o próprio perfil. Admin vê tudo.
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- module_permissions: Usuário vê suas próprias permissões.
CREATE POLICY "Users can view own permissions" ON public.module_permissions FOR SELECT USING (auth.uid() = user_id);

-- 7. Função Automática para Criar Profile no Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    'viewer'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Trigger para disparar a função
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
