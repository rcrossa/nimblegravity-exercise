import { Routes, Route } from 'react-router-dom'
import EmailLogin from './pages/EmailLogin'
import JobListing from './pages/JobListing'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
      <header className="bg-white shadow p-4 text-center">
        <h1 className="text-2xl font-bold text-slate-800">Nimble Gravity Challenge</h1>
      </header>
      <main className="flex-1 max-w-5xl mx-auto w-full p-6">
        <Routes>
          <Route path="/" element={<EmailLogin />} />
          <Route path="/jobs" element={<JobListing />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
