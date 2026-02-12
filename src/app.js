/**
 * WhatsBrick - Aplicación Express para la WhatsApp Cloud API.
 * Expone un webhook para recibir mensajes y responde con eco de texto.
 */

import express from 'express';
import dotenv from 'dotenv';

// Cargar variables de entorno (.env.local tiene prioridad sobre .env)
dotenv.config();
dotenv.config({ path: '.env.local', override: true });

/** Instancia de la aplicación Express */
const app = express();

/** Middleware para parsear el cuerpo de las peticiones como JSON */
app.use(express.json());

/** Puerto del servidor (por defecto 3000) */
const port = process.env.PORT || 3000;
/** Token de verificación del webhook configurado en Meta for Developers */
const verifyToken = process.env.VERIFY_TOKEN;

/**
 * Ruta raíz: comprueba que el servidor está en ejecución.
 * @route GET /
 */
app.get('/', (req, res) => {
  res.status(200).send('WhatsBrick is running');
});

/**
 * Manejador de verificación del webhook (GET).
 * Meta envía hub.mode, hub.challenge y hub.verify_token; si el token coincide,
 * se responde con el challenge para completar la suscripción.
 * @route GET /webhook, GET /webhook/
 * @param {object} req - Petición con query: hub.mode, hub.challenge, hub.verify_token
 * @param {object} res - Respuesta: 200 + challenge si OK, 403 si token inválido
 */
function handleWebhookVerify(req, res) {
  const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = req.query;

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WEBHOOK VERIFIED');
    res.status(200).send(challenge);
  } else {
    res.status(403).end();
  }
}

app.get('/webhook', handleWebhookVerify);
app.get('/webhook/', handleWebhookVerify);

/**
 * Manejador de eventos del webhook (POST).
 * Recibe notificaciones de WhatsApp, extrae mensajes de texto y responde
 * con el mismo texto (eco) usando la Cloud API.
 * Responde 200 de inmediato y procesa en segundo plano.
 * @route POST /webhook, POST /webhook/
 * @param {object} req - Cuerpo con entry[].changes[].value (mensajes, etc.)
 * @param {object} res - Se responde 200 antes de procesar
 */
const handleWebhookPost = async (req, res) => {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(`\n\nWebhook received ${timestamp}\n`);
  console.log(JSON.stringify(req.body, null, 2));

  res.status(200).end();

  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) {
    console.warn('WHATSAPP_TOKEN o PHONE_NUMBER_ID no configurados, no se envía respuesta.');
    return;
  }

  try {
    const value = req.body?.entry?.[0]?.changes?.[0]?.value;
    const messages = value?.messages;
    if (!messages?.length) return;

    for (const msg of messages) {
      const from = msg.from;
      const text = msg.text?.body;
      if (text == null) continue;

      const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;
      const payload = {
        messaging_product: 'whatsapp',
        to: from,
        type: 'text',
        text: { body: text },
      };
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) {
        const err = await resp.text();
        console.error('Error enviando mensaje:', resp.status, err);
      }
    }
  } catch (e) {
    console.error('Error en webhook:', e);
  }
};

app.post('/webhook', handleWebhookPost);
app.post('/webhook/', handleWebhookPost);

/** Inicia el servidor HTTP en el puerto configurado */
app.listen(port, () => {
  console.log(`\nListening on port ${port}`);
  console.log(`http://localhost:${port}`);
});