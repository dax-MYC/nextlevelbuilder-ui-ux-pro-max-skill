import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react'

interface KPICardProps {
  label: string
  value: string
  change: number
  icon: LucideIcon
  iconColorClass: string
  iconBgClass: string
}

export default function KPICard({
  label,
  value,
  change,
  icon: Icon,
  iconColorClass,
  iconBgClass,
}: KPICardProps) {
  const isPositive = change >= 0
  const TrendIcon = isPositive ? TrendingUp : TrendingDown

  return (
    <article className="
      bg-white dark:bg-gray-900
      border border-gray-100 dark:border-gray-800
      rounded-xl p-5 shadow-sm
      hover:shadow-md transition-shadow duration-200
      animate-fade-in
    ">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
            {label}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1 tabular-nums">
            {value}
          </p>
        </div>

        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ml-4 ${iconBgClass}`}
          aria-hidden="true"
        >
          <Icon className={`w-5 h-5 ${iconColorClass}`} />
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-4">
        <TrendIcon
          className={`w-3.5 h-3.5 flex-shrink-0 ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}
          aria-hidden="true"
        />
        <span
          className={`text-sm font-semibold tabular-nums ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}
        >
          {isPositive ? '+' : ''}{change}%
        </span>
        <span className="text-sm text-gray-400 dark:text-gray-500">
          vs last period
        </span>
      </div>
    </article>
  )
}
