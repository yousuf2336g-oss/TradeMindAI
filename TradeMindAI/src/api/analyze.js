import axios from "axios";

export default async function handler(req, res) {
  try {
    const { pair } = req.body;
    const key = process.env.OPENAI_API_KEY;

    if (!key) {
      return res.status(200).json({
        analysis: "⚠️ Test Mode: No API key found.\nAdd your OpenAI key in Vercel → Settings → Environment Variables to enable live analysis."
      });
    }

    const prompt = `Analyze recent ${pair} crypto price trends and give a short summary with indicators like RSI, MACD, volume trend. Format with emojis and color hints.`;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiText = response.data.choices?.[0]?.message?.content || "No analysis available.";
    res.status(200).json({ analysis: aiText });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      analysis: "❌ Error fetching AI analysis. Check API key or network connection.",
    });
  }
}
