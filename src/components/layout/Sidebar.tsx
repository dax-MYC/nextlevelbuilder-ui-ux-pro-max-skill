import {
  LayoutDashboard,
  TrendingUp,
  ShoppingCart,
  Package,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react'

interface NavItem {
  icon: React.ElementType
  label: string
  active?: boolean
  badge?: number
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: TrendingUp, label: 'Analytics' },
  { icon: ShoppingCart, label: 'Orders', badge: 12 },
  { icon: Package, label: 'Products' },
  { icon: Users, label: 'Customers' },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={`
        relative flex flex-col bg-gray-900 h-screen transition-all duration-300 ease-in-out flex-shrink-0
        ${collapsed ? 'w-16' : 'w-60'}
      `}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 h-16 border-b border-gray-800 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-white font-semibold text-sm leading-tight">SalesPulse</p>
            <p className="text-gray-500 text-xs">Pro Dashboard</p>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto" role="navigation">
        {!collapsed && (
          <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider px-3 pb-2">
            Menu
          </p>
        )}
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.label}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-colors duration-150 relative group
                ${collapsed ? 'justify-center' : ''}
                ${item.active
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
                }
              `}
              aria-current={item.active ? 'page' : undefined}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-4.5 h-4.5 flex-shrink-0 w-[18px] h-[18px]" aria-hidden="true" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge != null && (
                    <span
                      className={`
                        text-xs font-semibold px-1.5 py-0.5 rounded-full
                        ${item.active ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}
                      `}
                      aria-label={`${item.badge} notifications`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {/* Tooltip for collapsed state */}
              {collapsed && (
                <span
                  className="
                    absolute left-full ml-2 px-2 py-1 bg-gray-800 text-gray-100 text-xs
                    rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100
                    pointer-events-none transition-opacity duration-150 z-50
                  "
                  role="tooltip"
                >
                  {item.label}
                  {item.badge != null && ` (${item.badge})`}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-2 py-4 border-t border-gray-800 space-y-0.5">
        <button
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
            text-gray-400 hover:bg-gray-800 hover:text-gray-100 transition-colors duration-150
            ${collapsed ? 'justify-center' : ''}
          `}
          title={collapsed ? 'Settings' : undefined}
        >
          <Settings className="w-[18px] h-[18px] flex-shrink-0" aria-hidden="true" />
          {!collapsed && <span>Settings</span>}
        </button>

        {/* User profile */}
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2.5 mt-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-semibold">JD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-200 text-xs font-medium truncate">Jane Doe</p>
              <p className="text-gray-500 text-xs truncate">Admin</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
              <span className="text-white text-xs font-semibold">JD</span>
            </div>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="
          absolute -right-3 top-20 w-6 h-6 bg-gray-700 hover:bg-gray-600
          border border-gray-600 rounded-full flex items-center justify-center
          text-gray-300 transition-colors duration-150 z-10
        "
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        aria-expanded={!collapsed}
      >
        {collapsed
          ? <ChevronRight className="w-3 h-3" aria-hidden="true" />
          : <ChevronLeft className="w-3 h-3" aria-hidden="true" />
        }
      </button>
    </aside>
  )
}
