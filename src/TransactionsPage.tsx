import {
  AlertTriangle,
  ArrowDown,
  ArrowUpDown,
  CircleHelp,
  Download,
  Inbox,
  ListFilter,
  Loader2,
  Rocket,
  Search,
  UserRound,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  REGION_STATS,
  TRANSACTIONS_PAGE_SIZE,
  transactions,
  type MethodTone,
  type Transaction,
  type TransactionRegion,
  type TransactionStatus,
} from './transactions'

const statusStyles: Record<TransactionStatus, string> = {
  New: 'bg-[#fff4dc] text-[#a16207]',
  'In processing': 'bg-brand-soft text-brand',
  'In processing (auto)': 'bg-line-strong text-body',
  Confirmed: 'bg-[#dcfce7] text-[#15803d]',
}

const methodStyles: Record<MethodTone, string> = {
  crypto: 'text-[#1f9a62] font-medium',
  transfer: 'text-[#3b6fd8] font-medium',
  plain: 'text-ink',
}

function StatusBadge({ status }: { status: TransactionStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium uppercase ${statusStyles[status]}`}
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
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const stats = REGION_STATS[region]

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return transactions.filter(
      (item) => item.region === region && (!normalized || item.user.toLowerCase().includes(normalized)),
    )
  }, [query, region])

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
    <main className="pl-2 pr-4 py-4">
      <section className="rounded-2xl bg-white p-5 shadow-[0_12px_40px_rgba(17,17,17,0.05)]">
        <div className="mb-3 flex flex-wrap items-center gap-2">
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
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-white"
            aria-label="More filters"
          >
            <ListFilter size={16} />
          </button>

          <div className="ml-auto flex flex-wrap items-center gap-4">
            <button
              type="button"
              className="flex items-center gap-1.5 text-[13px] font-medium text-muted hover:text-ink"
            >
              <Rocket size={15} />
              Quick Transfer
              <span className="font-semibold text-ink">{stats.quickTransfer}</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 text-[13px] font-medium text-body hover:text-ink"
            >
              <AlertTriangle size={15} />
              Require clarification
              <span className="font-semibold text-ink">{stats.requireClarification}</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 text-[13px] font-semibold text-ink"
            >
              <Inbox size={15} />
              New
              <span>{stats.new}</span>
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

        <div className="overflow-x-auto">
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
              <tr className="bg-chip text-[12.5px] font-semibold text-body">
                <th className="rounded-l-xl px-3 py-2">
                  <div className="flex items-center gap-2">
                    User
                    <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10.5px] text-muted">
                      348793
                    </span>
                  </div>
                </th>
                <th className="px-2 py-2">Status</th>
                <th className="px-2 py-2">
                  <div className="flex items-center gap-1">
                    Expresses
                    <CircleHelp size={13} className="text-muted" />
                  </div>
                </th>
                <th className="px-2 py-2">
                  <div className="flex items-center gap-1">
                    Date of creation
                    <ArrowDown size={13} />
                  </div>
                </th>
                <th className="px-2 py-2">
                  <div className="flex items-center gap-1">
                    Updated at
                    <ArrowUpDown size={13} className="text-muted" />
                  </div>
                </th>
                <th className="px-2 py-2">
                  <div className="flex items-center gap-1">
                    Payment method
                    <CircleHelp size={13} className="text-muted" />
                  </div>
                </th>
                <th className="rounded-r-xl px-3 py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((item) => (
                <tr key={item.id} className="border-b border-line last:border-b-0 hover:bg-hover">
                  <td className="py-2 pl-3 pr-4">
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
                  <td className="py-2 pl-2 pr-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="py-2 pl-2 pr-4 text-[13px] text-body">{item.expresses ? 'Yes' : 'No'}</td>
                  <td className="py-2 pl-2 pr-4 text-[13px] text-body">{item.createdDate}</td>
                  <td className="py-2 pl-2 pr-4 text-[13px] text-body">{item.updatedDate}</td>
                  <td className={`truncate py-2 pl-2 pr-4 text-[13px] ${methodStyles[item.methodTone]}`}>
                    {item.method}
                  </td>
                  <td className="py-2 pl-2 pr-3 text-right text-[13.5px] font-semibold tabular-nums">
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
        </div>

        <div className="mt-3 flex flex-col items-center gap-2 border-t border-line pt-3">
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

        <div className="mt-3 flex items-center justify-between rounded-xl bg-chip px-4 py-3">
          <span className="text-[13px] font-semibold text-body">Total</span>
          <span className="text-[15px] font-bold tabular-nums">{currency(total)}</span>
        </div>
      </section>
    </main>
  )
}
