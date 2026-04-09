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

-- ==========================================
-- SEGURANÇA: ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;

-- FUNÇÃO AUXILIAR: Obter Company ID do usuário logado
CREATE OR REPLACE FUNCTION get_my_company()
RETURNS UUID AS $$
  SELECT company_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE;

-- FUNÇÃO AUXILIAR: Obter Role do usuário logado
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE;

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
