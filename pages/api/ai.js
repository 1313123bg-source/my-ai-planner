async function sortWithAI() {
  if (tasks.length === 0) return;

  setLoading(true);

  let sortedTasks = [];

  // Ако задачи < 5 → разбъркваме локално
  if (tasks.length < 5) {
    sortedTasks = [...tasks].sort(() => Math.random() - 0.5);
  } else {
    // Иначе правим реален AI call (за повече задачи)
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks }),
      });
      const data = await response.json();
      sortedTasks = data.tasks || tasks;
    } catch {
      sortedTasks = [...tasks].sort(() => Math.random() - 0.5);
    }
  }

  setTasks(sortedTasks);
  setLoading(false);
}
