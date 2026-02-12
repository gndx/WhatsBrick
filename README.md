# WhatsBrick - Whatsapp API

Un servidor que conecta tu aplicación con **WhatsApp** usando la API oficial de Meta. Recibe mensajes entrantes, responde automáticamente y te permite construir bots o flujos de atención sin depender de terceros.

> Construido ladrillo a ladrillo, como un castillo medieval de LEGO.

Si quieres profundizar en la estructura del proyecto, rutas, variables de entorno y cómo funciona el webhook, entra a [docs/estructura.md](docs/estructura.md).

## Cómo empezar

1. **Clona el repositorio e instala lo necesario**

   ```bash
   npm install
   ```

2. **Configura tu entorno**

   Copia el archivo `.env.example` a `.env.local` y completa estos valores:
   - `PORT` – Puerto donde corre el servidor (por defecto: 3000)
   - `VERIFY_TOKEN` – Token que defines en Meta for Developers para verificar el webhook
   - `WHATSAPP_TOKEN` – Token de acceso de tu app de WhatsApp en Meta
   - `PHONE_NUMBER_ID` – ID del número de teléfono de WhatsApp Business

3. **Arranca el servidor**

   ```bash
   # Producción
   npm start

   # Desarrollo (recarga automática al cambiar código)
   npm run dev
   ```

   El servidor quedará disponible en `http://localhost:3000` (o el puerto que hayas puesto en `PORT`).

---

💻 **Contribuir**
Las contribuciones son bienvenidas. Si encuentras un error o tienes una idea para mejorar el proyecto, abre un issue o envía un pull request.

📃 **Licencia**
Este proyecto está bajo la licencia MIT. Los detalles están en el archivo LICENSE.

☕ **Apoyar**
Si este proyecto te ayudó a aprender algo nuevo o simplemente quieres apoyar el trabajo, puedes invitarme un café. ¡Se agradece mucho! 😊 [GitHub Sponsors](https://github.com/sponsors/gndx)
