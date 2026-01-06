import { useState, useEffect } from "react";

export default function Home() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function addTask() {
    if (!task.trim()) return;
    setTasks([...tasks, task.trim()]);
    setTask("");
  }

  function deleteTask(index) {
    setTasks(tasks.filter((_, i) => i !== index));
  }

  function clearAll() {
    setTasks([]);
    localStorage.removeItem("tasks");
  }

  function smartSort() {
    if (tasks.length < 2) return;

    const priorityWords = ["работа", "проект", "сметки", "плащане"];
    const sorted = [...tasks].sort((a, b) => {
      const aPriority = priorityWords.some((w) =>
        a.toLowerCase().includes(w)
      );
      const bPriority = priorityWords.some((w) =>
        b.toLowerCase().includes(w)
      );
      if (aPriority !== bPriority) return bPriority - aPriority;
      return b.length - a.length;
    });

    setTasks(sorted);
  }

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: 20, color: "#111" }}>
        Моят Planner 🧠
      </h1>

      <input
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Напиши задача..."
        style={{
          padding: 12,
          width: "100%",
          marginBottom: 12,
          borderRadius: 8,
          border: "1px solid #ccc",
          fontSize: 16,
        }}
      />

      <button
        onClick={addTask}
        style={{
          width: "100%",
          padding: 12,
          marginBottom: 12,
          borderRadius: 8,
          border: "none",
          fontWeight: "bold",
          fontSize: 16,
          color: "#fff",
          background: "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
          cursor: "pointer",
        }}
      >
        Добави задача
      </button>

      <button
        onClick={smartSort}
        style={{
          width: "100%",
          padding: 12,
          marginBottom: 12,
          borderRadius: 8,
          border: "none",
          fontWeight: "bold",
          fontSize: 16,
          color: "#fff",
          background: "linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)",
          cursor: "pointer",
        }}
      >
        Умно подрежда 🧠
      </button>

      <button
        onClick={clearAll}
        style={{
          width: "100%",
          padding: 12,
          marginBottom: 20,
          borderRadius: 8,
          border: "none",
          fontWeight: "bold",
          fontSize: 16,
          color: "#fff",
          background: "linear-gradient(90deg, #ff416c 0%, #ff4b2b 100%)",
          cursor: "pointer",
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
              padding: 12,
              marginBottom: 12,
              borderRadius: 12,
              background: "#f7f7f7",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              fontSize: 16,
            }}
          >
            <span>{t}</span>
            <button
              onClick={() => deleteTask(i)}
              style={{
                background: "#ff4b2b",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "6px 10px",
                cursor: "pointer",
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
