import SiteList from './components/SiteList'
import AlarmList from './components/AlarmList'

function App() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {/*  Header */}
      <header className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-black italic">CS</div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              ClearSpot<span className="text-primary-600">.ai</span>
            </h1>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              SYSTEMS OPERATIONAL
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Main Dashboard - Site List */}
          <div className="flex-1 w-full order-2 lg:order-1">
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
              <SiteList />
            </div>
          </div>

          {/* Sidebar - Real-time Alarms */}
          <aside className="w-full lg:w-96 order-1 lg:order-2 sticky top-24">
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
              <AlarmList />
            </div>
          </aside>
        </div>
      </main>

      <footer className="mt-20 py-10 border-t border-slate-200 dark:border-slate-800 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-slate-500 dark:text-slate-500 text-sm font-medium">
            &copy; 2026 ClearSpot.ai Engineering Team • AgenticMesh Dashboard v1.2
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
