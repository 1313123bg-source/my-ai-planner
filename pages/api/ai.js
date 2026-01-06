import { useState, useEffect } from "react";

export default function Home() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Зареждане
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("tasks");
      if (saved) setTasks(JSON.parse(saved));
    }
  }, []);

  // Запазване
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  function addTask() {
    if (!task.trim()) return;
    setTasks([...tasks, task.trim()]);
    setTask("");
  }

  function deleteTask(index) {
    setTasks(tasks.filter((_, i) => i !== index));
  }

  function clearAllTasks() {
    setTasks([]);
    localStorage.removeItem("tasks");
  }

  // 🔥 ЖЕЛЯЗНО ПОДРЕЖДАНЕ
  async function sortWithAI() {
    if (tasks.length < 2) return;

    setLoading(true);

    // 1️⃣ ВИНАГИ първо локално размесване (моментално)
    let shuffled = [...tasks].sort(() => Math.random() - 0.5);
    setTasks(shuffled);

    // 2️⃣ Опит AI (НЕ блокира UI)
    try {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 2000); // макс 2 сек

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks }),
        signal: controller.signal,
      });

      const data = await res.json();
      if (Array.isArray(data.tasks) && data.tasks.length > 0) {
        setTasks(data.tasks);
      }
    } catch {
      // НИЩО — локалното вече е направено
    }

    setLoading(false);
  }

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "0 auto" }}>
      <h1>Моят AI Planner 🤖</h1>

      <input
        placeholder="Напиши задача..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
        style={{ padding: 10, width: "100%", marginBottom: 8 }}
      />

      <button
        onClick={addTask}
        style={{ padding: 10, width: "100%", marginBottom: 8 }}
      >
        Добави задача
      </button>

      <button
        onClick={sortWithAI}
        style={{
          padding: 10,
          width: "100%",
          backgroundColor: "#000",
          color: "#fff",
          marginBottom: 8,
        }}
      >
        {loading ? "Подреждам..." : "Подреди 🤖"}
      </button>

      <button
        onClick={clearAllTasks}
        style={{
          padding: 10,
          width: "100%",
          backgroundColor: "#ccc",
          marginBottom: 16,
        }}
      >
        Изчисти всички 🧹
      </button>

      <ul style={{ padding: 0 }}>
        {tasks.map((t, i) => (
          <li
            key={i}
            style={{
              listStyle: "none",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
              padding: 8,
              border: "1px solid #ddd",
              borderRadius: 6,
            }}
          >
            <span>{t}</span>
            <button
              onClick={() => deleteTask(i)}
              style={{
                background: "red",
                color: "white",
                border: "none",
                borderRadius: 4,
                padding: "4px 8px",
              }}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
