-- ==========================================
-- MEDCORE v5: O FIX DEFINITIVO (RECURSION-PROOF)
-- Este script quebra o loop lendo a role direto do JWT do usuário
-- ==========================================

-- 1. Limpeza Atômica de Políticas na tabela profiles
DO $$ 
DECLARE 
    pol RECORD;
BEGIN
    FOR pol IN (SELECT policyname FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public') LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', pol.policyname);
    END LOOP;
END $$;

-- 2. Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. POLÍTICA DE SELECT (Imune a Recursão)
-- Aqui não chamamos nenhuma função. O "true" permite que logados vejam perfis.
-- Isso é seguro no MedCore pois os perfis não contêm dados sensíveis como senhas.
CREATE POLICY "profiles_authenticated_select"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

-- 4. POLÍTICA DE INSERT
CREATE POLICY "profiles_self_insert"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- 5. POLÍTICA DE UPDATE (Usa JWT Metadata para evitar SELECT recursivo)
-- Verificamos se o UID bate OU se o JWT diz que o usuário é super_admin
CREATE POLICY "profiles_admin_or_self_update"
ON public.profiles FOR UPDATE
TO authenticated
USING (
    auth.uid() = id OR 
    (auth.jwt() ->> 'role') = 'service_role' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'super_admin'
)
WITH CHECK (
    auth.uid() = id OR 
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'super_admin'
);

-- 6. Trigger de Criação com Segurança Máxima
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'individual_user'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 7. Configurações Públicas (Não-recursivas)
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "settings_read_public" ON public.system_settings;
CREATE POLICY "settings_read_public" ON public.system_settings FOR SELECT USING (true);

-- Garante que o demo access está ligado
INSERT INTO public.system_settings (key, value, description)
VALUES ('show_demo_access', 'true'::jsonb, 'Exibe botões de acesso rápido na página inicial')
ON CONFLICT (key) DO UPDATE SET value = 'true'::jsonb;
