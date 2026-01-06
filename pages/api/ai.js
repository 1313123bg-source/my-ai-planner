import { useState, useEffect } from "react";

export default function Home() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

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

  // 🧠 SMART ПОДРЕЖДАНЕ (МНОГО БЪРЗО)
  function smartSort() {
    if (tasks.length < 2) return;

    const priorityWords = [
      "работа",
      "сметки",
      "плащане",
      "среща",
      "deadline",
      "проект",
    ];

    const sorted = [...tasks].sort((a, b) => {
      const aScore = priorityWords.some((w) =>
        a.toLowerCase().includes(w)
      )
        ? 1
        : 0;
      const bScore = priorityWords.some((w) =>
        b.toLowerCase().includes(w)
      )
        ? 1
        : 0;

      if (aScore !== bScore) return bScore - aScore;
      return b.length - a.length;
    });

    setTasks(sorted);
  }

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "0 auto" }}>
      <h1>Моят Smart Planner 🧠</h1>

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
        onClick={smartSort}
        style={{
          padding: 10,
          width: "100%",
          backgroundColor: "#000",
          color: "#fff",
          marginBottom: 8,
        }}
      >
        Подреди умно 🧠
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
