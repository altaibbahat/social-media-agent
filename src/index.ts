import express from "express";
import { handleVerification, handleWebhookEvent } from "./webhook";

const app = express();
app.use(express.json());

// Health check
app.get("/", (_req, res) => {
  res.json({ status: "ok", service: "social-media-agent" });
});

// Privacy Policy
app.get("/privacy", (_req, res) => {
  res.send(`<!DOCTYPE html><html><head><title>Privacy Policy</title></head><body>
<h1>Privacy Policy</h1>
<p>Last updated: March 17, 2026</p>
<p>This application accesses Facebook Page data solely to respond to comments on Pages managed by the app administrator.</p>
<h2>Data We Access</h2>
<ul>
<li>Public comments on Facebook Pages we manage</li>
<li>Commenter's public name</li>
</ul>
<h2>How We Use Data</h2>
<p>We use comment text and commenter names only to generate relevant replies. We do not store, sell, or share any personal data.</p>
<h2>Data Retention</h2>
<p>We do not retain any user data. Comments are processed in real-time and not stored.</p>
<h2>Contact</h2>
<p>For questions, contact: altaybasaranbahat@gmail.com</p>
</body></html>`);
});

// Facebook Webhook verification (GET)
app.get("/webhook", handleVerification);

// Facebook Webhook events (POST)
app.post("/webhook", handleWebhookEvent);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Social Media Agent running on port ${PORT}`);
});
