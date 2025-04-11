import { useState, useEffect } from 'react'
import Header from './components/Header/Header'
import AuthForm from './components/Auth/AuthForm'
import TodoForm from './components/TodoForm/TodoForm'
import TodoList from './components/TodoList/TodoList'
import { audioService } from './services/AudioService'
import { authService } from './services/authService'
import { todoService } from './services/todoService'
import './styles/index.css'
import './styles/loader.css'

function App() {
  const [todos, setTodos] = useState([])
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (authService.isSignedIn()) {
      setIsSignedIn(true)
      loadUserTodos()
    }
  }, [])

  const loadUserTodos = async () => {
    setIsLoading(true)
    try {
      const userTodos = await todoService.getUserTodos()
      setTodos(userTodos)
    } catch (error) {
      console.error('Error loading todos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (username, password) => {
    await authService.signUp(username, password)
    setIsSignedIn(true)
    loadUserTodos()
  }

  const handleSignIn = async (username, password) => {
    await authService.signIn(username, password)
    setIsSignedIn(true)
    loadUserTodos()
  }

  const handleSignOut = () => {
    authService.signOut()
    setIsSignedIn(false)
    setTodos([])
  }

  const handleCreateTodo = async (title) => {
    try {
      const newTodo = await todoService.createTodo(title)
      setTodos([newTodo, ...todos])
      audioService.playAddSound()
    } catch (error) {
      console.error('Error creating todo:', error)
    }
  }

  const handleToggleTodoCompletion = async (id) => {
    try {
      const updatedTodo = await todoService.toggleTodoCompletion(id)
      setTodos(todos.map(todo => 
        todo.id === id ? updatedTodo : todo
      ))
      if (updatedTodo.completed) {
        audioService.playCheckSound()
      } else {
        audioService.playUncheckSound()
      }
    } catch (error) {
      console.error('Error toggling todo:', error)
    }
  }

  const handleUpdateTodoTitle = async (id, title) => {
    try {
      const updatedTodo = await todoService.updateTodoTitle(id, title)
      setTodos(todos.map(todo => 
        todo.id === id ? updatedTodo : todo
      ))
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  const handleRemoveTodo = async (id) => {
    try {
      await todoService.removeTodo(id)
      setTodos(todos.filter(todo => todo.id !== id))
      audioService.playDeleteSound()
    } catch (error) {
      console.error('Error removing todo:', error)
    }
  }

  if (!isSignedIn) {
    return (
      <div className="app">
        <h1 className="text-center mb-4">a todo to do</h1>
        <AuthForm 
          onLogin={handleSignIn}
          onRegister={handleSignUp}
        />
      </div>
    )
  }

  return (
    <div className="app">
      <Header onLogout={handleSignOut} />
      <TodoForm onAdd={handleCreateTodo} />
      {isLoading ? (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      ) : (
        <TodoList
          todos={todos}
          onToggle={handleToggleTodoCompletion}
          onUpdate={handleUpdateTodoTitle}
          onDelete={handleRemoveTodo}
        />
      )}
    </div>
  )
}

export default App 