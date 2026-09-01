-- Migração para o Módulo Financeiro e Emissão de Notas Fiscais (Integração Asaas)

-- 1. Criação do Enum de Métodos de Pagamento e Status
CREATE TYPE payment_method_enum AS ENUM ('PIX', 'CREDIT_CARD', 'BOLETO');
CREATE TYPE transaction_status_enum AS ENUM ('PENDING', 'RECEIVED', 'OVERDUE', 'REFUNDED');
CREATE TYPE split_status_enum AS ENUM ('PENDING', 'TRANSFERRED');
CREATE TYPE invoice_status_enum AS ENUM ('PENDING', 'AUTHORIZED', 'PROCESSING', 'DENIED', 'CANCELED');

-- 2. Tabela: asaas_customers (Pacientes vinculados ao Asaas)
CREATE TABLE public.asaas_customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paciente_id UUID NOT NULL REFERENCES public.pacientes(id) ON DELETE CASCADE,
    asaas_customer_id VARCHAR(255) NOT NULL UNIQUE,
    cpf_cnpj VARCHAR(18) NOT NULL,
    address_info JSONB, -- { "postalCode": "...", "addressNumber": "..." }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabela: financial_transactions (Cobranças geradas)
CREATE TABLE public.financial_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID NOT NULL REFERENCES public.units(id) ON DELETE RESTRICT,
    paciente_id UUID NOT NULL REFERENCES public.pacientes(id) ON DELETE RESTRICT,
    doctor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Médico executante
    asaas_payment_id VARCHAR(255) UNIQUE,
    description VARCHAR(255) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    status transaction_status_enum DEFAULT 'PENDING' NOT NULL,
    payment_method payment_method_enum NOT NULL,
    due_date DATE NOT NULL,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabela: financial_splits (Repasses para profissionais)
CREATE TABLE public.financial_splits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL REFERENCES public.financial_transactions(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    asaas_wallet_id VARCHAR(255) NOT NULL,
    split_value NUMERIC(10, 2), -- Valor fixo
    split_percent NUMERIC(5, 2), -- Ou porcentagem (ex: 30.00)
    status split_status_enum DEFAULT 'PENDING' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CHECK (
        (split_value IS NOT NULL AND split_percent IS NULL) OR 
        (split_value IS NULL AND split_percent IS NOT NULL)
    )
);

-- 5. Tabela: invoices (Notas Fiscais de Serviço Eletrônica)
CREATE TABLE public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL REFERENCES public.financial_transactions(id) ON DELETE CASCADE,
    asaas_invoice_id VARCHAR(255) UNIQUE,
    status invoice_status_enum DEFAULT 'PENDING' NOT NULL,
    municipal_service_code VARCHAR(50) NOT NULL,
    pdf_url TEXT,
    xml_url TEXT,
    error_message TEXT,
    issued_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Políticas de Segurança (Row Level Security - RLS)

ALTER TABLE public.asaas_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Permitir que a role de serviço (backend) faça tudo:
CREATE POLICY "Service Role Full Access on asaas_customers" ON public.asaas_customers FOR ALL USING (auth.jwt()->>'role' = 'service_role');
CREATE POLICY "Service Role Full Access on financial_transactions" ON public.financial_transactions FOR ALL USING (auth.jwt()->>'role' = 'service_role');
CREATE POLICY "Service Role Full Access on financial_splits" ON public.financial_splits FOR ALL USING (auth.jwt()->>'role' = 'service_role');
CREATE POLICY "Service Role Full Access on invoices" ON public.invoices FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Adicionar triggers de updated_at para as tabelas relevantes
CREATE OR REPLACE FUNCTION update_modified_column() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$ language 'plpgsql';

CREATE TRIGGER update_financial_transactions_modtime
BEFORE UPDATE ON public.financial_transactions
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_invoices_modtime
BEFORE UPDATE ON public.invoices
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
