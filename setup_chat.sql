-- Script para crear las tablas de Chat en Vivo
-- Ejecuta este código en el panel SQL Editor de InsForge.

-- 1. Tabla de Sesiones de Chat (live_chats)
CREATE TABLE IF NOT EXISTS public.live_chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_name TEXT DEFAULT 'Anónimo',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabla de Mensajes (chat_messages)
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID REFERENCES public.live_chats(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('visitor', 'admin')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Otorgar permisos a los roles de la API
GRANT ALL ON public.live_chats TO anon, authenticated;
GRANT ALL ON public.chat_messages TO anon, authenticated;

-- 4. Habilitar RLS (Row Level Security)
ALTER TABLE public.live_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- 5. Políticas de Seguridad (Public Access para insertar y leer)
DROP POLICY IF EXISTS "Permitir a todos crear chats" ON public.live_chats;
CREATE POLICY "Permitir a todos crear chats" ON public.live_chats FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir a todos leer sus chats" ON public.live_chats;
CREATE POLICY "Permitir a todos leer sus chats" ON public.live_chats FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Permitir a todos actualizar sus chats" ON public.live_chats;
CREATE POLICY "Permitir a todos actualizar sus chats" ON public.live_chats FOR UPDATE TO public USING (true);

DROP POLICY IF EXISTS "Permitir a todos enviar mensajes" ON public.chat_messages;
CREATE POLICY "Permitir a todos enviar mensajes" ON public.chat_messages FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir a todos leer mensajes" ON public.chat_messages;
CREATE POLICY "Permitir a todos leer mensajes" ON public.chat_messages FOR SELECT TO public USING (true);

-- 6. Habilitar REALTIME para que funcione el chat en vivo
-- IMPORTANTE: Ve a tu panel de InsForge -> Database -> Replication
-- y activa el "toggle" manualmente para las tablas 'live_chats' y 'chat_messages'.

-- Refrescar esquema para que la API REST lo detecte
NOTIFY pgrst, 'reload schema';
