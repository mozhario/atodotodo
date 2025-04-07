import { useState, useEffect } from 'react'
import axios from 'axios'
import './styles/index.css'

function App() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [editingTodos, setEditingTodos] = useState({})
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)

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

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/auth/register', { username, password })
      localStorage.setItem('token', response.data.token)
      setIsAuthenticated(true)
      setError('')
      fetchTodos()
    } catch (error) {
      setError(error.response?.data?.error || 'Error registering')
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/auth/login', { username, password })
      localStorage.setItem('token', response.data.token)
      setIsAuthenticated(true)
      setError('')
      fetchTodos()
    } catch (error) {
      setError(error.response?.data?.error || 'Error logging in')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    setTodos([])
    setUsername('')
    setPassword('')
  }

  const addTodo = async (e) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post('/api/todos', 
        { title: newTodo },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setTodos([response.data, ...todos])
      setNewTodo('')
    } catch (error) {
      console.error('Error adding todo:', error)
    }
  }

  const toggleTodo = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(`/api/todos/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
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
      const token = localStorage.getItem('token')
      const response = await axios.patch(`/api/todos/${id}`, 
        { title: newTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      )
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
      const token = localStorage.getItem('token')
      await axios.delete(`/api/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTodos(todos.filter(todo => todo.id !== id))
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="app">
        <h1 className="text-center mb-4">a todo to do</h1>
        <div className="auth-form">
          {error && <p className="error">{error}</p>}
          {isRegistering ? (
            <>
              <form onSubmit={handleRegister}>
                <h2>Register</h2>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="input mb-2"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="input mb-2"
                />
                <button type="submit" className="btn btn-primary mb-2">Register</button>
              </form>
              <p className="text-center">
                Already have an account?{' '}
                <button 
                  onClick={() => setIsRegistering(false)}
                  className="btn-link"
                >
                  Login here
                </button>
              </p>
            </>
          ) : (
            <>
              <form onSubmit={handleLogin}>
                <h2>Login</h2>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="input mb-2"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="input mb-2"
                />
                <button type="submit" className="btn btn-primary mb-2">Login</button>
              </form>
              <p className="text-center">
                Don't have an account?{' '}
                <button 
                  onClick={() => setIsRegistering(true)}
                  className="btn-link"
                >
                  Register here
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="header">
        <h1 className="text-center mb-4">a todo to do</h1>
        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
      </div>
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