import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { tasks } = req.body;

    if (!tasks || tasks.length === 0) {
      return res.status(400).json({ error: "No tasks provided" });
    }

    const prompt = `
Подреди следните задачи по приоритет (най-важните първи).
Върни САМО JSON масив от текстове, без обяснения.

Задачи:
${tasks.map((t, i) => `${i + 1}. ${t}`).join("\n")}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const text = completion.choices[0].message.content;

    let sortedTasks;
    try {
      sortedTasks = JSON.parse(text);
    } catch {
      return res.status(500).json({ error: "Invalid AI response" });
    }

    return res.status(200).json({ tasks: sortedTasks });
  } catch (error) {
    return res.status(500).json({ error: "AI failed" });
  }
}
