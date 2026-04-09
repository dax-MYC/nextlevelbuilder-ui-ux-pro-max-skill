import { Bell, Search, Sun, Moon, ChevronDown } from 'lucide-react'

interface HeaderProps {
  darkMode: boolean
  onToggleDark: () => void
}

export default function Header({ darkMode, onToggleDark }: HeaderProps) {
  return (
    <header className="
      h-16 flex items-center justify-between px-6
      bg-white dark:bg-gray-900
      border-b border-gray-100 dark:border-gray-800
      flex-shrink-0 sticky top-0 z-20
    ">
      {/* Left: page title + breadcrumb */}
      <div>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50 leading-tight">
          Dashboard
        </h1>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Jan 2024 — Dec 2024
        </p>
      </div>

      {/* Right: search, actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden sm:block">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search..."
            className="
              pl-9 pr-4 py-2 text-sm rounded-lg w-52
              bg-gray-50 dark:bg-gray-800
              border border-gray-200 dark:border-gray-700
              text-gray-900 dark:text-gray-100
              placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500
              transition-colors duration-150
            "
            aria-label="Search dashboard"
          />
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={onToggleDark}
          className="
            w-9 h-9 flex items-center justify-center rounded-lg
            text-gray-500 dark:text-gray-400
            hover:bg-gray-100 dark:hover:bg-gray-800
            transition-colors duration-150
          "
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-pressed={darkMode}
        >
          {darkMode
            ? <Sun className="w-4 h-4" aria-hidden="true" />
            : <Moon className="w-4 h-4" aria-hidden="true" />
          }
        </button>

        {/* Notifications */}
        <button
          className="
            relative w-9 h-9 flex items-center justify-center rounded-lg
            text-gray-500 dark:text-gray-400
            hover:bg-gray-100 dark:hover:bg-gray-800
            transition-colors duration-150
          "
          aria-label="Notifications (3 unread)"
        >
          <Bell className="w-4 h-4" aria-hidden="true" />
          <span
            className="
              absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full
              ring-2 ring-white dark:ring-gray-900
            "
            aria-hidden="true"
          />
        </button>

        {/* Date range button */}
        <button
          className="
            hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
            bg-blue-600 hover:bg-blue-700 text-white
            transition-colors duration-150
          "
          aria-label="Select date range"
        >
          <span>Last 12 months</span>
          <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}
