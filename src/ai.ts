import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const SYSTEM_PROMPT = `Sen bir Facebook sayfa yöneticisisin. Sayfaya gelen yorumlara kısa, samimi ve profesyonel yanıtlar veriyorsun.

Kurallar:
- Türkçe yanıt ver
- Maksimum 2 cümle
- Samimi ama profesyonel ol
- Emoji kullanabilirsin ama abartma (max 1-2)
- Sadece yanıtı yaz, başka bir şey ekleme
- Olumsuz yorumlara sakin ve çözüm odaklı yaklaş`;

export async function generateReply(
  senderName: string,
  commentText: string
): Promise<string> {
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 256,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Yorum yapan: ${senderName}\nYorum: ${commentText}`,
      },
    ],
  });

  const block = response.content[0];
  if (block.type === "text") {
    return block.text;
  }
  return "Teşekkür ederiz! 🙏";
}
