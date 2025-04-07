import { useState, useEffect } from 'react'
import axios from 'axios'
import Header from './components/Header/Header'
import AuthForm from './components/Auth/AuthForm'
import TodoForm from './components/TodoForm/TodoForm'
import TodoList from './components/TodoList/TodoList'
import { audioService } from './services/AudioService'
import './styles/index.css'

function App() {
  const [todos, setTodos] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsAuthenticated(true)
      fetchTodos()
    }
  }, [])

  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/todos', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTodos(response.data)
    } catch (error) {
      console.error('Error fetching todos:', error)
      if (error.response?.status === 401) {
        handleLogout()
      }
    }
  }

  const handleRegister = async (username, password) => {
    const response = await axios.post('/api/auth/register', { username, password })
    localStorage.setItem('token', response.data.token)
    setIsAuthenticated(true)
    fetchTodos()
  }

  const handleLogin = async (username, password) => {
    const response = await axios.post('/api/auth/login', { username, password })
    localStorage.setItem('token', response.data.token)
    setIsAuthenticated(true)
    fetchTodos()
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    setTodos([])
  }

  const handleAddTodo = async (title) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post('/api/todos', 
        { title },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setTodos([response.data, ...todos])
      audioService.playAddSound()
    } catch (error) {
      console.error('Error adding todo:', error)
    }
  }

  const handleToggleTodo = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const todo = todos.find(t => t.id === id)
      const response = await axios.post(`/api/todos/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTodos(todos.map(todo => 
        todo.id === id ? response.data : todo
      ))
      if (response.data.completed) {
        audioService.playCheckSound()
      } else {
        audioService.playUncheckSound()
      }
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  const handleUpdateTodo = async (id, title) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.patch(`/api/todos/${id}`, 
        { title },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setTodos(todos.map(todo => 
        todo.id === id ? response.data : todo
      ))
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  const handleDeleteTodo = async (id) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`/api/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTodos(todos.filter(todo => todo.id !== id))
      audioService.playDeleteSound()
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="app">
        <h1 className="text-center mb-4">a todo to do</h1>
        <AuthForm 
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      </div>
    )
  }

  return (
    <div className="app">
      <Header onLogout={handleLogout} />
      <TodoForm onAdd={handleAddTodo} />
      <TodoList
        todos={todos}
        onToggle={handleToggleTodo}
        onUpdate={handleUpdateTodo}
        onDelete={handleDeleteTodo}
      />
    </div>
  )
}

export default App 