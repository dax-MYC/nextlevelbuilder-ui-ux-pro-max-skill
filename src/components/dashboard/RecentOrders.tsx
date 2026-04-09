import { ArrowUpRight } from 'lucide-react'
import { recentOrders, type Order } from '../../data/mockData'

const STATUS_STYLES: Record<Order['status'], { label: string; classes: string }> = {
  completed: {
    label: 'Completed',
    classes: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
  },
  pending: {
    label: 'Pending',
    classes: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
  },
  cancelled: {
    label: 'Cancelled',
    classes: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
  },
  refunded: {
    label: 'Refunded',
    classes: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  },
}

const AVATAR_COLORS = [
  'from-blue-400 to-blue-600',
  'from-violet-400 to-violet-600',
  'from-emerald-400 to-emerald-600',
  'from-pink-400 to-pink-600',
  'from-amber-400 to-amber-600',
  'from-cyan-400 to-cyan-600',
  'from-rose-400 to-rose-600',
  'from-indigo-400 to-indigo-600',
]

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function RecentOrders() {
  return (
    <section
      className="
        bg-white dark:bg-gray-900
        border border-gray-100 dark:border-gray-800
        rounded-xl shadow-sm overflow-hidden
      "
      aria-labelledby="orders-title"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h2 id="orders-title" className="text-base font-semibold text-gray-900 dark:text-white">
            Recent Orders
          </h2>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
            Latest {recentOrders.length} transactions
          </p>
        </div>
        <button
          className="
            flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400
            hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-150
          "
          aria-label="View all orders"
        >
          View all
          <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm" aria-label="Recent orders table">
          <thead>
            <tr className="border-b border-gray-50 dark:border-gray-800/60">
              <th className="text-left text-xs font-semibold text-gray-400 dark:text-gray-500 px-5 py-3 uppercase tracking-wider">
                Customer
              </th>
              <th className="text-left text-xs font-semibold text-gray-400 dark:text-gray-500 px-3 py-3 uppercase tracking-wider hidden md:table-cell">
                Product
              </th>
              <th className="text-left text-xs font-semibold text-gray-400 dark:text-gray-500 px-3 py-3 uppercase tracking-wider hidden sm:table-cell">
                Date
              </th>
              <th className="text-right text-xs font-semibold text-gray-400 dark:text-gray-500 px-3 py-3 uppercase tracking-wider">
                Amount
              </th>
              <th className="text-left text-xs font-semibold text-gray-400 dark:text-gray-500 px-3 py-3 pr-5 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800/60">
            {recentOrders.map((order, index) => {
              const status = STATUS_STYLES[order.status]
              const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length]
              return (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors duration-100"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center flex-shrink-0`}
                        aria-hidden="true"
                      >
                        <span className="text-white text-xs font-semibold">{order.avatar}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate text-sm">
                          {order.customer}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{order.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 hidden md:table-cell">
                    <p className="text-gray-700 dark:text-gray-300 truncate max-w-[180px] text-sm">
                      {order.product}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{order.category}</p>
                  </td>
                  <td className="px-3 py-3.5 hidden sm:table-cell">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      {formatDate(order.date)}
                    </span>
                  </td>
                  <td className="px-3 py-3.5 text-right">
                    <span className="font-semibold text-gray-900 dark:text-white tabular-nums text-sm">
                      ${order.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-3 py-3.5 pr-5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${status.classes}`}
                    >
                      {status.label}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
