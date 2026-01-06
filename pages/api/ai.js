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

    if (!Array.isArray(tasks) || tasks.length < 2) {
      return res.status(200).json({ tasks });
    }

    const prompt = `
Ти си асистент за продуктивност.

Подреди задачите по ВАЖНОСТ и СПЕШНОСТ.
Ако не си сигурен, ПРИНУДИТЕЛНО промени реда им.
НЕ запазвай оригиналния ред.

Върни САМО валиден JSON масив от текстове.
Без обяснения. Без markdown.

Задачи:
${tasks.map((t, i) => `${i + 1}. ${t}`).join("\n")}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    const text = completion.choices[0].message.content;

    let sortedTasks;
    try {
      sortedTasks = JSON.parse(text);
    } catch {
      // ако AI не върне JSON → разбъркване като fallback
      sortedTasks = [...tasks].sort(() => Math.random() - 0.5);
    }

    // ако AI е върнал същия ред → принудително размесване
    const sameOrder =
      sortedTasks.length === tasks.length &&
      sortedTasks.every((t, i) => t === tasks[i]);

    if (sameOrder) {
      sortedTasks = [...tasks].sort(() => Math.random() - 0.5);
    }

    return res.status(200).json({ tasks: sortedTasks });
  } catch (error) {
    return res.status(500).json({ error: "AI failed" });
  }
}
