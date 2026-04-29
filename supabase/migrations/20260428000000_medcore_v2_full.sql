-- MedCore V2 - Full System Schema Reset
-- Date: 2026-04-28

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
    pin_hash TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabela de Unidades Hospitalares
CREATE TABLE public.units (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabela de Permissões de Módulos
CREATE TABLE public.module_permissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    module_name TEXT NOT NULL, -- 'auditoria', 'financeiro', 'juridico', 'operacional'
    is_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, module_name)
);

-- 5. Tabela de Links de Acesso Executivo
CREATE TABLE public.access_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    link_token TEXT UNIQUE NOT NULL,
    target_role public.user_role DEFAULT 'executive',
    pin_code TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Tabela de Pacientes
CREATE TABLE public.pacientes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT,
    telefone TEXT,
    cpf TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 7. Tabela de Reuniões
CREATE TABLE public.meetings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME WITHOUT TIME ZONE,
    duration TEXT,
    type TEXT,
    location TEXT,
    subject TEXT,
    agenda TEXT,
    minutes TEXT,
    food TEXT,
    equipment TEXT,
    deadlines TEXT,
    status TEXT DEFAULT 'Agendada',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 8. Tabela de Convidados de Reuniões
CREATE TABLE public.meeting_guests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 9. Tabela de Lembretes
CREATE TABLE public.reminders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME WITHOUT TIME ZONE,
    type TEXT DEFAULT 'once',
    status TEXT DEFAULT 'pending',
    notify_email BOOLEAN DEFAULT FALSE,
    notify_whatsapp BOOLEAN DEFAULT FALSE,
    whatsapp_number TEXT,
    email TEXT,
    is_fixed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 10. Tabela de Avaliações Faciais (Módulo Estético/Clínico)
CREATE TABLE public.face_assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id UUID REFERENCES public.pacientes(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    marked_points JSONB DEFAULT '[]'::JSONB NOT NULL,
    total_estimate NUMERIC,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 11. Configurações de Sistema
CREATE TABLE public.system_configs (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 12. Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.face_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_configs ENABLE ROW LEVEL SECURITY;

-- 13. Políticas de Segurança (Exemplo Básico)
CREATE POLICY "Enable read access for all authenticated users" ON public.units FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable all access for own profile" ON public.profiles FOR ALL TO authenticated USING (auth.uid() = id);
CREATE POLICY "Enable all access for own meetings" ON public.meetings FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Enable all access for own reminders" ON public.reminders FOR ALL TO authenticated USING (auth.uid() = user_id);

-- 14. Função Automática para Criar Profile no Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', ''), 
    COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
    'viewer'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para disparar a função
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 15. Seed de Unidades Operacionais
INSERT INTO public.units (name, type, active) VALUES
('Unidade Central MedCore', 'Hospital Geral', true),
('Clínica de Especialidades', 'Ambulatório', true);

-- 16. Seed de Configurações Iniciais
INSERT INTO public.system_configs (key, value) VALUES
('platform_status', '{"online": true, "version": "2.0.0"}'),
('security_policy', '{"session_timeout": 180, "require_pin": true}');
