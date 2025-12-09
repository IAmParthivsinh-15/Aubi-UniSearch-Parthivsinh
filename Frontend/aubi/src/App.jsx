import { useState } from 'react'
import './App.css'
import UniversitySearch from './Components/UniversitySearch'
import Analytics from './Components/Analytics'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 border-r-4 border-blue-600 shadow-xl flex flex-col">
        {/* Logo */}
        <div className="px-8 py-6 border-b border-blue-600">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            🎓 UniSearch
          </h1>
          <p className="text-blue-200 text-xs font-light mt-1">University Analytics</p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-6 py-8 space-y-3">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className={`w-full text-left px-5 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-3 ${
              currentPage === 'dashboard'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-blue-200 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <span className="text-xl">🔍</span>
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentPage('analytics')}
            className={`w-full text-left px-5 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-3 ${
              currentPage === 'analytics'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-blue-200 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <span className="text-xl">📊</span>
            <span>Analytics</span>
          </button>
        </nav>

        {/* Footer */}
        <div className="px-6 py-6 border-t border-blue-600">
          <p className="text-blue-300 text-xs text-center font-light">
            <span className="block mb-2">University Search Platform</span>
            <span className="text-blue-500">v1.0</span>
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {currentPage === 'dashboard' && <UniversitySearch />}
        {currentPage === 'analytics' && <Analytics />}
      </div>
    </div>
  )
}

export default App
