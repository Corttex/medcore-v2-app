-- EXECUTAR NO SQL EDITOR DO SUPABASE

-- 1. Habilitar EXTENÇÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABELA DE EMPRESAS (TENANTS)
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  tax_id TEXT UNIQUE, -- CNPJ
  plan_type TEXT DEFAULT 'basic',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABELA DE PERFIS (USUÁRIOS)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE,
  role TEXT CHECK (role IN ('super_admin', 'company_admin', 'employee', 'individual_user')),
  company_id UUID REFERENCES companies(id),
  pin TEXT, -- Armazenado com hash no futuro, ou simples para operacional
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABELA DE ASSINATURAS E PAGAMENTOS
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id),
  status TEXT,
  mp_preference_id TEXT, -- ID do Mercado Pago
  next_billing TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABELA DE REGISTROS MÉDICOS (EXEMPLO)
CREATE TABLE medical_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES profiles(id),
  doctor_id UUID REFERENCES profiles(id),
  company_id UUID REFERENCES companies(id),
  content JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- CONFIGURAR ROW LEVEL SECURITY (RLS)

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;

-- POLÍTICA: SuperAdmin vê tudo
CREATE POLICY "SuperAdmins look at everything" ON profiles
  FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'super_admin'));

-- POLÍTICA: Usuários de Empresa veem apenas sua própria empresa
CREATE POLICY "Company users look at their own data" ON medical_records
  FOR ALL USING (company_id = (SELECT company_id FROM profiles WHERE id = auth.uid()));

-- POLÍTICA: Indivíduos veem apenas seus próprios registros
CREATE POLICY "Individuals look at their own records" ON medical_records
  FOR ALL USING (patient_id = auth.uid());
