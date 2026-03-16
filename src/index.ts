import express from "express";
import { handleVerification, handleWebhookEvent } from "./webhook";

const app = express();
app.use(express.json());

// Health check
app.get("/", (_req, res) => {
  res.json({ status: "ok", service: "social-media-agent" });
});

// Facebook Webhook verification (GET)
app.get("/webhook", handleVerification);

// Facebook Webhook events (POST)
app.post("/webhook", handleWebhookEvent);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Social Media Agent running on port ${PORT}`);
});
