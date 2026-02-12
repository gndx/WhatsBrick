# WhatsBrick

A Node.js server that integrates with the WhatsApp Cloud API. It exposes a webhook for Meta to verify and receive incoming messages, and can reply with text using the Graph API.

> Built brick by brick, like a medieval LEGO castle.

For project structure, routes, environment variables, and webhook flow details, see [docs/estructura.md](docs/estructura.md).

## Getting started

1. **Clone the repo and install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   Copy `.env.example` to `.env.local` and set your values:

   - `PORT` – Server port (default: 3000)
   - `VERIFY_TOKEN` – Token you set in Meta for Developers for webhook verification
   - `WHATSAPP_TOKEN` – WhatsApp app access token from Meta
   - `PHONE_NUMBER_ID` – WhatsApp Business phone number ID

3. **Run the server**

   ```bash
   # Production
   npm start

   # Development (auto-reload)
   npm run dev
   ```

   The server runs at `http://localhost:3000` (or the port you set in `PORT`).

---

💻 **Contributing**  
Contributions to this project are welcome. If you find a bug or have a suggestion for improvement, please open an issue or submit a pull request.

📃 **License**  
This project is licensed under the MIT License. See the LICENSE file for details.

☕ **Support**  
If this project helped you learn something new, or if you're feeling particularly generous, you can buy me a coffee. It's greatly appreciated! 😊 [GitHub Sponsors](https://github.com/sponsors/gndx)
