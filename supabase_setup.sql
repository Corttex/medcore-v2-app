-- ==========================================
-- MEDCORE SAAS - DATABASE SETUP v2
-- EXECUTAR NO SQL EDITOR DO SUPABASE
-- ==========================================

-- 1. EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABELA DE EMPRESAS (TENANTS)
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    tax_id TEXT UNIQUE, -- CNPJ
    plan_type TEXT DEFAULT 'basic',
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABELA DE PERFIS (USUÁRIOS)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT UNIQUE,
    role TEXT CHECK (role IN ('super_admin', 'company_admin', 'employee', 'individual_user')) DEFAULT 'individual_user',
    company_id UUID REFERENCES companies(id),
    pin TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABELA DE PAGAMENTOS
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id),
    user_id UUID REFERENCES profiles(id),
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'BRL',
    status TEXT NOT NULL, -- pending, approved, rejected
    mp_preference_id TEXT, -- Mercado Pago ID
    mp_payment_id TEXT,    -- Mercado Pago Transaction ID
    raw_response JSONB,    -- Full log for debugging
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABELA DE PRONTUÁRIOS MÉDICOS
CREATE TABLE IF NOT EXISTS medical_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES profiles(id),
    doctor_id UUID REFERENCES profiles(id),
    company_id UUID REFERENCES companies(id),
    content JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. TABELA DE MÓDULOS (CATÁLOGO)
CREATE TABLE IF NOT EXISTS modules (
    id TEXT PRIMARY KEY, -- Slug unico (ex: 'telemedicine', 'stock_management')
    name TEXT NOT NULL,
    description TEXT,
    category TEXT, -- medical, administrative, billing
    is_premium BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. ATIVAÇÃO DE MÓDULOS POR EMPRESA
CREATE TABLE IF NOT EXISTS company_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    module_id TEXT REFERENCES modules(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    activated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(company_id, module_id)
);

-- 8. TABELA DE TIMES (EQUIPES POR EMPRESA)
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. FUNÇÕES DE SEGURANÇA AVANÇADA
-- Verificação de PIN sem retornar o PIN para o cliente
CREATE OR REPLACE FUNCTION verify_user_pin(p_user_id UUID, p_pin TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = p_user_id AND pin = p_pin
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- SEGURANÇA: ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;

-- FUNÇÃO AUXILIAR: Obter Company ID do usuário logado
-- SECURITY DEFINER é necessário para evitar recursão infinita no RLS
CREATE OR REPLACE FUNCTION get_my_company()
RETURNS UUID AS $$
  SELECT company_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- FUNÇÃO AUXILIAR: Obter Role do usuário logado
-- SECURITY DEFINER é necessário para evitar recursão infinita no RLS
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ------------------------------------------
-- POLÍTICAS: COMPANIES
-- ------------------------------------------
CREATE POLICY "SuperAdmins look at all companies" ON companies
    FOR ALL USING (get_my_role() = 'super_admin');

CREATE POLICY "Admins look at their own company" ON companies
    FOR SELECT USING (id = get_my_company());

-- ------------------------------------------
-- POLÍTICAS: PROFILES
-- ------------------------------------------
CREATE POLICY "SuperAdmins look at all profiles" ON profiles
    FOR ALL USING (get_my_role() = 'super_admin');

CREATE POLICY "Users look at their own profile" ON profiles
    FOR ALL USING (id = auth.uid());

CREATE POLICY "Company admins look at company profiles" ON profiles
    FOR SELECT USING (company_id = get_my_company());

-- ------------------------------------------
-- POLÍTICAS: PAYMENTS
-- ------------------------------------------
CREATE POLICY "SuperAdmins look at all payments" ON payments
    FOR ALL USING (get_my_role() = 'super_admin');

CREATE POLICY "Company admins look at their payments" ON payments
    FOR SELECT USING (company_id = get_my_company());

-- ------------------------------------------
-- POLÍTICAS: MEDICAL RECORDS
-- ------------------------------------------
CREATE POLICY "SuperAdmins look at all records" ON medical_records
    FOR ALL USING (get_my_role() = 'super_admin');

CREATE POLICY "Doctors/Employees look at company records" ON medical_records
    FOR ALL USING (company_id = get_my_company() AND get_my_role() IN ('company_admin', 'employee'));

CREATE POLICY "Patients look at their own records" ON medical_records
    FOR SELECT USING (patient_id = auth.uid());

-- ------------------------------------------
-- POLÍTICAS: MODULES
-- ------------------------------------------
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can look at modules" ON modules
    FOR SELECT USING (true);

-- ------------------------------------------
-- POLÍTICAS: COMPANY_MODULES
-- ------------------------------------------
ALTER TABLE company_modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "SuperAdmins look at all company_modules" ON company_modules
    FOR ALL USING (get_my_role() = 'super_admin');

CREATE POLICY "Users look at their company modules" ON company_modules
    FOR SELECT USING (company_id = get_my_company());

-- ------------------------------------------
-- POLÍTICAS: TEAMS
-- ------------------------------------------
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "SuperAdmins look at all teams" ON teams
    FOR ALL USING (get_my_role() = 'super_admin');

CREATE POLICY "Users look at their company teams" ON teams
    FOR SELECT USING (company_id = get_my_company());

-- ------------------------------------------
-- 10. TABELA DE CONFIGURAÇÕES GLOBAIS
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Inserir configuração inicial do Acesso Rápido
INSERT INTO system_settings (key, value, description)
VALUES ('show_demo_access', 'true'::jsonb, 'Exibir botões de atalho na tela de login')
ON CONFLICT (key) DO NOTHING;

ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SuperAdmins manage settings" ON system_settings
    FOR ALL USING (get_my_role() = 'super_admin');

CREATE POLICY "Anyone can read public settings" ON system_settings
    FOR SELECT USING (true);

-- Função para buscar configuração sem precisar lidar com JSONB bruto no client se preferir
CREATE OR REPLACE FUNCTION get_system_setting(p_key TEXT)
RETURNS JSONB AS $$
    SELECT value FROM system_settings WHERE key = p_key;
$$ LANGUAGE sql STABLE SECURITY DEFINER;
