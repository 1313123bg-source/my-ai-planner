import { useState, useEffect } from "react";

export default function Home() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Зареждане на задачите от localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTasks = localStorage.getItem("tasks");
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    }
  }, []);

  // Запазване на задачите при всяка промяна
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  function addTask() {
    if (task.trim() === "") return;
    setTasks([...tasks, task]);
    setTask("");
  }

  async function sortWithAI() {
    if (tasks.length === 0) return;

    setLoading(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tasks }),
      });

      const data = await response.json();
      if (data.tasks) {
        setTasks(data.tasks);
      }
    } catch (error) {
      alert("Грешка при AI подреждане");
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
        style={{ padding: 8, width: "100%", marginBottom: 8 }}
      />

      <button onClick={addTask} style={{ padding: 8, width: "100%" }}>
        Добави задача
      </button>

      <button
        onClick={sortWithAI}
        disabled={loading}
        style={{
          padding: 8,
          width: "100%",
          marginTop: 10,
          backgroundColor: "#000",
          color: "#fff",
        }}
      >
        {loading ? "AI мисли..." : "Подреди с AI 🤖"}
      </button>

      <ul style={{ marginTop: 20 }}>
        {tasks.map((t, i) => (
          <li key={i} style={{ marginBottom: 6 }}>
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
