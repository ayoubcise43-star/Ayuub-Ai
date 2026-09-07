export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Server missing MISTRAL_API_KEY" });
    return;
  }

  const { messages } = req.body || {};
  if (!Array.isArray(messages)) {
    res.status(400).json({ error: "Invalid request: messages array required" });
    return;
  }

  try {
    const systemMessage = {
      role: "system",
      content:
        "Waxaad tahay Ayuub AI, chatbot caawiye ah oo si dabiici ah ugu jawaaba Af-Soomaali marka lagula hadlo Af-Soomaali, ama Ingiriisi marka lagula hadlo Ingiriisi. Jawaabahaagu ha ahaadeen kuwo gaaban, cad, oo faa'iido leh.",
    };

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey,
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        messages: [systemMessage, ...messages],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      res.status(response.status).json(data);
      return;
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Upstream request failed" });
  }
}
