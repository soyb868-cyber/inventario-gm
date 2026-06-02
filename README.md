# Inventario GM

Sistema web de gestión de inventario desarrollado para la administración de materiales de construcción, maquinaria y productos relacionados con proyectos de obra civil.

---

## Descripción

Inventario GM es una aplicación web construida con Next.js y Supabase que permite administrar diferentes categorías de productos, consultar inventario, visualizar maquinaria disponible y centralizar información operativa de la empresa.

La plataforma fue diseñada para ofrecer una experiencia rápida, moderna y adaptable a dispositivos móviles, además de funcionar como una Progressive Web App (PWA).

---

## Características Principales

### Gestión de Inventario

- Consulta de existencias.
- Organización por categorías.
- Búsqueda rápida de productos.
- Visualización de stock.

### Catálogo de Productos

- Aceros.
- Agregados.
- Polvos para construcción.
- Block y prefabricados.
- Material eléctrico.
- Productos de concretera.

### Maquinaria

- Catálogo de maquinaria pesada.
- Fichas técnicas en PDF.
- Información detallada de equipos.
- Consulta rápida de especificaciones.

### ERP Interno

- Panel administrativo.
- Gestión de inventario.
- Administración de registros.
- Actualización de productos.

### Experiencia de Usuario

- Diseño responsive.
- Animaciones fluidas.
- Instalación como aplicación móvil (PWA).
- Navegación optimizada.

---

## Tecnologías Utilizadas

### Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- React Icons
- Lucide React
- Swiper

### Backend y Base de Datos

- Supabase
- API Routes de Next.js

### Despliegue

- Vercel

---

## Capturas del Sistema

### Página Principal

![Página Principal](./public/images/home.png)

### Inventario

![Inventario](./public/images/inventario.png)

### Maquinaria

![Maquinaria](./public/images/maquinaria.png)

### Productos

![Productos](./public/images/productos.png)

### Panel Administrativo

![Panel Administrativo](./public/images/admin.png)

> Reemplaza las rutas anteriores por las capturas reales que subas al repositorio.

---

## Estructura del Proyecto

```text
app/
├── admin/
│   ├── aceros/
│   ├── agregados/
│   ├── block/
│   ├── concretera/
│   ├── electricidad/
│   ├── maquinaria/
│   └── productos/
│
├── api/
│   └── maquinaria/
│
├── erp/
│   └── inventario/
│
├── components/
│
└── lib/
    └── supabase.ts
```

---

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/1224100685lojg-web/inventario-gm.git
```

Entrar al proyecto:

```bash
cd inventario-gm
```

Instalar dependencias:

```bash
npm install
```

Crear archivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave
```

Ejecutar en desarrollo:

```bash
npm run dev
```

Abrir en el navegador:

```text
http://localhost:3000
```

---

## Construcción para Producción

```bash
npm run build
npm run start
```

---

## Funcionalidades Destacadas

- Gestión centralizada de inventario.
- Consulta de maquinaria y fichas técnicas.
- Organización por categorías de materiales.
- Integración con Supabase.
- Aplicación web progresiva (PWA).
- Interfaz moderna y optimizada.

---

## Despliegue

La aplicación se encuentra desplegada en Vercel para garantizar rendimiento, disponibilidad y actualizaciones continuas.

---

## Autor

Desarrollado por GM para la administración de inventario, maquinaria y materiales de construcción.

© 2026 GM. Todos los derechos reservados.
