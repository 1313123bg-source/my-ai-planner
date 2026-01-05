
import { useState } from "react";

export default function Home() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  function addTask() {
    if (task === "") return;
    setTasks([...tasks, task]);
    setTask("");
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
