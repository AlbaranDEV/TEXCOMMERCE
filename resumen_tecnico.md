# Documento de Traspaso Técnico: Frontend TEXCOMERCE
**Para: Equipo de Desarrollo Backend**

Este documento detalla la arquitectura actual del frontend, las modificaciones recientes en la capa de vistas y los puntos de integración (endpoints y estructuras de datos) que el backend deberá proveer para la correcta orquestación de la aplicación.

---

## 1. Cambio de Arquitectura: Implementación de Patrón BFF (Backend-For-Frontend)
Se realizó una migración completa de archivos HTML estáticos a un servidor **Node.js con Express** que utiliza **EJS (Embedded JavaScript)** como motor de plantillas. 

*   **Frontend Server:** Se ejecuta en el puerto `4000`.
*   **Backend API (Ustedes):** Se ejecuta en el puerto `3000`.
*   **Flujo de Trabajo:** El frontend ya no hace llamadas directas desde el cliente (navegador) a la base de datos. En su lugar, las rutas definidas en `routes.views.js` apuntan a `controller.views.js`. El objetivo es que estos controladores realicen peticiones (mediante `axios` o `fetch` interno) a la API del backend en el puerto 3000, recopilen el JSON de respuesta, y pasen esos datos a la plantilla EJS para renderizar el HTML final de forma dinámica (Server-Side Rendering o SSR).

**Requerimiento para Backend:** Se espera que el backend exponga una API RESTful limpia. La autenticación deberá manejarse preferiblemente mediante **JWT (JSON Web Tokens) en cookies HttpOnly**, las cuales el servidor frontend de Express validará y pasará al backend en cada petición.

---

## 2. Reducción y Estandarización del Catálogo
Se eliminó la complejidad de múltiples tejidos abstractos y se estandarizó el inventario en **6 categorías (familias) principales**. Todo el HTML de `catalogo.ejs` (incluyendo etiquetas de navegación y acordeones de filtrado) fue modificado para reflejar estricta y únicamente estas categorías:

1. `Seda`
2. `Polar`
3. `Lycra`
4. `Denim`
5. `Poliéster`
6. `Algodón`

### A. Implicaciones para la Base de Datos y Endpoints de Productos
Actualmente, las 6 tarjetas de producto están puestas a fuego (hardcoded) en el HTML. El objetivo a corto plazo es reemplazar esto por un bucle dinámico en EJS (`<% fabrics.forEach(fabric => { %> ... <% }) %>`).

**Endpoints Necesarios:**
*   `GET /api/products`: Deberá devolver un arreglo de objetos. Cada objeto debe coincidir con la estructura que la tarjeta actual de EJS consume:
    *   `id` / `sku`: Código del producto (ej. `SED-01`)
    *   `title`: Nombre comercial (ej. `Seda Natural Premium`)
    *   `type`: Categoría principal (estrictamente una de las 6 mencionadas).
    *   `description`: Texto de máximo 2-3 líneas.
    *   `composition`: Composición de la fibra (ej. `100% Seda`).
    *   `price`: Precio por metro.
    *   `colorways`: Cantidad de colores disponibles (o un arreglo de colores).
    *   `stock`: Metraje disponible.
    *   `image_url`: Enlace a la fotografía de alta resolución.
*   **Filtros de Búsqueda:** El backend debe soportar queries en la URL, por ejemplo: `GET /api/products?category=Denim` o `GET /api/products?search=suave`.

---

## 3. Limpieza de Lógica de Negocio (B2B y Prescripción)
A través de varios scripts de refactorización (que ya fueron eliminados del repositorio) y limpieza manual en las vistas (`conocenos.ejs`, `catalogo.ejs`):
*   Se **eliminó todo el flujo B2B** (Business to Business). El botón de "Acreditar Nuevo Despacho (B2B)" del login y las menciones a flujos mayoristas separados han sido retirados.
*   Se eliminó la sección de "Showroom en Chapinero" y textos promocionales del header superior.

**Implicaciones para Backend:** 
Por el momento, el modelo de usuario es más simple. No necesitan diferenciar entre roles de cliente "Retail" vs "B2B / Prescriptor" con reglas de negocio complejas de precios escalonados (a menos que se especifique lo contrario en el futuro). Un modelo de usuario estándar `(User)` es suficiente.

---

## 4. Próximos Desafíos de Integración

### A. Carrito de Compras (Bolsa)
El header actual muestra un contador estático `(2)` en el botón del carrito. 
*   **Requerimiento:** El backend deberá proveer endpoints para manejar el carrito:
    *   `GET /api/cart`
    *   `POST /api/cart/add`
    *   `PUT /api/cart/update` (El frontend tiene botones de `+` y `-` para modificar el metraje).
    *   *Decisión de arquitectura:* El equipo de backend debe definir si el carrito se guardará en la base de datos (persistente por usuario) o si el frontend deberá manejarlo temporalmente en la sesión (Redis/Express-session) hasta el checkout.

### B. Gestión de Sesión (Mi Cuenta)
El sistema actual incluye un enlace a "Mi Cuenta" (`/login`).
*   **Requerimiento:** Endpoints para `POST /api/auth/login`, `POST /api/auth/register`, y `GET /api/user/profile`.
*   El frontend Express se encargará de interceptar llamadas no autorizadas a rutas como `/checkout` o `/dashboard` a través de **Middleware de Express**, verificando el estado de autenticación con el backend antes de renderizar las vistas EJS.
