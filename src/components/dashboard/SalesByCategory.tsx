import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from 'recharts'
import { categoryData } from '../../data/mockData'

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null
  const entry = payload[0]
  return (
    <div className="
      bg-white dark:bg-gray-800
      border border-gray-100 dark:border-gray-700
      rounded-xl shadow-xl px-3 py-2
    ">
      <div className="flex items-center gap-2">
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: entry.payload.color }}
          aria-hidden="true"
        />
        <span className="text-xs text-gray-600 dark:text-gray-300">{entry.name}</span>
        <span className="text-xs font-bold text-gray-900 dark:text-white ml-2">{entry.value}%</span>
      </div>
    </div>
  )
}

export default function SalesByCategory() {
  const total = categoryData.reduce((sum, d) => sum + d.value, 0)

  return (
    <section
      className="
        bg-white dark:bg-gray-900
        border border-gray-100 dark:border-gray-800
        rounded-xl p-5 shadow-sm
        flex flex-col
      "
      aria-labelledby="category-chart-title"
    >
      <div className="mb-4">
        <h2 id="category-chart-title" className="text-base font-semibold text-gray-900 dark:text-white">
          Sales by Category
        </h2>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
          Revenue share · 2024
        </p>
      </div>

      {/* Donut chart */}
      <div className="relative" aria-label="Category breakdown donut chart" role="img">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {categoryData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{total}%</span>
          <span className="text-xs text-gray-400 dark:text-gray-500">Total</span>
        </div>
      </div>

      {/* Legend */}
      <ul className="mt-3 space-y-2" aria-label="Category legend">
        {categoryData.map((entry) => (
          <li key={entry.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: entry.color }}
                aria-hidden="true"
              />
              <span className="text-xs text-gray-600 dark:text-gray-300">{entry.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${entry.value}%`, backgroundColor: entry.color }}
                  aria-hidden="true"
                />
              </div>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 tabular-nums w-8 text-right">
                {entry.value}%
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
