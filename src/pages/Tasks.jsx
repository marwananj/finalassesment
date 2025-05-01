import { useState, useEffect } from 'react'
import { HiClipboardCheck, HiTrash, HiPencil, HiCheck } from 'react-icons/hi'
import { useAuth } from '../contexts/AuthContext'

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('all')
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' })
  const [editingId, setEditingId] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      const storedTasks = localStorage.getItem(`tasks_${user.id}`)
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks))
      }
    }
  }, [user])

  const updateLocalStorage = (updatedTasks) => {
    localStorage.setItem(`tasks_${user.id}`, JSON.stringify(updatedTasks))
  }

  const addTask = (e) => {
    e.preventDefault()
    if (!newTask.title.trim()) return
    
    const newTaskItem = {
      id: Date.now(),
      ...newTask,
      userId: user.id,
      userName: user.name,
      completed: false,
      createdAt: new Date().toISOString()
    }
    
    const updatedTasks = [newTaskItem, ...tasks]
    setTasks(updatedTasks)
    updateLocalStorage(updatedTasks)
    setNewTask({ title: '', description: '', priority: 'medium' })
  }

  const toggleTask = (id) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    )
    setTasks(updatedTasks)
    updateLocalStorage(updatedTasks)
  }

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id)
    setTasks(updatedTasks)
    updateLocalStorage(updatedTasks)
  }

  const startEditing = (task) => {
    setEditingId(task.id)
    setNewTask({ title: task.title, description: task.description, priority: task.priority })
  }

  const updateTask = (e) => {
    e.preventDefault()
    const updatedTasks = tasks.map(task => 
      task.id === editingId ? { ...task, ...newTask } : task
    )
    setTasks(updatedTasks)
    updateLocalStorage(updatedTasks)
    setEditingId(null)
    setNewTask({ title: '', description: '', priority: 'medium' })
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed
    if (filter === 'incomplete') return !task.completed
    return true
  })

  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  }

  return (
    <div className="max-w-3xl mx-auto px-3 py-3">
      <div className="flex items-center gap-1.5 mb-3">
        <HiClipboardCheck className="w-4 h-4 text-primary" />
        <h1 className="text-lg font-semibold text-gray-900">Task Manager</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-3 mb-3">
        <form className="space-y-2" onSubmit={editingId ? updateTask : addTask}>
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="w-full px-2 py-1 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary"
            placeholder="Task title"
          />
          <textarea
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            className="w-full px-2 py-1 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary resize-none"
            placeholder="Description"
            rows={2}
          />
          <div className="flex gap-2">
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              className="px-2 py-1 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <button
              type="submit"
              className="px-3 py-1 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-dark"
            >
              {editingId ? 'Update Task' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>

      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-medium text-gray-900">Tasks</h2>
        <div className="flex gap-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-2 py-1 text-xs font-medium rounded-md ${
              filter === 'all' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-2 py-1 text-xs font-medium rounded-md ${
              filter === 'completed' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter('incomplete')}
            className={`px-2 py-1 text-xs font-medium rounded-md ${
              filter === 'incomplete' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Incomplete
          </button>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-4 text-gray-500 text-sm">
          No tasks found
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTasks.map(task => (
            <div
              key={task.id}
              className={`bg-white p-2 rounded-md shadow-sm border-l-4 ${
                task.completed ? 'border-green-500' : 'border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`p-0.5 rounded ${
                        task.completed ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      <HiCheck className="w-4 h-4" />
                    </button>
                    <h3 className={`text-sm font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                      {task.title}
                    </h3>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${priorityColors[task.priority]}`}>
                      {task.priority}
                    </span>
                  </div>
                  {task.description && (
                    <p className="mt-1 text-xs text-gray-500 pl-6">{task.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => startEditing(task)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <HiPencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <HiTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Tasks