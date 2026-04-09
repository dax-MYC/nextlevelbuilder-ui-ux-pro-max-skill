import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type TooltipProps,
} from 'recharts'
import { revenueData } from '../../data/mockData'

function formatCurrency(value: number): string {
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`
  return `$${value}`
}

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null

  return (
    <div className="
      bg-white dark:bg-gray-800
      border border-gray-100 dark:border-gray-700
      rounded-xl shadow-xl p-3 min-w-[160px]
    ">
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">{label} 2024</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-4 py-0.5">
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: entry.color }}
              aria-hidden="true"
            />
            <span className="text-xs text-gray-600 dark:text-gray-300 capitalize">{entry.name}</span>
          </div>
          <span className="text-xs font-semibold text-gray-900 dark:text-white tabular-nums">
            {entry.name === 'orders' ? entry.value : formatCurrency(entry.value as number)}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function RevenueChart() {
  return (
    <section
      className="
        bg-white dark:bg-gray-900
        border border-gray-100 dark:border-gray-800
        rounded-xl p-5 shadow-sm
      "
      aria-labelledby="revenue-chart-title"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 id="revenue-chart-title" className="text-base font-semibold text-gray-900 dark:text-white">
            Revenue Overview
          </h2>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
            Monthly revenue vs target · Jan–Dec 2024
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-full">
          <span>↑ 12.5%</span>
          <span className="text-gray-400 font-normal">YoY</span>
        </div>
      </div>

      <div aria-label="Revenue chart" role="img">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.08} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="text-gray-100 dark:text-gray-800"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: 'currentColor' }}
              className="text-gray-400"
              axisLine={false}
              tickLine={false}
              dy={8}
            />
            <YAxis
              tickFormatter={formatCurrency}
              tick={{ fontSize: 11, fill: 'currentColor' }}
              className="text-gray-400"
              axisLine={false}
              tickLine={false}
              dx={-4}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
              iconType="circle"
              iconSize={7}
              formatter={(value) => (
                <span className="text-gray-500 dark:text-gray-400 capitalize">{value}</span>
              )}
            />
            <Area
              type="monotone"
              dataKey="target"
              name="target"
              stroke="#10b981"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              fill="url(#targetGradient)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              name="revenue"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#revenueGradient)"
              dot={false}
              activeDot={{ r: 5, strokeWidth: 0, fill: '#3b82f6' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
