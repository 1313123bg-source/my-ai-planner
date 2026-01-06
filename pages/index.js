import { useState, useEffect } from "react";

export default function Home() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  // Зареждане от localStorage
  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  // Запазване в localStorage
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

  // 🧠 УМНО ПОДРЕЖДАНЕ (БЕЗ AI)
  function smartSort() {
    if (tasks.length < 2) return;

    const priorityWords = [
      "работа",
      "проект",
      "сметки",
      "плащане",
      "фитнес",
      "учене",
    ];

    const sorted = [...tasks].sort((a, b) => {
      const aPriority = priorityWords.some(w =>
        a.toLowerCase().includes(w)
      );
      const bPriority = priorityWords.some(w =>
        b.toLowerCase().includes(w)
      );

      if (aPriority !== bPriority) return bPriority - aPriority;
      return b.length - a.length;
    });

    setTasks(sorted);
  }

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "0 auto" }}>
      <h1>Моят Planner 🧠</h1>

      <input
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Напиши задача..."
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
          background: "black",
          color: "white",
          marginBottom: 8,
        }}
      >
        Умно подрежда 🧠
      </button>

      <button
        onClick={clearAll}
        style={{
          padding: 10,
          width: "100%",
          background: "#ccc",
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
              padding: 8,
              marginBo
