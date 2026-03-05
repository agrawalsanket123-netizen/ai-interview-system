import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AptitudeTest from './pages/AptitudeTest'
import AptitudeResult from './pages/AptitudeResult'
import FieldSelect from './pages/FieldSelect'
import Interview from './pages/Interview'
import InterviewResult from './pages/InterviewResult'
import Dashboard from './pages/Dashboard'
import Navbar from './components/Navbar'

export default function App() {
  return (
    <>
      <div className="grain" />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aptitude" element={<AptitudeTest />} />
        <Route path="/aptitude/result" element={<AptitudeResult />} />
        <Route path="/interview" element={<FieldSelect />} />
        <Route path="/interview/:field" element={<Interview />} />
        <Route path="/interview/result" element={<InterviewResult />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  )
}
