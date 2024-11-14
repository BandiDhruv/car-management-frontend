import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Login from './components/Login'
import Signup from './components/Signup'
import CarList from './components/CarList'
import CarDetail from './components/CarDetail'
import CarEdit from './components/CarEdit'
import { Button } from '@/components/ui/button'
import CarCreate from './components/CarCreate'

// Create a type for our user
type User = {
  id: string
  username: string
}

export default function App() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // Verify the token with your backend
      axios.get('http:localhost:5000/api/auth/verify-token', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setUser(response.data.user)
      })
      .catch(() => {
        localStorage.removeItem('token')
      })
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold">Car Management</h1>
                </div>
              </div>
              <div className="flex items-center">
                {user ? (
                  <>
                    <span className="mr-4">Welcome, {user.username}</span>
                    <Button onClick={handleLogout}>Logout</Button>
                  </>
                ) : (
                  <>
                    <Button asChild className="mr-2">
                      <a href="/login">Login</a>
                    </Button>
                    <Button asChild variant="outline">
                      <a href="/signup">Signup</a>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/signup" element={<Signup setUser={setUser} />} />
            <Route 
              path="/cars" 
              element={user ? <CarList /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/cars/:id" 
              element={user ? <CarDetail /> : <Navigate to="/login" />} 
            />
             <Route 
              path="/cars/new" 
              element={user ? <CarCreate /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/cars/:id/edit" 
              element={user ? <CarEdit /> : <Navigate to="/login" />} 
            />
            <Route path="/" element={<Navigate to="/cars" />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}