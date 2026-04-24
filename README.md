# Formulario Solicitudes - Liferay Client Extension## Setup1. Instalar dependencias:
npm install

2. Añadir tus credenciales de Supabase en src/index.js:
const SUPABASE_URL = "https://tu-proyecto.supabase.co/rest/v1/solicitudes";
const SUPABASE_ANON_KEY = "tu-anon-key";

3. Crear la tabla en Supabase con el siguiente SQL: sqlcreate table solicitudes (  id uuid primary key default gen_random_uuid(),  titulo varchar(60) not null,  descripcion varchar(500) not null,  categoria varchar(100),  prioridad int check (prioridad between 1 and 5),  email varchar(255),  created_at timestamp default now());

4. Compilar y desplegar en Liferay:
gradlew :client-extensions:supabase-form:deploy
