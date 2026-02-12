# Guía: WhatsApp API con WhatsBrick

Documentación para configurar la WhatsApp Cloud API usando el proyecto base WhatsBrick: creación de app en Meta, configuración local y despliegue en Railway.

---

## Contenido

| Parte | Contenido |
|-------|-----------|
| **I** | Entender WhatsApp y la API |
| **II** | Preparar el entorno (Meta y proyecto) |
| **III** | Desplegar en internet (Railway) |
| **IV** | Vibecoding |

---

# PARTE I — Entender WhatsApp y la API

---

## 1. ¿Qué es WhatsApp?

* Plataforma de mensajería propiedad de **Meta**
* Más de **2 mil millones** de usuarios en el mundo
* Comunicación: texto, voz, video, archivos, ubicaciones
* **Cifrado de extremo a extremo** por defecto
* Canal con **muy alta tasa de apertura** (aprox. 80–98%)
* Uso personal y empresarial

---

## 2. Tipos de WhatsApp

### 2.1 WhatsApp Messenger (personal)

* App estándar para uso individual
* No permite automatización ni integraciones
* Solo uso manual (celular o WhatsApp Web)

### 2.2 WhatsApp Business App

* Orientado a pequeñas empresas
* Perfil comercial: horarios, dirección, web, catálogo
* Respuestas rápidas y mensajes automáticos básicos (bienvenida, ausencia)
* No escala para muchos agentes ni integraciones
* No expone API

### 2.3 WhatsApp Business Platform (API)

* Orientado a medianas y grandes empresas
* Permite: bots, CRM, ERP, e-commerce, múltiples agentes
* No tiene interfaz propia; se integra con sistemas externos
* Opciones: **Cloud API** (hospedada por Meta) o **BSP** (Twilio, Infobip, Sinch, etc.)

---

## 3. Cómo funciona la WhatsApp API

* Cuando un usuario escribe, se abre una **ventana de 24 horas**
* Dentro de esa ventana se puede responder con libertad
* Para **iniciar** una conversación desde el negocio se requiere un **mensaje plantilla (template)** aprobado por Meta

### 3.1 Flujo

1. El usuario envía un mensaje
2. WhatsApp envía el evento al **webhook** (URL del servidor)
3. El backend procesa el mensaje
4. El sistema responde usando la API de WhatsApp
5. WhatsApp entrega la respuesta al usuario

```
Usuario → WhatsApp → Webhook (servidor) → API WhatsApp → Usuario
```

### 3.2 Tipos de mensajes en la API

| Tipo | Uso típico |
|------|------------|
| **Service** | Soporte dentro de 24 h |
| **Utility** | Transaccionales (orden, factura) |
| **Authentication** | Códigos OTP |
| **Marketing** | Promociones |

### 3.3 Cobro

* Se cobra por **mensaje entregado**
* El precio depende del **país del destinatario** y del **tipo de mensaje**
* Los mensajes de **servicio** (soporte reactivo) en muchos casos no tienen costo

---

## 4. Requisitos para usar la WhatsApp API

### 4.1 Requisitos de negocio

* Cuenta en **Meta Business Manager**
* **WhatsApp Business Account (WABA)**
* **Número de teléfono** dedicado (no puede estar en la app personal)
* Verificación del negocio (recomendada para escalar)
* Aceptación de políticas comerciales y de mensajería

### 4.2 Requisitos técnicos

* **Servidor (backend)** con:
  * URL pública **HTTPS** para recibir eventos (webhook)
  * Capacidad de recibir y procesar JSON
  * Lógica para enviar mensajes por la API
* **Hosting** en internet (Railway, AWS, GCP, Vercel, etc.)
* Base de datos (opcional)
* Gestión de **tokens** y, en su caso, de **templates**

---

# PARTE II — Preparar el entorno

Orden: crear app en Meta → clonar el proyecto → instalar dependencias → configurar variables → revisar estructura.

---

## 5. Crear una app en Meta

En **Meta for Developers** se crea la aplicación y se obtienen las credenciales necesarias.

### 5.1 Entrar a Meta for Developers

