async function sortWithAI() {
  if (tasks.length === 0) return;

  setLoading(true);

  let sortedTasks = [];

  if (tasks.length < 5) {
    // Малък списък → локално разбъркване
    sortedTasks = [...tasks].sort(() => Math.random() - 0.5);
  } else {
    // По-голям списък → опит AI
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks }),
      });
      const data = await response.json();
      sortedTasks = data.tasks && data.tasks.length ? data.tasks : [...tasks].sort(() => Math.random() - 0.5);
    } catch {
      sortedTasks = [...tasks].sort(() => Math.random() - 0.5);
    }
  }

  setTasks(sortedTasks);
  setLoading(false);
}
