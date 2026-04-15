export type Domain = 'platform' | 'cpp' | 'os' | '5g' | 'finance' | 'graphs and algorithms' | 'python' | 'advanced dsa' | 'advanced multithreading'
export const DOMAINS: { value: Domain; label: string; icon: string }[] = [
  { value: 'platform', label: 'Platform Engineering', icon: '🏗️' },
  { value: 'cpp', label: 'C++ Development', icon: '⚙️' },
  { value: 'os', label: 'OS Development', icon: '🖥️' },
  { value: '5g', label: '5G & Networking', icon: '📡' },
  { value: 'finance', label: 'Finance & Stocks', icon: '📈' },
  { value: 'graphs and algorithms', label: 'Graphs and Algorithms', icon: '📈' },
  { value: 'python', label: 'Python Development', icon: '📈' },
  { value: 'advanced dsa', label: 'Advanced DSA', icon: '📈' },
  { value: 'advanced multithreading', label: 'Advanced Multithreading', icon: '📈' },

]

export interface Subscriber {
  id: string
  email: string
  verified: boolean
  verify_token: string | null
  verify_expires: string | null
  created_at: string
}

export interface SubscriberDomain {
  id: string
  subscriber_id: string
  domain: Domain
  active: boolean
  subscribed_at: string
  unsubscribed_at: string | null
}

export interface NewsletterLog {
  id: string
  domain: Domain
  send_date: string
  recipient_count: number
  claude_tokens: number | null
  status: 'pending' | 'sent' | 'failed'
  error_message: string | null
  created_at: string
}
