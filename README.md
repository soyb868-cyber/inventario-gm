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

**Inventario GM** es una plataforma  desarrollada para facilitar la consulta y administración de información relacionada con materiales de construcción, maquinaria, productos y servicios ofrecidos por Grupo GM.

El sistema está especialmente pensado para su utilización durante visitas y recorridos en ruta, permitiendo que los colaboradores puedan consultar rápidamente información desde una computadora, tablet o teléfono celular mientras se encuentran con un cliente.

La plataforma permite consultar información como:

Precios de materiales.
Existencias y disponibilidad.
Características de productos.
Especificaciones de maquinaria.
Fichas técnicas en PDF.
Productos de línea blanca.
Información sobre servicios de electricidad.
Información relacionada con la concretera.
Catálogos organizados por categorías.

De esta manera, el personal puede tener la información comercial y técnica disponible en un solo lugar, facilitando la atención al cliente y la consulta de productos durante las visitas.



## Objetivo del Sistema

El objetivo principal de Inventario GM es centralizar la información de productos, materiales, maquinaria y servicios para facilitar su consulta y administración.

La plataforma busca:

📱 Facilitar el acceso a la información desde dispositivos móviles.
🔎 Reducir el tiempo necesario para localizar productos y precios.
📦 Mantener organizada la información del inventario.
🚜 Centralizar la información técnica de maquinaria.
🧱 Facilitar la consulta de materiales de construcción.
⚡ Mostrar información relacionada con servicios especializados.
👥 Mejorar la atención al cliente durante las visitas en ruta.
🏢 Proporcionar herramientas administrativas para la gestión interna.

---

## ✨ Características Principales

### 📦 Inventario y Materiales

El sistema permite consultar diferentes categorías de materiales y productos:

Aceros.
Agregados.
Polvos para construcción.
Block y prefabricados.
Material eléctrico.
Productos de concretera.
Línea blanca.
Otros productos relacionados con la construcción.

Cada categoría puede contener información como:

Nombre del producto.
Código.
Precio.
Existencia.
Descripción.
Características.
Información adicional.


### 🚜 Módulo dedicado a la consulta de maquinaria y equipo.

Incluye:

Catálogo de maquinaria.
Información detallada de equipos.
Especificaciones técnicas.
Descripciones.
Fichas técnicas en formato PDF.
Consulta rápida desde dispositivos móviles.

### ⚡ Servicios

La plataforma también concentra información sobre algunos de los servicios ofrecidos por la empresa.

Entre ellos:

Instalaciones eléctricas.
Servicios relacionados con la concretera.
Información y descripción de servicios.
Datos necesarios para consulta durante visitas a clientes.

### ⚙️ Administración

El sistema cuenta con herramientas internas para administrar la información utilizada por la plataforma.

Entre sus funciones se encuentran:

Administración de productos.
Gestión de inventario.
Actualización de información.
Organización por categorías.
Gestión de registros.
Consulta de información desde el panel administrativo.

### 📱 Diseño Responsive y PWA

La aplicación está diseñada para funcionar en diferentes dispositivos.

Puede utilizarse desde:

💻 Computadoras.
📱 Teléfonos celulares.
📲 Tablets.

Además, cuenta con características de Progressive Web App (PWA), permitiendo instalar la aplicación como una aplicación en dispositivos compatibles.

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
Supabase es utilizado para la gestión de la base de datos y los servicios backend de la aplicación.

### Despliegue

- Vercel
La aplicación se encuentra desplegada mediante Vercel, permitiendo realizar actualizaciones y mantener disponible el sistema desde Internet.

---

## 📸 Capturas del Sistema

### 🏠 Página Principal

![Página Principal](./public/images/home.png)

Página principal desde donde los usuarios pueden acceder a las diferentes categorías y módulos de información.

### 📊 Inventario y Materiales

![Inventario](./public/images/inventario.png)

Consulta de productos y materiales disponibles dentro de la plataforma.

### 🚜 Maquinaria

![Maquinaria](./public/images/maquinaria.png)

Catálogo de maquinaria con información técnica y documentación disponible.

### 📦 Linea Blanca

![Productos](./public/images/productos.png)

Consulta de productos pertenecientes a la categoría de línea blanca.

### ⚙️ Electricidad

![Panel Administrativo](./public/images/electricidad.png)

Información relacionada con los servicios y productos del área eléctrica.

### ⚙️ Concretera

![Panel Administrativo](./public/images/concretera.png)

Módulo destinado a mostrar información relacionada con los productos y servicios de la concretera.
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
