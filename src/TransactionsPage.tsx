import {
  AlertTriangle,
  ArrowDown,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Download,
  Filter,
  Inbox,
  Rocket,
  Search,
  UserRound,
} from 'lucide-react'
import { useMemo, useState } from 'react'
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
  const [page, setPage] = useState(1)
  const stats = REGION_STATS[region]

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return transactions.filter(
      (item) => item.region === region && (!normalized || item.user.toLowerCase().includes(normalized)),
    )
  }, [query, region])

  const total = useMemo(() => filtered.reduce((sum, item) => sum + item.amount, 0), [filtered])

  const pageCount = Math.max(1, Math.ceil(filtered.length / TRANSACTIONS_PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * TRANSACTIONS_PAGE_SIZE
  const visible = filtered.slice(start, start + TRANSACTIONS_PAGE_SIZE)

  function goToPage(next: number) {
    setPage(Math.min(pageCount, Math.max(1, next)))
  }

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
                setPage(1)
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
            <Filter size={16} />
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

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
          <p className="text-[13px] text-muted">
            Showing {filtered.length ? start + 1 : 0} to{' '}
            {Math.min(start + TRANSACTIONS_PAGE_SIZE, filtered.length)} of {filtered.length} transactions.
          </p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="grid h-7 w-7 place-items-center rounded-full border border-line disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => goToPage(item)}
                className={`grid h-7 w-7 place-items-center rounded-full text-[13px] font-medium ${
                  item === currentPage ? 'bg-ink text-white' : 'hover:bg-hover-strong'
                }`}
              >
                {item}
              </button>
            ))}
            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === pageCount}
              className="grid h-7 w-7 place-items-center rounded-full border border-line disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-xl bg-chip px-4 py-3">
          <span className="text-[13px] font-semibold text-body">Total</span>
          <span className="text-[15px] font-bold tabular-nums">{currency(total)}</span>
        </div>
      </section>
    </main>
  )
}
