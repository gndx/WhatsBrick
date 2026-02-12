# Estructura base del proyecto WhatsBrick

Documentación de la estructura y componentes principales de WhatsBrick.

---

## Árbol de directorios

```
whatsbrick/
├── .env.example       # Plantilla de variables de entorno
├── .env.local         # Variables de entorno locales (no versionado)
├── package.json       # Dependencias y scripts del proyecto
├── package-lock.json  # Lockfile de dependencias
├── docs/              # Documentación
│   └── estructura.md  # Este archivo
└── src/
    └── app.js         # Punto de entrada y lógica del servidor/webhook
```

---

## Descripción de archivos y carpetas

| Ruta | Descripción |
|------|-------------|
| **src/app.js** | Aplicación Express: rutas, verificación del webhook y envío de mensajes por WhatsApp Cloud API. |
| **.env.example** | Ejemplo de variables: `PORT`, `VERIFY_TOKEN`, `WHATSAPP_TOKEN`, `PHONE_NUMBER_ID`. |
| **.env.local** | Valores reales de entorno (prioridad sobre `.env`). No se sube al repositorio. |
| **package.json** | Proyecto ES modules; scripts `start` y `dev` (con `--watch`); dependencias: `express`, `dotenv`. |
| **docs/** | Carpeta de documentación del proyecto. |

---

## Rutas de la API

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/` | Comprueba que el servidor está activo. Responde con "WhatsBrick is running". |
| `GET` | `/webhook`, `/webhook/` | Verificación del webhook: Meta envía `hub.mode`, `hub.challenge`, `hub.verify_token`; se responde con el challenge si el token coincide. |
| `POST` | `/webhook`, `/webhook/` | Recibe notificaciones de WhatsApp; procesa mensajes de texto y responde con eco usando la Cloud API. |

---

## Variables de entorno

| Variable | Uso |
|----------|-----|
| `PORT` | Puerto del servidor (por defecto `3000`). |
| `VERIFY_TOKEN` | Token que configuras en Meta for Developers para verificar el webhook. |
| `WHATSAPP_TOKEN` | Token de acceso de la app de WhatsApp (Meta). |
| `PHONE_NUMBER_ID` | ID del número de teléfono de WhatsApp Business asociado a la app. |

---

## Flujo del webhook

1. **Verificación (GET)**  
   Meta hace una petición GET a `/webhook` con `hub.mode=subscribe`, `hub.challenge` y `hub.verify_token`. Si `hub.verify_token` coincide con `VERIFY_TOKEN`, se responde con `hub.challenge`.

2. **Eventos (POST)**  
   Meta envía un POST con el cuerpo en formato de webhook (entry/changes/value). La app responde `200` de inmediato y procesa en segundo plano: extrae mensajes de texto y envía una respuesta de eco mediante la API de WhatsApp (Graph API).

---

## Cómo ejecutar

```bash
# Instalar dependencias
npm install

# Modo producción
npm start

# Modo desarrollo (reinicio automático)
npm run dev
```

El servidor escucha en `http://localhost:PORT` (por defecto `http://localhost:3000`).
