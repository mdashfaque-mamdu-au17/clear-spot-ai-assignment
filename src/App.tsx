import SiteList from './components/SiteList'

function App() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center p-4 py-16 transition-colors duration-500">
      <header className="w-full max-w-5xl mb-16 text-center space-y-4">
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
          ClearSpot<span className="text-primary-600">.ai</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
          AgenticMesh Platform Integration: Real-time monitoring and site management dashboard.
        </p>
      </header>
      
      <main className="w-full flex-1">
        <SiteList />
      </main>

      <footer className="mt-32 py-10 border-t border-slate-200 dark:border-slate-800 w-full max-w-5xl text-center">
        <p className="text-slate-500 dark:text-slate-500 text-sm font-medium">
          &copy; 2026 ClearSpot.ai Engineering Team
        </p>
      </footer>
    </div>
  )
}

export default App
