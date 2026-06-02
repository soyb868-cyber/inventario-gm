#  Inventario GM

> Sistema web para la gestión de inventario, maquinaria y materiales de construcción.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38BDF8)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black)

---

## 📋 Descripción

**Inventario GM** es una plataforma web desarrollada para la administración de materiales de construcción, maquinaria y productos relacionados con proyectos de obra civil.

La aplicación permite consultar inventario, gestionar productos, visualizar maquinaria y centralizar información operativa mediante una interfaz moderna, rápida y adaptable a dispositivos móviles.

---

## ✨ Características Principales

### 📦 Gestión de Inventario

- Consulta de existencias.
- Organización por categorías.
- Búsqueda rápida de productos.
- Visualización de stock disponible.

### 🧱 Catálogo de Productos

- Aceros.
- Agregados.
- Polvos para construcción.
- Block y prefabricados.
- Material eléctrico.
- Productos de concretera.

### 🚜 Maquinaria

- Catálogo de maquinaria pesada.
- Fichas técnicas en PDF.
- Información detallada de equipos.
- Consulta rápida de especificaciones.

### ⚙️ ERP Interno

- Panel administrativo.
- Gestión de inventario.
- Administración de registros.
- Actualización de productos.

### 📱 Experiencia de Usuario

- Diseño responsive.
- Navegación optimizada.
- Instalación como aplicación móvil (PWA).
- Animaciones fluidas.

---

## 🛠️ Tecnologías Utilizadas

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

## 📸 Capturas del Sistema

### 🏠 Página Principal

![Página Principal](./public/images/home.png)

### 📊 Inventario

![Inventario](./public/images/inventario.png)

### 🚜 Maquinaria

![Maquinaria](./public/images/maquinaria.png)

### 📦 Productos

![Productos](./public/images/productos.png)

### ⚙️ Panel Administrativo

![Panel Administrativo](./public/images/admin.png)

---

## 📂 Estructura del Proyecto

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
https://grupo-gm-one.vercel.app/
```

---

## Construcción para Producción

```bash
npm run build
npm run start
```

---

## 🛠️ Funcionalidades Destacadas

- Gestión centralizada de inventario.
- Consulta de maquinaria y fichas técnicas.
- Organización por categorías de materiales.
- Integración con Supabase.
- Aplicación web progresiva (PWA).
- Interfaz moderna y optimizada.

---

## ✨ Despliegue

La aplicación se encuentra desplegada en Vercel para garantizar rendimiento, disponibilidad y actualizaciones continuas.

---

## Autor

Luis Owen Jaramillo Guerrero