1. Ir a [developers.facebook.com](https://developers.facebook.com)
2. Iniciar sesión con cuenta de Facebook (o crear una)
3. Aceptar los términos si aplica

### 5.2 Crear la aplicación

1. Clic en **Mis aplicaciones** (My Apps)
2. Clic en **Crear aplicación** (Create App)
3. Tipo de uso: **Otro** (Other)
4. Tipo de aplicación: **Empresa** (Business)
5. Nombre: p. ej. `WhatsBrick` o el del proyecto
6. Correo y cuenta de negocio (opcional al inicio)
7. Clic en **Crear aplicación**

### 5.3 Añadir WhatsApp

1. En el panel, en “Añadir productos”, buscar **WhatsApp**
2. Clic en **Configurar** (Set up)
3. Elegir **API de WhatsApp** (hospedada por Meta)
4. Si se solicita **Meta Business Suite**, crear o vincular la cuenta según las indicaciones

### 5.4 Obtener token e ID de teléfono

1. En el menú: **WhatsApp** → **Introducción** (Getting started)
2. **Número de prueba:** anotar el número que Meta asigna
3. **Phone Number ID:** copiarlo; se usará como `PHONE_NUMBER_ID` en `.env`
4. **Token temporal:** clic en **Generar**, copiar el token; se usará como `WHATSAPP_TOKEN`  
   Este token **caduca**; en producción se requiere token permanente (cuenta verificada).

### 5.5 ID y secreto de la app (opcional)

* En **Configuración** → **Básica**: **ID de aplicación** (App ID)
* **Secreto de la aplicación** (App Secret): no compartir; puede usarse en webhooks

### 5.6 Resumen de variables

Variables necesarias antes de clonar y configurar:

| Variable | Dónde se obtiene |
|----------|------------------|
| `WHATSAPP_TOKEN` | WhatsApp → Token temporal (Generate) |
| `PHONE_NUMBER_ID` | WhatsApp → Getting started / Phone number |
| `VERIFY_TOKEN` | Definido localmente (palabra secreta para el webhook) |

---

## 6. Clonar el repositorio

1. Abrir una terminal en la carpeta deseada para el proyecto
2. Ejecutar:

```bash
git clone https://github.com/gndx/WhatsBrick.git
cd WhatsBrick
```

Alternativa sin Git: [Descargar proyecto en ZIP](https://github.com/gndx/WhatsBrick/archive/refs/heads/main.zip), descomprimir y abrir la terminal dentro de esa carpeta.

---

## 7. Instalar dependencias

En la carpeta del proyecto:

```bash
npm install
```

Salida esperada: `added packages...` y `found 0 vulnerabilities`.

---

## 8. Configurar variables de entorno

1. En la carpeta del proyecto localizar **`.env.example`**
2. Copiarlo y renombrar la copia a **`.env`** o **`.env.local`**
3. Editar el archivo con los valores del paso 5:

```env
VERIFY_TOKEN=palabra_secreta
WHATSAPP_TOKEN=token_de_meta
PHONE_NUMBER_ID=id_del_numero
```

4. Guardar. El archivo `.env` no debe subirse a GitHub (debe estar en `.gitignore`).

---

## 9. Estructura del proyecto

Estructura base tras clonar e instalar:

```
whatsbrick/
├── .env.example    # Plantilla de variables (versionado)
├── .env.local      # Variables locales (no versionado)
├── package.json    # Dependencias y scripts
├── package-lock.json
├── docs/           # Documentación
└── src/
    └── app.js      # Punto de entrada: servidor y rutas del webhook
```

* **`app.js`** levanta el servidor y define las rutas del webhook.
* Las variables de `.env` se usan para conectar con Meta y verificar el webhook.

---

# PARTE III — Desplegar en internet (Railway)

Para que WhatsApp pueda invocar el webhook, el proyecto debe estar en una **URL pública**. Railway permite exponer el proyecto sin gestionar servidores.

---

## 10. Requisitos previos

* Proyecto en una carpeta (p. ej. `WhatsBrick`) con la Parte II completada
* Cuenta en **GitHub**
* Cuenta en **Railway**: [railway.app](https://railway.app) (acceso con GitHub posible)

---

## 11. Subir el proyecto a GitHub

### 11.1 Crear el repositorio

1. Ir a [github.com](https://github.com) e iniciar sesión
2. Clic en **New repository**
3. Nombre: p. ej. `WhatsBrick`
4. Público o privado
5. Clic en **Create repository**

### 11.2 Conectar la carpeta local con GitHub

En la terminal, dentro de la carpeta del proyecto:

```bash
git add .
git commit -m "primer commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/WhatsBrick.git
git push -u origin main
```

Sustituir **`TU_USUARIO`** por el usuario de GitHub.

---

## 12. Desplegar en Railway

1. Ir a [railway.app](https://railway.app) e iniciar sesión con GitHub
2. Clic en **New Project**
3. Elegir **Deploy from GitHub repo**
4. Seleccionar el repositorio `WhatsBrick`

Railway detecta Node.js, instala dependencias y ejecuta el proyecto.

---

## 13. Configuración del puerto

El archivo principal del servidor (p. ej. `app.js` o `index.js`) debe usar la variable de entorno `PORT`:

```js
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor en puerto", PORT);
});
```

Railway asigna el puerto mediante `process.env.PORT`. Si el proyecto ya incluye esta lógica, no es necesario cambiarla.

---

## 14. Obtener la URL pública

1. En el proyecto en Railway, ir a **Settings**
2. Buscar **Public Domain** (o “Generate domain”)
3. Generar un dominio

Se obtiene una URL base (p. ej. `https://WhatsBrick-production.up.railway.app`). La URL del webhook será esa base + `/webhook`.

---

## 15. Variables de entorno en Railway

1. En el proyecto en Railway, abrir **Variables**
2. Añadir las mismas variables que en `.env` local:

```
VERIFY_TOKEN=palabra_secreta
WHATSAPP_TOKEN=token_real
PHONE_NUMBER_ID=id
```

3. Guardar. Railway reinicia el proyecto con las nuevas variables.

---

## 16. Comprobar que el servidor responde

Abrir en el navegador la URL del proyecto (p. ej. `https://tu-dominio.up.railway.app`). Si se obtiene respuesta (p. ej. “OK” o mensaje del servidor), el despliegue está activo. Esa URL + `/webhook` es la que debe configurarse en Meta (sección WhatsApp de la app).

---

# PARTE IV — Vibecoding

Metodología para definir mejor las instrucciones a una IA (p. ej. Cursor, ChatGPT) y reducir código innecesario o confuso.

---

## 17. Definir el resultado (no solo la tarea)

Antes de pedir código, concretar:

* Qué problema se resuelve
* Cómo debe quedar el resultado
* Qué no debe hacer la solución

Ejemplo: “API en Node + Express que reciba webhooks de WhatsApp Cloud API y responda mensajes de texto. Minimalista y lista para deploy.”

---

## 18. Definir el alcance mínimo (MVP)

Priorizar pocas funcionalidades. Para esta API, por ejemplo:

* GET `/webhook` (verificación)
* POST `/webhook` (recibir mensajes)
* Lógica para enviar mensajes

Evitar al inicio: autenticación compleja, Docker, tests, arquitectura pesada.

---

## 19. Definir restricciones técnicas

Especificar de forma explícita:

* Lenguaje: p. ej. Node 20
* Framework: p. ej. Express
* Módulos: CommonJS o ES Modules
* Sin dependencias innecesarias

Ejemplo de instrucción: “No usar TypeScript ni librerías adicionales excepto express y axios.”

---

## 20. Dividir en microtareas

Antes de pedir código, listar los pasos (ejemplo):

1. Crear servidor Express  
2. Configurar body parser  
3. Ruta GET webhook  
4. Validar token  
5. Ruta POST webhook  
6. Extraer mensaje entrante  
7. Función sendMessage()  
8. Probar con curl  

Pedir la implementación por partes (p. ej. “Generar solo el paso 1 y 2”) para evitar bloques de código demasiado grandes.

---

## 21. Iterar con feedback concreto

Feedback vago: “No funciona.”  
Feedback útil: “El webhook devuelve 403 al verificar. El token enviado es X. Ajustar la validación.”

---

## 22. Plantilla de prompt

```
Contexto: Estoy construyendo [X].
Objetivo: Necesito [resultado concreto].
Alcance: Solo 1) … 2) … 3) …
Restricciones: Node 20, Express, CommonJS, sin dependencias extra.
Entrega: Código mínimo y explicación breve.
```

---

## 23. Regla de oro

* La IA **ejecuta**; la decisión es humana.
* El **plan** define; el **código** lo implementa.
* Sin plan, la IA improvisa; con plan, el avance es más rápido y controlado.
