import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { HiClipboardCheck, HiCube, HiShoppingCart, HiHeart, HiTrendingUp, HiTrendingDown } from 'react-icons/hi'
import { useAuth } from '../contexts/AuthContext'

const Dashboard = () => {
  const { user } = useAuth()
  const [timeRange, setTimeRange] = useState('weekly')
  const [stats, setStats] = useState({
    tasks: { total: 0, completed: 0, progress: [] },
    products: { total: 0, favorites: 0, categories: {} },
    cart: { items: 0, total: 0, history: [] },
    revenue: { current: 0, previous: 0, growth: 0 }
  })
  const [activityData, setActivityData] = useState([])
  const [salesDistribution, setSalesDistribution] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const calculateStats = () => {
      // Get user-specific tasks
      const tasks = JSON.parse(localStorage.getItem(`tasks_${user.id}`) || '[]')
      const completedTasks = tasks.filter(task => task.completed)
      const taskProgress = tasks.reduce((acc, task) => {
        const date = new Date(task.createdAt).toLocaleDateString()
        acc[date] = acc[date] || { total: 0, completed: 0 }
        acc[date].total++
        if (task.completed) acc[date].completed++
        return acc
      }, {})

      // Get products and user-specific favorites
      const products = JSON.parse(localStorage.getItem('products') || '[]')
      const favorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || '[]')
      const categories = products.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1
        return acc
      }, {})

      // Get user-specific cart data
      const cart = JSON.parse(localStorage.getItem(`cart_${user.id}`) || '[]')
      const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      
      // Calculate user-specific revenue
      const purchaseHistory = JSON.parse(localStorage.getItem(`purchases_${user.id}`) || '[]')
      const currentPeriodStart = getPeriodStart(timeRange)
      const previousPeriodStart = getPreviousPeriodStart(timeRange)
      
      const currentRevenue = purchaseHistory
        .filter(p => new Date(p.date) >= currentPeriodStart)
        .reduce((sum, p) => sum + p.total, 0)
      
      const previousRevenue = purchaseHistory
        .filter(p => new Date(p.date) >= previousPeriodStart && new Date(p.date) < currentPeriodStart)
        .reduce((sum, p) => sum + p.total, 0)

      const revenueGrowth = calculateGrowth(currentRevenue, previousRevenue)

      setStats({
        tasks: {
          total: tasks.length,
          completed: completedTasks.length,
          progress: taskProgress
        },
        products: {
          total: products.length,
          favorites: favorites.length,
          categories
        },
        cart: {
          items: cart.length,
          total: cartTotal,
          history: cart.map(item => ({
            name: item.title,
            quantity: item.quantity,
            total: item.price * item.quantity
          }))
        },
        revenue: {
          current: currentRevenue || cartTotal,
          previous: previousRevenue,
          growth: revenueGrowth
        }
      })

      // Generate activity data based on user-specific data
      const activityData = generateActivityData(timeRange, {
        tasks: taskProgress,
        purchases: purchaseHistory,
        cart
      })
      setActivityData(activityData)

      // Generate sales distribution from categories
      const distributionData = Object.entries(categories).map(([category, count]) => ({
        name: category,
        value: Math.round((count / products.length) * 100)
      }))
      setSalesDistribution(distributionData)

      setIsLoading(false)
    }

    if (user) {
      calculateStats()
    }
  }, [timeRange, user])

  const getPeriodStart = (range) => {
    const now = new Date()
    switch (range) {
      case 'daily':
        return new Date(now.setHours(0, 0, 0, 0))
      case 'weekly':
        return new Date(now.setDate(now.getDate() - now.getDay()))
      case 'monthly':
        return new Date(now.setDate(1))
      default:
        return now
    }
  }

  const getPreviousPeriodStart = (range) => {
    const start = getPeriodStart(range)
    switch (range) {
      case 'daily':
        return new Date(start.setDate(start.getDate() - 1))
      case 'weekly':
        return new Date(start.setDate(start.getDate() - 7))
      case 'monthly':
        return new Date(start.setMonth(start.getMonth() - 1))
      default:
        return start
    }
  }

  const generateActivityData = (range, data) => {
    const periods = {
      daily: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`),
      weekly: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      monthly: Array.from({ length: getDaysInMonth() }, (_, i) => `Day ${i + 1}`)
    }

    return periods[range].map(period => {
      const periodData = {
        name: period,
        tasks: getTasksForPeriod(period, data.tasks, range),
        sales: getSalesForPeriod(period, data.purchases, range),
        revenue: getRevenueForPeriod(period, data.purchases, range)
      }
      return periodData
    })
  }

  const getDaysInMonth = () => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  }

  const getTasksForPeriod = (period, tasks, range) => {
    // Implementation for getting tasks count for the period
    return tasks[period]?.completed || 0
  }

  const getSalesForPeriod = (period, purchases, range) => {
    // Implementation for getting sales count for the period
    return purchases.filter(p => {
      const date = new Date(p.date)
      switch (range) {
        case 'daily':
          return date.getHours() === parseInt(period)
        case 'weekly':
          return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()] === period
        case 'monthly':
          return `Day ${date.getDate()}` === period
        default:
          return false
      }
    }).length
  }

  const getRevenueForPeriod = (period, purchases, range) => {
    // Implementation for getting revenue for the period
    return purchases.filter(p => {
      const date = new Date(p.date)
      switch (range) {
        case 'daily':
          return date.getHours() === parseInt(period)
        case 'weekly':
          return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()] === period
        case 'monthly':
          return `Day ${date.getDate()}` === period
        default:
          return false
      }
    }).reduce((sum, p) => sum + p.total, 0)
  }

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe']

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  }

  const calculateGrowth = (current, previous) => {
    if (!previous) return 0
    return ((current - previous) / previous) * 100
  }

  const stats_display = [
    {
      id: 1,
      title: 'Tasks Progress',
      value: `${stats.tasks.completed}/${stats.tasks.total}`,
      icon: <HiClipboardCheck className="h-5 w-5" />,
      change: `${Math.round((stats.tasks.completed / (stats.tasks.total || 1)) * 100)}%`,
      color: 'text-blue-600'
    },
    {
      id: 2,
      title: 'Active Products',
      value: stats.products.total.toString(),
      icon: <HiCube className="h-5 w-5" />,
      change: `+${stats.products.favorites} favorited`,
      color: 'text-purple-600'
    },
    {
      id: 3,
      title: 'Cart Value',
      value: formatCurrency(stats.cart.total),
      icon: <HiShoppingCart className="h-5 w-5" />,
      change: `${stats.cart.items} items`,
      color: 'text-green-600'
    },
    {
      id: 4,
      title: 'Revenue',
      value: formatCurrency(stats.revenue.current),
      icon: <HiHeart className="h-5 w-5" />,
      change: `${stats.revenue.growth.toFixed(1)}%`,
      color: 'text-pink-600'
    },
  ]

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'revenue' ? formatCurrency(entry.value) : entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-900">Dashboard Overview</h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="daily">Today</option>
          <option value="weekly">This Week</option>
          <option value="monthly">This Month</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats_display.map(stat => (
          <div key={stat.id} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <span className={stat.color}>{stat.icon}</span>
              <span className={`text-xs font-medium flex items-center gap-1 ${
                stat.change.includes('-') ? 'text-red-600' : 'text-green-600'
              }`}>
                {stat.change.includes('-') ? (
                  <HiTrendingDown className="w-4 h-4" />
                ) : (
                  <HiTrendingUp className="w-4 h-4" />
                )}
                {stat.change}
              </span>
            </div>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Activity Overview</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="tasks"
                  stackId="1"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.1}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stackId="1"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.1}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stackId="1"
                  stroke="#ffc658"
                  fill="#ffc658"
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Sales Distribution</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salesDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {salesDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4">
            {salesDistribution.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between text-sm mb-2">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-gray-600">{entry.name}</span>
                </div>
                <span className="font-medium">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard