
# 🤖 WhatsApp Lead Bot with AI, Product Recommendations & Supabase Storage

Este proyecto es una solución automatizada y en producción que simula una conversación por WhatsApp, analiza la intención del usuario con IA, consulta productos desde una API propia y registra los leads tanto en **Supabase** como en **Google Sheets**. Además, incluye un panel de administración para visualizar los leads en Next.js.

---

## 🚀 ¿Cómo funciona el flujo?

1. **📥 Entrada (Webhook en n8n)**  
   Se recibe un mensaje tipo WhatsApp:
   ```json
   {
     "phone": "+573001112233",
     "message": "Hola, ¿tienen juguetes para niños pequeños?"
   }
   ```

2. **🧹 Limpieza de datos y análisis de intención con IA**  
   Se normaliza el número y se analiza el mensaje con **Gemini** para extraer:
   - `name`
   - `email`
   - `searchTerm` (categoría del producto)

3. **🔍 Consulta del usuario en Supabase**  
   Se consulta la base de datos:
   - Si **no existe**, se crea.
   - Si **existe**, se actualiza solo si llegó nueva info.

4. **📜 Consulta de intención previa (historial de mensajes)**  
   Si no se detecta un `searchTerm`, se analizan los mensajes del día y se extrae desde ahí.

5. **🛍️ Consulta de productos**  
   Se hace una búsqueda en la API propia:
   - Endpoint: `https://api-products-52lw.vercel.app/api/products?search=toys`

6. **📝 Registro del Lead**
   - En **Supabase** vía API.
   - En **Google Sheets** automáticamente.

7. **💬 Respuesta final al usuario**  
   El bot responde con los productos encontrados o solicita información faltante.

---

## 🌐 Recursos activos en producción

- 🟢 Webhook (simula WhatsApp):
  ```
  https://n8n.srv885850.hstgr.cloud/webhook/lead-incoming
  ```

- 🔍 API pública para consultar leads:
  ```
  https://api-products-52lw.vercel.app/api/leads
  ```

- 📄 Google Sheets (registro de leads):
  [Ver hoja aquí](https://docs.google.com/spreadsheets/d/1Vl9o3JkmDccAi1GT1P8DHv4CsYGOwvAIBJD3jsCyk1E/edit?usp=sharing)

- 💻 Repositorio del código:
  [GitHub - Stivenson02/api-products](https://github.com/Stivenson02/api-products)

---

## 🧠 Tecnologías utilizadas

| Herramienta         | Uso principal |
|---------------------|----------------|
| **Next.js 15**      | Backend (API Routes) + Panel de administración |
| **Prisma ORM**      | ORM para PostgreSQL/Supabase |
| **Supabase**        | Base de datos (usuarios, mensajes, leads) |
| **n8n**             | Automatización del flujo conversacional |
| **Gemini (AI)**     | Extracción de intención, nombre y correo |
| **Google Sheets API** | Backup visible de leads |
| **PostgreSQL**      | Almacenamiento |
| **Vercel**          | Despliegue de API y panel web |
| **Tailwind CSS**    | Estilos del dashboard de administración |
| **Postman**         | Pruebas manuales del webhook |

---

## 🧪 ¿Cómo probar?

### 1. Simular conversación por WhatsApp

```bash
POST https://n8n.srv885850.hstgr.cloud/webhook/lead-incoming
Content-Type: application/json

{
  "phone": "+573001112233",
  "message": "Hola, soy Juan. Mi correo es juan@test.com. ¿Tienen juguetes?"
}
```

### 2. Ver el resultado

- ✅ Productos recomendados → respuesta del bot
- ✅ Registro del lead:
  - [API leads](https://api-products-52lw.vercel.app/api/leads)
  - [Google Sheet](https://docs.google.com/spreadsheets/d/1Vl9o3JkmDccAi1GT1P8DHv4CsYGOwvAIBJD3jsCyk1E/edit?usp=sharing)

---

## 📊 Panel de administración

Puedes visualizar y buscar leads desde el panel web (en Next.js), con:
- 📑 Paginación
- 🔍 Búsqueda por nombre, email o categoría

Consulta a través de la API `/api/leads?page=1&name=juan&searchTerm=toys`  
> Ya incluye filtros dinámicos, ordenamiento y control de errores.

---

## 📁 Estructura del proyecto

```
/src
  ├── /app/api        # Rutas API (usuarios, mensajes, leads)
  ├── /components     # Componentes de UI
  ├── /lib/prisma.ts  # Cliente Prisma
  ├── /leads          # Vista del panel de administración
  └── prisma/schema.prisma
```

---

## 🧩 Extras y mejoras

- ✅ Historial de conversación por teléfono
- ✅ Almacenamiento incremental
- ✅ Búsqueda de intención por mensajes anteriores
- ✅ Registro multicanal (API + Google Sheets)
- ✅ Manejo de errores con mensajes personalizados
- ✅ Respuestas dinámicas según la información entregada

---

## 📌 Nota final

Este proyecto fue desarrollado como parte de una **prueba técnica avanzada**, conectando múltiples herramientas y APIs reales. ¡Está completamente automatizado, documentado y desplegado en producción!

---

🦊 Hecho con ❤️ por [@Stivenson02](https://github.com/Stivenson02)