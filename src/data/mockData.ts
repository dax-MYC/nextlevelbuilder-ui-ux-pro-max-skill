export interface RevenueDataPoint {
  month: string
  revenue: number
  orders: number
  target: number
}

export interface Order {
  id: string
  customer: string
  avatar: string
  product: string
  category: string
  date: string
  amount: number
  status: 'completed' | 'pending' | 'cancelled' | 'refunded'
}

export interface Product {
  id: string
  name: string
  category: string
  unitsSold: number
  revenue: number
  trend: number
}

export interface CategoryData {
  name: string
  value: number
  color: string
}

export interface KPI {
  label: string
  value: number
  formatted: string
  change: number
  prefix?: string
}

// Monthly revenue data for the past 12 months
export const revenueData: RevenueDataPoint[] = [
  { month: 'Jan', revenue: 42350, orders: 380, target: 40000 },
  { month: 'Feb', revenue: 38920, orders: 342, target: 42000 },
  { month: 'Mar', revenue: 51480, orders: 468, target: 45000 },
  { month: 'Apr', revenue: 47230, orders: 423, target: 48000 },
  { month: 'May', revenue: 55670, orders: 501, target: 50000 },
  { month: 'Jun', revenue: 62140, orders: 558, target: 55000 },
  { month: 'Jul', revenue: 58930, orders: 531, target: 58000 },
  { month: 'Aug', revenue: 65480, orders: 589, target: 60000 },
  { month: 'Sep', revenue: 71250, orders: 641, target: 65000 },
  { month: 'Oct', revenue: 68400, orders: 615, target: 68000 },
  { month: 'Nov', revenue: 79320, orders: 713, target: 72000 },
  { month: 'Dec', revenue: 85230, orders: 767, target: 80000 },
]

export const recentOrders: Order[] = [
  {
    id: '#ORD-7832',
    customer: 'Sophia Chen',
    avatar: 'SC',
    product: 'Pro Wireless Headphones',
    category: 'Electronics',
    date: '2024-12-09',
    amount: 249.99,
    status: 'completed',
  },
  {
    id: '#ORD-7831',
    customer: 'Marcus Johnson',
    avatar: 'MJ',
    product: 'Running Shoes X500',
    category: 'Sports',
    date: '2024-12-09',
    amount: 129.99,
    status: 'pending',
  },
  {
    id: '#ORD-7830',
    customer: 'Aisha Patel',
    avatar: 'AP',
    product: 'Organic Coffee Blend',
    category: 'Food & Bev',
    date: '2024-12-08',
    amount: 34.99,
    status: 'completed',
  },
  {
    id: '#ORD-7829',
    customer: 'David Kim',
    avatar: 'DK',
    product: 'Smart Watch Ultra',
    category: 'Electronics',
    date: '2024-12-08',
    amount: 399.99,
    status: 'completed',
  },
  {
    id: '#ORD-7828',
    customer: 'Elena Rodriguez',
    avatar: 'ER',
    product: 'Linen Bedsheet Set',
    category: 'Home & Living',
    date: '2024-12-07',
    amount: 89.99,
    status: 'cancelled',
  },
  {
    id: '#ORD-7827',
    customer: 'James Wilson',
    avatar: 'JW',
    product: 'Merino Wool Sweater',
    category: 'Clothing',
    date: '2024-12-07',
    amount: 159.99,
    status: 'completed',
  },
  {
    id: '#ORD-7826',
    customer: 'Nina Thompson',
    avatar: 'NT',
    product: 'Yoga Mat Premium',
    category: 'Sports',
    date: '2024-12-06',
    amount: 79.99,
    status: 'refunded',
  },
  {
    id: '#ORD-7825',
    customer: 'Alex Nguyen',
    avatar: 'AN',
    product: '4K Webcam Pro',
    category: 'Electronics',
    date: '2024-12-06',
    amount: 189.99,
    status: 'pending',
  },
]

export const topProducts: Product[] = [
  {
    id: '1',
    name: 'Smart Watch Ultra',
    category: 'Electronics',
    unitsSold: 1247,
    revenue: 498553,
    trend: 18.4,
  },
  {
    id: '2',
    name: 'Pro Wireless Headphones',
    category: 'Electronics',
    unitsSold: 983,
    revenue: 245717,
    trend: 12.1,
  },
  {
    id: '3',
    name: 'Running Shoes X500',
    category: 'Sports',
    unitsSold: 874,
    revenue: 113589,
    trend: 7.8,
  },
  {
    id: '4',
    name: 'Merino Wool Sweater',
    category: 'Clothing',
    unitsSold: 756,
    revenue: 120994,
    trend: -2.3,
  },
  {
    id: '5',
    name: 'Organic Coffee Blend',
    category: 'Food & Bev',
    unitsSold: 2103,
    revenue: 73574,
    trend: 22.7,
  },
  {
    id: '6',
    name: 'Linen Bedsheet Set',
    category: 'Home & Living',
    unitsSold: 634,
    revenue: 57055,
    trend: 5.2,
  },
]

export const categoryData: CategoryData[] = [
  { name: 'Electronics', value: 38, color: '#3b82f6' },
  { name: 'Clothing', value: 24, color: '#8b5cf6' },
  { name: 'Sports', value: 16, color: '#10b981' },
  { name: 'Home & Living', value: 12, color: '#f59e0b' },
  { name: 'Food & Bev', value: 10, color: '#ef4444' },
]

export const kpiMetrics: KPI[] = [
  {
    label: 'Total Revenue',
    value: 726400,
    formatted: '$726,400',
    change: 12.5,
    prefix: '$',
  },
  {
    label: 'Total Orders',
    value: 6531,
    formatted: '6,531',
    change: 8.2,
  },
  {
    label: 'Active Customers',
    value: 2847,
    formatted: '2,847',
    change: 5.1,
  },
  {
    label: 'Avg. Order Value',
    value: 111.23,
    formatted: '$111.23',
    change: 3.8,
    prefix: '$',
  },
]
