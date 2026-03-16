const PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN || "";
const GRAPH_API_VERSION = "v23.0";
const BASE_URL = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

export async function isOwnComment(commentId: string, pageId: string): Promise<boolean> {
  const url = `${BASE_URL}/${commentId}?fields=from&access_token=${PAGE_ACCESS_TOKEN}`;
  try {
    const response = await fetch(url);
    if (!response.ok) return false;
    const data = await response.json() as { from?: { id?: string } };
    return data.from?.id === pageId;
  } catch {
    return false;
  }
}

export async function postComment(
  commentId: string,
  message: string
): Promise<void> {
  const url = `${BASE_URL}/${commentId}/comments`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      access_token: PAGE_ACCESS_TOKEN,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Facebook API error (${response.status}): ${error}`);
  }
}
