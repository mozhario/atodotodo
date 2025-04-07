import { useState, useEffect } from 'react'
import axios from 'axios'
import './styles/index.css'

function App() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [editingTodos, setEditingTodos] = useState({})

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

  const toggleTodo = async (id) => {
    try {
      const response = await axios.post(`/api/todos/${id}/toggle`)
      setTodos(todos.map(todo => 
        todo.id === id ? response.data : todo
      ))
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  const updateTodoTitle = async (id) => {
    const newTitle = editingTodos[id]
    if (!newTitle || newTitle === todos.find(t => t.id === id)?.title) return

    try {
      const response = await axios.patch(`/api/todos/${id}`, { title: newTitle })
      setTodos(todos.map(todo => 
        todo.id === id ? response.data : todo
      ))
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  const handleTodoChange = (id, value) => {
    setEditingTodos(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      e.target.blur()
    }
  }

  const handleBlur = (id) => {
    updateTodoTitle(id)
  }

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`)
      setTodos(todos.filter(todo => todo.id !== id))
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
          <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="cursor-pointer"
            />
            <input
              type="text"
              value={editingTodos[todo.id] === undefined ? todo.title : editingTodos[todo.id]}
              onChange={(e) => handleTodoChange(todo.id, e.target.value)}
              onBlur={() => handleBlur(todo.id)}
              onKeyDown={(e) => handleKeyDown(e, todo.id)}
              className={`edit-input ${todo.completed ? 'text-decoration-line-through text-muted' : ''}`}
            />
            <button 
              onClick={() => deleteTodo(todo.id)} 
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