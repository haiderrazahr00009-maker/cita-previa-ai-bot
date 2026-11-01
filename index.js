require("dotenv").config();

const express = require("express");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

// Main Bot Page
app.get("/", (req, res) => {
    res.send("Cita Previa Extranjeria AI Bot is Running!");
});

// WhatsApp Webhook Verification
app.get("/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

          if (
                mode === "subscribe" &&
                token === process.env.WHATSAPP_VERIFY_TOKEN
              ) {
                return res.status(200).send(challenge);
          }

          res.sendStatus(403);
});

// Receive WhatsApp Messages
app.post("/webhook", (req, res) => {
    try {
          const body = req.body;

      if (body.object === "whatsapp_business_account") {
              for (const entry of body.entry || []) {
                        for (const change of entry.changes || []) {
                                    const value = change.value || {};

                          for (const message of value.messages || []) {
                                        const from = message.from;
                                        const messageText =
                                                        message.text?.body || "";

                                      console.log("New Client:", from);
                                        console.log("Message:", messageText);
                          }
                        }
              }
      }

      res.sendStatus(200);

    } catch (error) {
          console.error(error);
          res.sendStatus(500);
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(
          `Cita Previa AI Bot running on port ${PORT}`
        );
});
