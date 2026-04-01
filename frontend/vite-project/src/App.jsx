import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  // GET tasks
  const fetchTasks = async () => {
    const res = await axios.get("http://127.0.0.1:5001/tasks");
    setTasks(res.data);
  };

  // ADD task
  const addTask = async () => {
    if (!title) return;
    await axios.post("http://127.0.0.1:5001/tasks", {
      title: title,
    });
    setTitle("");
    fetchTasks();
  };

  const completeTask = async (id) => {
  await axios.put(`http://127.0.0.1:5001/tasks/${id}`);
  fetchTasks();
   };

  // LOAD tasks on page load
  useEffect(() => {
    fetchTasks();
  }, []);

const deleteTask = async (id) => {
  await axios.delete(`http://127.0.0.1:5001/tasks/${id}`);
  fetchTasks();
};

 return (
  <div className="container">
    <div className="title">✨ Task Manager</div>
   <div className="stats">
  <div className="stat">
    <p>Total</p>
    <h3>{tasks.length}</h3>
  </div>
  <div className="stat">
    <p>Completed</p>
    <h3>{tasks.filter(t => t.completed).length}</h3>
  </div>
</div>
    <div className="input-group">
      <input
        className="input-box"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter your task..."
      />

      <button className="add-btn" onClick={addTask}>
        Add
      </button>
    </div>

    <div className="task-list">
      {tasks.map((task) => (
        <div key={task.id} className="task-card">
          <span className={`task-text ${task.completed ? "completed" : ""}`}>
            {task.title}
          </span>

          <div className="actions">
            <button
              className="complete-btn"
              onClick={() => completeTask(task.id)}
            >
              ✔
            </button>

            <button
              className="delete-btn"
              onClick={() => deleteTask(task.id)}
            >
              ✖
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

}

export default App;