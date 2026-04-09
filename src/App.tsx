import { useState, useEffect } from 'react'
import { DollarSign, ShoppingCart, Users, BarChart2 } from 'lucide-react'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import KPICard from './components/dashboard/KPICard'
import RevenueChart from './components/dashboard/RevenueChart'
import SalesByCategory from './components/dashboard/SalesByCategory'
import RecentOrders from './components/dashboard/RecentOrders'
import TopProducts from './components/dashboard/TopProducts'
import { kpiMetrics } from './data/mockData'

const KPI_ICONS = [
  { icon: DollarSign, iconColorClass: 'text-blue-600 dark:text-blue-400', iconBgClass: 'bg-blue-50 dark:bg-blue-900/20' },
  { icon: ShoppingCart, iconColorClass: 'text-violet-600 dark:text-violet-400', iconBgClass: 'bg-violet-50 dark:bg-violet-900/20' },
  { icon: Users, iconColorClass: 'text-emerald-600 dark:text-emerald-400', iconBgClass: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { icon: BarChart2, iconColorClass: 'text-amber-600 dark:text-amber-400', iconBgClass: 'bg-amber-50 dark:bg-amber-900/20' },
]

export default function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Sync dark mode with OS preference on first load
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkMode(prefersDark)
  }, [])

  // Apply dark class to <html>
  useEffect(() => {
    const root = document.documentElement
    if (darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0a0f1a]">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header darkMode={darkMode} onToggleDark={() => setDarkMode((d) => !d)} />

        <main
          id="main-content"
          className="flex-1 overflow-y-auto px-6 py-6"
          aria-label="Dashboard content"
        >
          {/* Page header */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white sr-only">
              Sales Dashboard
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Welcome back, Jane. Here's what's happening with your store today.
            </p>
          </div>

          {/* KPI Cards */}
          <section aria-labelledby="kpi-section-title" className="mb-6">
            <h2 id="kpi-section-title" className="sr-only">Key performance indicators</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {kpiMetrics.map((kpi, index) => {
                const { icon, iconColorClass, iconBgClass } = KPI_ICONS[index]
                return (
                  <KPICard
                    key={kpi.label}
                    label={kpi.label}
                    value={kpi.formatted}
                    change={kpi.change}
                    icon={icon}
                    iconColorClass={iconColorClass}
                    iconBgClass={iconBgClass}
                  />
                )
              })}
            </div>
          </section>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            <div className="lg:col-span-2">
              <RevenueChart />
            </div>
            <div>
              <SalesByCategory />
            </div>
          </div>

          {/* Orders + Products row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <RecentOrders />
            </div>
            <div>
              <TopProducts />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
