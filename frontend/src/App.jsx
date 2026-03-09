import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import Home from './pages/Home'
import AptitudeTest from './pages/AptitudeTest'
import AptitudeResult from './pages/AptitudeResult'
import FieldSelect from './pages/FieldSelect'
import Interview from './pages/Interview'
import InterviewResult from './pages/InterviewResult'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Navbar from './components/Navbar'

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth()
  if (!isLoggedIn) return <Navigate to="/login" />
  return children
}

export default function App() {
  return (
    <>
      <div className="grain" />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/aptitude" element={<ProtectedRoute><AptitudeTest /></ProtectedRoute>} />
        <Route path="/aptitude/result" element={<ProtectedRoute><AptitudeResult /></ProtectedRoute>} />
        <Route path="/interview" element={<ProtectedRoute><FieldSelect /></ProtectedRoute>} />
        <Route path="/interview/:field" element={<ProtectedRoute><Interview /></ProtectedRoute>} />
        <Route path="/interview/result" element={<ProtectedRoute><InterviewResult /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
    </>
  )
}
