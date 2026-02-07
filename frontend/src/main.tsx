import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import StudentDashboard from './pages/StudentDashboard'
import AdminStudents from './pages/AdminStudents'
import MarkAttendance from './pages/MarkAttendance'
import AdminAnalytics from './pages/AdminAnalytics'
import ProtectedRoute from './routes/ProtectedRoute'
import { AuthProvider } from './contexts/AuthContext'
import './index.css'
import './services/chartConfig'

function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login/>} />
          <Route path='/admin' element={<ProtectedRoute role='admin'><AdminDashboard/></ProtectedRoute>} />
          <Route path='/admin/students' element={<ProtectedRoute role='admin'><AdminStudents/></ProtectedRoute>} />
          <Route path='/admin/mark' element={<ProtectedRoute role='admin'><MarkAttendance/></ProtectedRoute>} />
          <Route path='/admin/analytics' element={<ProtectedRoute role='admin'><AdminAnalytics/></ProtectedRoute>} />
          <Route path='/student' element={<ProtectedRoute role='student'><StudentDashboard/></ProtectedRoute>} />
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
