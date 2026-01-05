
import { useState, useEffect } from "react";


export default function Home() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    setTasks(JSON.parse(savedTasks));
  }
}, []);
  function addTask() {
  if (task === "") return;

  const newTasks = [...tasks, task];
  setTasks(newTasks);
  localStorage.setItem("tasks", JSON.stringify(newTasks));
  setTask("");
  }
  
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Моят AI Planner 🤖</h1>

      <input
        placeholder="Напиши задача..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
        style={{ padding: 8, width: "70%" }}
      />

      <button onClick={addTask} style={{ padding: 8, marginLeft: 5 }}>
        Добави
      </button>

      <ul>
        {tasks.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  );
}
