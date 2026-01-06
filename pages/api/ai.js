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
Подреди следните задачи по важност (най-важните първи).  
Върни ги като списък, по една на ред.  
Не добавяй обяснения, не използвай JSON:

${tasks.map((t, i) => `${i + 1}. ${t}`).join("\n")}
`;

    const completion = await openai.responses.create({
      model: "gpt-3.5-turbo",
      input: prompt,
      temperature: 0.7,
      max_output_tokens: 500,
    });

    // Текст от AI
    const text = completion.output_text || "";

    // Парсваме ред по ред
    let sortedTasks = text
      .split("\n")
      .map((line) => line.replace(/^\d+\.\s*/, "").trim())
      .filter((line) => line.length > 0);

    // Ако редът е същият → fallback
    const sameOrder =
      sortedTasks.length === tasks.length &&
      sortedTasks.every((t, i) => t === tasks[i]);
    if (sameOrder) {
      sortedTasks = [...tasks].sort(() => Math.random() - 0.5);
    }

    res.status(200).json({ tasks: sortedTasks });
  } catch (error) {
    console.log("AI Error:", error);
    return res.status(500).json({ error: "AI failed" });
  }
}
