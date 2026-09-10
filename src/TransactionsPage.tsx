import {
  AlertTriangle,
  ArrowDown,
  ArrowUpDown,
  CircleHelp,
  Download,
  Inbox,
  Loader2,
  Rocket,
  Search,
  UserRound,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import FilterPanel from './FilterPanel'
import type { FilterPreset, FilterRule } from './filters'
import {
  REGION_STATS,
  TRANSACTIONS_PAGE_SIZE,
  TRANSACTION_FILTER_FIELDS,
  matchesTransactionFilters,
  transactions,
  type MethodTone,
  type Transaction,
  type TransactionFilterField,
  type TransactionRegion,
  type TransactionStatus,
} from './transactions'

const PRESETS_STORAGE_KEY_PREFIX = 'transactions-filter-presets-'

const statusStyles: Record<TransactionStatus, string> = {
  New: 'bg-[#f2a33e] text-white',
  'In processing': 'bg-brand text-white',
  'In processing (auto)': 'bg-[#a3a3ab] text-white',
  Confirmed: 'bg-[#5cb85c] text-white',
}

const methodStyles: Record<MethodTone, string> = {
  crypto: 'text-[#1f9a62] font-medium',
  transfer: 'text-[#3b6fd8] font-medium',
  plain: 'text-ink',
}

function StatusBadge({ status }: { status: TransactionStatus }) {
  return (
    <span
      className={`inline-flex rounded-lg px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide ${statusStyles[status]}`}
    >
      {status}
    </span>
  )
}

function TransactionAvatar({ transaction }: { transaction: Transaction }) {
  if (transaction.avatar) {
    return <img src={transaction.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
  }

  return (
    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-tint text-brand">
      <UserRound size={16} strokeWidth={2.2} />
    </div>
  )
}

function currency(amount: number) {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export default function TransactionsPage({ region }: { region: TransactionRegion }) {
  const [query, setQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(TRANSACTIONS_PAGE_SIZE)
  const [filterRules, setFilterRules] = useState<FilterRule<TransactionFilterField>[]>([])
  const [presets, setPresets] = useState<FilterPreset<TransactionFilterField>[]>(() => {
    try {
      const raw = localStorage.getItem(PRESETS_STORAGE_KEY_PREFIX + region)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const stats = REGION_STATS[region]

  useEffect(() => {
    try {
      localStorage.setItem(PRESETS_STORAGE_KEY_PREFIX + region, JSON.stringify(presets))
    } catch {
      return
    }
  }, [presets, region])

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return transactions.filter(
      (item) =>
        item.region === region &&
        (!normalized || item.user.toLowerCase().includes(normalized)) &&
        matchesTransactionFilters(item, filterRules),
    )
  }, [query, region, filterRules])

  function savePreset(name: string, rules: FilterRule<TransactionFilterField>[]) {
    setPresets((prev) => {
      const existing = prev.find((preset) => preset.name === name)
      if (existing) {
        return prev.map((preset) => (preset.name === name ? { ...preset, rules } : preset))
      }
      return [...prev, { id: crypto.randomUUID(), name, rules }]
    })
  }

  function deletePreset(id: string) {
    setPresets((prev) => prev.filter((preset) => preset.id !== id))
  }

  const total = useMemo(() => filtered.reduce((sum, item) => sum + item.amount, 0), [filtered])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  useEffect(() => {
    const node = sentinelRef.current
    if (!node || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((count) => Math.min(count + TRANSACTIONS_PAGE_SIZE, filtered.length))
        }
      },
      { rootMargin: '200px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [hasMore, filtered.length])

  return (
    <main className="flex h-full min-h-0 flex-col pl-2 pr-4 py-3">
      <section className="flex min-h-0 flex-1 flex-col rounded-2xl bg-white py-4 shadow-[0_12px_40px_rgba(17,17,17,0.05)]">
        <div className="relative mb-2.5 flex shrink-0 flex-wrap items-center gap-2 px-4">
          <label className="relative w-full min-w-[240px] sm:w-[36%]">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setVisibleCount(TRANSACTIONS_PAGE_SIZE)
              }}
              placeholder="Username / Email / Account Number"
              className="h-9 w-full rounded-full border border-line bg-input pl-10 pr-4 text-[13.5px] outline-none placeholder:text-placeholder focus:border-line-focus"
            />
          </label>
          <FilterPanel
            fields={TRANSACTION_FILTER_FIELDS}
            rules={filterRules}
            onApply={(rules) => {
              setFilterRules(rules)
              setVisibleCount(TRANSACTIONS_PAGE_SIZE)
            }}
            presets={presets}
            onSavePreset={savePreset}
            onDeletePreset={deletePreset}
          />

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line-strong bg-white px-3.5 text-[13px] font-medium text-ink hover:bg-hover"
            >
              <Rocket size={15} />
              Quick Transfer
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-chip px-1 text-[11px] text-body">
                {stats.quickTransfer}
              </span>
            </button>
            <button
              type="button"
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line-strong bg-white px-3.5 text-[13px] font-medium text-ink hover:bg-hover"
            >
              <AlertTriangle size={15} />
              Require clarification
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-chip px-1 text-[11px] text-body">
                {stats.requireClarification}
              </span>
            </button>
            <button
              type="button"
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line-strong bg-white px-3.5 text-[13px] font-medium text-ink hover:bg-hover"
            >
              <Inbox size={15} />
              New
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-chip px-1 text-[11px] text-body">
                {stats.new}
              </span>
            </button>
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-white"
              aria-label="Export transactions"
            >
              <Download size={16} />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-auto">
          <table className="w-full min-w-[1080px] table-fixed border-collapse text-left">
            <colgroup>
              <col className="w-[22%]" />
              <col className="w-[16%]" />
              <col className="w-[9%]" />
              <col className="w-[12%]" />
              <col className="w-[12%]" />
              <col className="w-[20%]" />
              <col className="w-[9%]" />
            </colgroup>
            <thead>
              <tr className="bg-chip text-[12.5px] font-medium text-body">
                <th className="sticky top-0 z-10 bg-chip py-1.5 pl-4 pr-3">
                  <div className="flex items-center gap-2">
                    User
                    <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10.5px] text-muted">
                      348793
                    </span>
                  </div>
                </th>
                <th className="sticky top-0 z-10 bg-chip px-2 py-1.5">Status</th>
                <th className="sticky top-0 z-10 bg-chip px-2 py-1.5">
                  <div className="flex items-center gap-1">
                    Expresses
                    <CircleHelp size={13} className="text-muted" />
                  </div>
                </th>
                <th className="sticky top-0 z-10 bg-chip px-2 py-1.5">
                  <div className="flex items-center gap-1">
                    Date of creation
                    <ArrowDown size={13} />
                  </div>
                </th>
                <th className="sticky top-0 z-10 bg-chip px-2 py-1.5">
                  <div className="flex items-center gap-1">
                    Updated at
                    <ArrowUpDown size={13} className="text-muted" />
                  </div>
                </th>
                <th className="sticky top-0 z-10 bg-chip px-2 py-1.5">
                  <div className="flex items-center gap-1">
                    Payment method
                    <CircleHelp size={13} className="text-muted" />
                  </div>
                </th>
                <th className="sticky top-0 z-10 bg-chip py-1.5 pl-3 pr-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((item) => (
                <tr key={item.id} className="border-b border-line last:border-b-0 hover:bg-hover">
                  <td className="py-1.5 pl-4 pr-4">
                    <div className="flex items-center gap-2.5">
                      <TransactionAvatar transaction={item} />
                      <div className="flex min-w-0 items-center gap-1.5">
                        <span className="truncate text-[13.5px] font-medium">{item.user}</span>
                        {item.quickTransfer ? (
                          <Rocket size={13} className="shrink-0 text-brand" />
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="py-1.5 pl-2 pr-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="py-1.5 pl-2 pr-4 text-[13px] text-body">{item.expresses ? 'Yes' : 'No'}</td>
                  <td className="py-1.5 pl-2 pr-4 text-[13px] text-body">{item.createdDate}</td>
                  <td className="py-1.5 pl-2 pr-4 text-[13px] text-body">{item.updatedDate}</td>
                  <td className={`truncate py-1.5 pl-2 pr-4 text-[13px] ${methodStyles[item.methodTone]}`}>
                    {item.method}
                  </td>
                  <td className="py-1.5 pl-2 pr-4 text-right text-[13.5px] font-medium tabular-nums">
                    {currency(item.amount)}
                  </td>
                </tr>
              ))}
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-sm text-muted">
                    No transactions match your search.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>

          <div className="flex flex-col items-center gap-2 px-4 py-3">
            <p className="text-[13px] text-muted">
              Showing {visible.length} of {filtered.length} transactions.
            </p>
            {hasMore ? (
              <div ref={sentinelRef} className="flex items-center gap-1.5 py-1 text-[12.5px] text-muted">
                <Loader2 size={14} className="animate-spin" />
                Loading more...
              </div>
            ) : null}
          </div>
        </div>

        <div className="mx-4 mt-3 flex shrink-0 items-center justify-between rounded-xl bg-chip px-4 py-3">
          <span className="text-[13px] font-medium text-body">Total</span>
          <span className="text-[15px] font-semibold tabular-nums">{currency(total)}</span>
        </div>
      </section>
    </main>
  )
}
