# 💰 OrdenateYA - Sistema de Gestión Financiera Personal

Sistema web completo para gestión de finanzas personales desarrollado con Next.js, TypeScript, Prisma y SQLite.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Comandos Útiles](#comandos-útiles)
- [Uso del Sistema](#uso-del-sistema)
- [API Endpoints](#api-endpoints)
- [Base de Datos](#base-de-datos)
- [Características Detalladas](#características-detalladas)

## ✨ Características

### Autenticación y Seguridad
- ✅ Registro de usuarios con validación
- ✅ Login seguro con contraseñas hasheadas (bcrypt)
- ✅ Recuperación de contraseña por correo electrónico
- ✅ Código de verificación de 6 dígitos
- ✅ Sesiones persistentes con localStorage

### Gestión Financiera
- 📈 **Ingresos**: Registro y categorización de ingresos
- 📉 **Egresos**: Control de gastos y egresos
- 🎯 **Metas**: Definición y seguimiento de objetivos financieros
- 📊 **Estadísticas**: Visualización con gráficos interactivos
- 💹 **Indicadores Económicos**: Valores en tiempo real (UF, UTM, Dólar)

### Visualización y Reportes
- Dashboard con resumen financiero
- Gráficos de barras y pastel (Chart.js)
- Indicadores económicos chilenos
- Balance total y por categorías
- Progreso de metas con barras visuales

## 🛠 Tecnologías

- **Frontend**: Next.js 14, React, TypeScript
- **Backend**: Next.js API Routes
- **Base de Datos**: SQLite con Prisma ORM
- **Autenticación**: bcryptjs
- **Emails**: Resend
- **Gráficos**: Chart.js, react-chartjs-2
- **Estilos**: CSS-in-JS (React inline styles)

## 📦 Requisitos Previos

- Node.js 18.x o superior
- npm o yarn
- Git

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd gdp1
