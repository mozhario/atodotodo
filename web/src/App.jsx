import { useState, useEffect } from 'react'
import axios from 'axios'
import './styles/index.css'

function App() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const response = await axios.get('/api/todos')
      setTodos(response.data)
    } catch (error) {
      console.error('Error fetching todos:', error)
    }
  }

  const addTodo = async (e) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    try {
      const response = await axios.post('/api/todos', { title: newTodo })
      setTodos([response.data, ...todos])
      setNewTodo('')
    } catch (error) {
      console.error('Error adding todo:', error)
    }
  }

  const toggleTodo = async (id, completed) => {
    try {
      await axios.patch(`/api/todos/${id}`, { completed: !completed })
      setTodos(todos.map(todo => 
        todo._id === id ? { ...todo, completed: !completed } : todo
      ))
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`)
      setTodos(todos.filter(todo => todo._id !== id))
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  return (
    <div className="app">
      <h1 className="text-center mb-4">Todo App</h1>
      <form onSubmit={addTodo} className="todo-form">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo..."
          className="input"
        />
        <button type="submit" className="btn btn-primary">Add</button>
      </form>
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo._id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo._id, todo.completed)}
              className="cursor-pointer"
            />
            <span className={todo.completed ? 'text-decoration-line-through text-muted' : ''}>
              {todo.title}
            </span>
            <button 
              onClick={() => deleteTodo(todo._id)} 
              className="btn btn-danger ml-auto"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App 