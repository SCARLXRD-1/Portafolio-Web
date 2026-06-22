-- =========================================================================
-- INSFORGE ADVISOR FIXES (PERFORMANCE & SECURITY)
-- =========================================================================
-- IMPORTANTE: Corre este script en el editor SQL de InsForge.
-- 
-- NOTA SOBRE LAS ADVERTENCIAS DE "Permissive RLS policy":
-- El Advisor marcó como "peligrosas" las políticas que usan USING (true).
-- Sin embargo, como este es un Portafolio Público, los visitantes 
-- (usuarios anónimos) DEBEN poder leer tus proyectos, habilidades, 
-- experiencia, etc., usando USING (true).
-- Lo mismo aplica para el Chat en Vivo: es un chat anónimo, por lo 
-- que el INSERT debe ser abierto.
-- Por lo tanto, esas advertencias de "exposes data to anonymous users" 
-- son falsos positivos y puedes IGNORARLAS con total seguridad.
-- =========================================================================

-- 1. SOLUCIÓN DE RENDIMIENTO: Envolver auth.uid() en subconsultas
-- El Advisor advirtió que llamar a auth.uid() directamente se evalúa por 
-- cada fila, lo que reduce el rendimiento hasta 100x.
-- Reemplazaremos auth.uid() por (select auth.uid()).

-- PROFILE SETTINGS
DROP POLICY IF EXISTS "Admin update access" ON public.profile_settings;
CREATE POLICY "Admin update access" ON public.profile_settings
    FOR UPDATE USING ((select auth.uid()) = 'dc64568f-659e-4a22-baa0-56a0225bff0c');

-- PROJECTS
DROP POLICY IF EXISTS "Admin full access projects" ON public.projects;
CREATE POLICY "Admin full access projects" ON public.projects
    FOR ALL USING ((select auth.uid()) = 'dc64568f-659e-4a22-baa0-56a0225bff0c');

-- EXPERIENCE
DROP POLICY IF EXISTS "Admin full access experience" ON public.experience;
CREATE POLICY "Admin full access experience" ON public.experience
    FOR ALL USING ((select auth.uid()) = 'dc64568f-659e-4a22-baa0-56a0225bff0c');

-- SKILLS
DROP POLICY IF EXISTS "Admin full access skills" ON public.skills;
CREATE POLICY "Admin full access skills" ON public.skills
    FOR ALL USING ((select auth.uid()) = 'dc64568f-659e-4a22-baa0-56a0225bff0c');

-- CERTIFICATES
DROP POLICY IF EXISTS "Admin full access certificates" ON public.certificates;
CREATE POLICY "Admin full access certificates" ON public.certificates
    FOR ALL USING ((select auth.uid()) = 'dc64568f-659e-4a22-baa0-56a0225bff0c');

-- EXPERIMENTS
DROP POLICY IF EXISTS "Admin full access experiments" ON public.experiments;
CREATE POLICY "Admin full access experiments" ON public.experiments
    FOR ALL USING ((select auth.uid()) = 'dc64568f-659e-4a22-baa0-56a0225bff0c');

-- CONTACT MESSAGES
DROP POLICY IF EXISTS "Admin full access messages" ON public.contact_messages;
CREATE POLICY "Admin full access messages" ON public.contact_messages
    FOR ALL USING ((select auth.uid()) = 'dc64568f-659e-4a22-baa0-56a0225bff0c');

-- BLOG POSTS (Arreglando la política excesivamente permisiva)
DROP POLICY IF EXISTS "Permitir a admin manejar posts" ON public.blog_posts;
CREATE POLICY "Permitir a admin manejar posts" ON public.blog_posts
    FOR ALL TO authenticated USING ((select auth.uid()) = 'dc64568f-659e-4a22-baa0-56a0225bff0c');


-- 2. SOLUCIÓN DE RENDIMIENTO: Índice faltante en llave foránea (chat_messages.chat_id)
-- Esto evitará bloqueos completos de tabla cuando se elimine un chat.

CREATE INDEX IF NOT EXISTS idx_chat_messages_chat_id ON public.chat_messages(chat_id);


-- 3. SOLUCIÓN DE SEGURIDAD FALTANTE: site_settings
-- La regla original de site_settings estaba demasiado abierta.
DROP POLICY IF EXISTS "Admin full access site settings" ON public.site_settings;
CREATE POLICY "Admin full access site settings" ON public.site_settings
    FOR ALL USING ((select auth.uid()) = 'dc64568f-659e-4a22-baa0-56a0225bff0c');


-- Refrescar esquema para aplicar los cambios en la API REST
NOTIFY pgrst, 'reload schema';
