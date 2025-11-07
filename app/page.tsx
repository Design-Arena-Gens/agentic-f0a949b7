'use client'

import { useState, useEffect } from 'react'

interface Task {
  id: number
  text: string
  completed: boolean
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const addTask = () => {
    if (inputValue.trim() === '') return

    const newTask: Task = {
      id: Date.now(),
      text: inputValue,
      completed: false,
    }

    setTasks([...tasks, newTask])
    setInputValue('')
  }

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask()
    }
  }

  const completedCount = tasks.filter((task) => task.completed).length
  const activeCount = tasks.length - completedCount

  return (
    <div className="container">
      <div className="app-header">
        <h1>📝 Task Manager</h1>
        <p>Apne daily tasks ko organize karein</p>
      </div>

      <div className="task-input-container">
        <input
          type="text"
          className="task-input"
          placeholder="Naya task likhein..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="add-button" onClick={addTask}>
          Add
        </button>
      </div>

      <div className="tasks-container">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">✨</div>
            <p className="empty-state-text">
              Abhi koi task nahi hai. Naya task add karein!
            </p>
          </div>
        ) : (
          <>
            <ul className="tasks-list">
              {tasks.map((task) => (
                <li key={task.id} className="task-item">
                  <input
                    type="checkbox"
                    className="task-checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                  />
                  <span
                    className={`task-text ${
                      task.completed ? 'completed' : ''
                    }`}
                  >
                    {task.text}
                  </span>
                  <button
                    className="delete-button"
                    onClick={() => deleteTask(task.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>

            <div className="stats">
              <div className="stat-item">
                <span className="stat-number">{tasks.length}</span>
                <span className="stat-label">Total</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{activeCount}</span>
                <span className="stat-label">Active</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{completedCount}</span>
                <span className="stat-label">Completed</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
