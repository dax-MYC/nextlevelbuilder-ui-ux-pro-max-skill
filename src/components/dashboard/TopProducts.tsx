import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react'
import { topProducts } from '../../data/mockData'

const CATEGORY_COLORS: Record<string, string> = {
  Electronics: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  Sports: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
  Clothing: 'bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400',
  'Home & Living': 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
  'Food & Bev': 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
}

function formatRevenue(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
  return `$${value}`
}

export default function TopProducts() {
  const maxRevenue = Math.max(...topProducts.map((p) => p.revenue))

  return (
    <section
      className="
        bg-white dark:bg-gray-900
        border border-gray-100 dark:border-gray-800
        rounded-xl p-5 shadow-sm
      "
      aria-labelledby="top-products-title"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 id="top-products-title" className="text-base font-semibold text-gray-900 dark:text-white">
            Top Products
          </h2>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
            By revenue · 2024
          </p>
        </div>
        <button
          className="
            flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400
            hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-150
          "
          aria-label="View all products"
        >
          View all
          <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>

      <ol className="space-y-4" aria-label="Top products by revenue">
        {topProducts.map((product, index) => {
          const isPositive = product.trend >= 0
          const TrendIcon = isPositive ? TrendingUp : TrendingDown
          const barWidth = (product.revenue / maxRevenue) * 100
          const categoryColor = CATEGORY_COLORS[product.category] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'

          return (
            <li key={product.id} className="flex flex-col gap-1.5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  {/* Rank */}
                  <span
                    className="
                      w-5 h-5 flex items-center justify-center rounded-full
                      text-xs font-bold flex-shrink-0 mt-0.5
                      text-gray-400 dark:text-gray-500
                    "
                    aria-label={`Rank ${index + 1}`}
                  >
                    {index + 1}
                  </span>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${categoryColor}`}>
                        {product.category}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {product.unitsSold.toLocaleString()} sold
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end flex-shrink-0">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white tabular-nums">
                    {formatRevenue(product.revenue)}
                  </span>
                  <div
                    className={`flex items-center gap-0.5 text-xs font-medium ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}
                  >
                    <TrendIcon className="w-3 h-3" aria-hidden="true" />
                    <span>{isPositive ? '+' : ''}{product.trend}%</span>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="ml-8">
                <div
                  className="h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"
                  role="progressbar"
                  aria-valuenow={Math.round(barWidth)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${product.name} revenue: ${Math.round(barWidth)}% of top product`}
                >
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
