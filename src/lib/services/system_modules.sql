-- SQL Script for MedCore Dynamic Modules
-- Execute this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS system_modules (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  is_in_maintenance BOOLEAN DEFAULT false,
  maintenance_message TEXT DEFAULT 'Estamos aprimorando este módulo para oferecer uma experiência melhor. Voltaremos em breve.',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Initial Content for MedCore V2 Modules
-- Matches the current DashboardSidebar.tsx IDs
INSERT INTO system_modules (id, name, is_enabled, is_in_maintenance) VALUES
('dashboard', 'Dashboard Principal', true, false),
('ai-exec', 'IA Executiva & Auditoria', true, false),
('enterprise', 'Gestão Enterprise', true, false),
('billing', 'Assinatura e Planos', true, false),
('admin', 'Administração Regional', true, false)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  is_enabled = EXCLUDED.is_enabled;
