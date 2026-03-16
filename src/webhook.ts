import { Request, Response } from "express";
import { generateReply } from "./ai";
import { postComment } from "./facebook";

const VERIFY_TOKEN = process.env.FACEBOOK_VERIFY_TOKEN || "sanatsepet2026";

export function handleVerification(req: Request, res: Response): void {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("[Webhook] Verification successful");
    res.status(200).send(challenge);
  } else {
    console.log("[Webhook] Verification failed", { mode, token });
    res.sendStatus(403);
  }
}

export async function handleWebhookEvent(
  req: Request,
  res: Response
): Promise<void> {
  // Respond immediately to Facebook (they timeout after 20s)
  res.status(200).send("EVENT_RECEIVED");

  const body = req.body;

  if (body.object !== "page") {
    console.log("[Webhook] Not a page event, ignoring");
    return;
  }

  for (const entry of body.entry || []) {
    for (const change of entry.changes || []) {
      if (change.value?.item === "comment" && change.value?.verb === "add") {
        const { comment_id, message, sender_name, sender_id, post_id } =
          change.value;

        const pageId = entry.id;
        if (sender_id === pageId) {
          console.log("[Webhook] Skipping own comment");
          continue;
        }

        console.log(
          `[Webhook] New comment from ${sender_name}: "${message}" (ID: ${comment_id})`
        );

        try {
          const reply = await generateReply(sender_name, message);
          console.log(`[AI] Generated reply: "${reply}"`);

          await postComment(comment_id, reply);
          console.log(`[Facebook] Reply posted to comment ${comment_id}`);
        } catch (err) {
          console.error("[Error] Failed to process comment:", err);
        }
      }
    }
  }
}
