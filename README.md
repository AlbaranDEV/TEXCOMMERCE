<h1 align="center">🧵 TEXCOMMERCE</h1>

<p align="center">
  <em>E-Commerce de venta de insumos textiles</em>
</p>

<p align="center">
  <a href="https://github.com/AlbaranDEV/TEXCOMMERCE">
    <img src="https://skillicons.dev/icons?i=nodejs,express,mysql,js,html,css" alt="Tech Stack" />
  </a>
</p>

## 📖 Descripción General
**TEXCOMMERCE** es una plataforma web integral de comercio electrónico y gestión empresarial orientada al sector textil de alta gama. Nuestro catálogo se especializa en materiales premium, incluyendo:
- Fibras nobles
- Linos
- Sedas
- Lanas
- Arquitectura textil

## 🏗️ Arquitectura del Proyecto
El proyecto está diseñado bajo una arquitectura desacoplada para garantizar escalabilidad, aplicando estándares de Clean Code. Se divide en dos servicios principales:

1. **Backend API**: Construido para manejar la lógica de negocio, gestión de endpoints y la comunicación segura con la base de datos.
2. **Frontend (Servidor)**: Aplicación encargada de consumir la API y renderizar las interfaces de usuario de forma dinámica utilizando **Plantillas EJS**.

Ambos entornos se comunican de manera eficiente y centralizan su persistencia de datos en una base de datos relacional **MySQL**.

## 🚀 Tecnologías Principales
* **Entorno & Framework:** Node.js, Express.js
* **Motor de Plantillas:** EJS (Embedded JavaScript)
* **Frontend:** JavaScript, HTML5, CSS3
* **Base de Datos:** MySQL (Compatible con entornos como XAMPP)

## ⚙️ Instalación y Uso (Desarrollo Local)

Sigue estos pasos para desplegar el entorno en tu máquina local:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/AlbaranDEV/TEXCOMMERCE.git
   ```

2. **Configurar la Base de Datos:**
   * Inicia tu servidor MySQL (ej. XAMPP).
   * Importa los scripts SQL correspondientes para estructurar las tablas de la base de datos.
   * Crea y configura tus variables de entorno (`.env`) en la raíz del proyecto con las credenciales locales.

3. **Instalar dependencias:**
   ```bash
   cd TEXCOMMERCE
   npm install
   ```

4. **Ejecutar los servicios:**
   ```bash
   npm run dev
   ```

## 👨‍💻 Autor
**Andrés Albarán Montoya** ([@AlbaranDEV](https://github.com/AlbaranDEV))
**Juan Diego Osorio Laverde** 
**Leidy XImena Alvarado**
