import { Archive, ArrowDown, ArrowUpDown, Calendar, Link2, Loader2, Repeat, Search } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import DefaultAvatar from './DefaultAvatar'
import FilterPanel from './FilterPanel'
import type { FilterPreset, FilterRule } from './filters'
import {
  MAIN_PARTNERS_TOTAL,
  PARTNERS_PAGE_SIZE,
  PARTNERS_TOTAL,
  PARTNERS_TOTALS,
  PARTNER_FILTER_FIELDS,
  matchesPartnerFilters,
  partners,
  type Partner,
  type PartnerFilterField,
  type PartnerStatus,
} from './partners'

const PRESETS_STORAGE_KEY = 'partners-filter-presets'

const statusStyles: Record<PartnerStatus, string> = {
  Approved: 'bg-[#5cb85c] text-white',
  Pending: 'bg-[#eaa23c] text-white',
  Blocked: 'bg-[#a8a8ad] text-white/70',
}

function StatusBadge({ status }: { status: PartnerStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide ${statusStyles[status]}`}
    >
      {status}
    </span>
  )
}

function PartnerAvatar({ partner }: { partner: Partner }) {
  if (partner.avatar) {
    return <img src={partner.avatar} alt="" className="h-7 w-7 shrink-0 rounded-full object-cover" />
  }

  return <DefaultAvatar className="h-7 w-7 shrink-0" />
}

function currency(amount: number) {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export default function PartnersPage() {
  const [query, setQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(PARTNERS_PAGE_SIZE)
  const [filterRules, setFilterRules] = useState<FilterRule<PartnerFilterField>[]>([])
  const [presets, setPresets] = useState<FilterPreset<PartnerFilterField>[]>(() => {
    try {
      const raw = localStorage.getItem(PRESETS_STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(presets))
    } catch {
      return
    }
  }, [presets])

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return partners.filter(
      (item) =>
        (!normalized ||
          item.name.toLowerCase().includes(normalized) ||
          item.email.toLowerCase().includes(normalized)) &&
        matchesPartnerFilters(item, filterRules),
    )
  }, [query, filterRules])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  function savePreset(name: string, rules: FilterRule<PartnerFilterField>[]) {
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

  useEffect(() => {
    const node = sentinelRef.current
    if (!node || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((count) => Math.min(count + PARTNERS_PAGE_SIZE, filtered.length))
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
          <label className="relative w-full min-w-[220px] sm:w-[30%]">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setVisibleCount(PARTNERS_PAGE_SIZE)
              }}
              placeholder="Partner name or email"
              className="h-9 w-full rounded-full border border-line bg-input pl-10 pr-4 text-[13.5px] outline-none placeholder:text-placeholder focus:border-line-focus"
            />
          </label>
          <FilterPanel
            fields={PARTNER_FILTER_FIELDS}
            rules={filterRules}
            onApply={(rules) => {
              setFilterRules(rules)
              setVisibleCount(PARTNERS_PAGE_SIZE)
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
              <Calendar size={15} />
              Select period
            </button>
            <div className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line-strong bg-white px-3.5 text-[13px] font-medium text-ink">
              <Repeat size={15} />
              Main partner
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-chip px-1 text-[11px] text-body">
                {MAIN_PARTNERS_TOTAL}
              </span>
            </div>
            <button
              type="button"
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line-strong bg-white px-3.5 text-[13px] font-medium text-ink hover:bg-hover"
            >
              <Archive size={15} />
              Archive
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-auto">
          <table className="w-full min-w-[1180px] table-fixed border-collapse text-left">
            <colgroup>
              <col className="w-[22%]" />
              <col className="w-[11%]" />
              <col className="w-[13%]" />
              <col className="w-[13%]" />
              <col className="w-[13%]" />
              <col className="w-[9%]" />
              <col className="w-[9%]" />
              <col className="w-[10%]" />
            </colgroup>
            <thead>
              <tr className="bg-chip text-[12.5px] font-medium text-body">
                <th className="sticky top-0 z-10 bg-chip py-1.5 pl-4 pr-3">
                  <div className="flex items-center gap-2">
                    Partner
                    <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10.5px] text-muted">
                      {PARTNERS_TOTAL}
                    </span>
                  </div>
                </th>
                <th className="sticky top-0 z-10 bg-chip px-2 py-1.5">Status</th>
                <th className="sticky top-0 z-10 bg-chip px-2 py-1.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <ArrowDown size={13} />
                    Volume, $
                  </div>
                </th>
                <th className="sticky top-0 z-10 bg-chip px-2 py-1.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <ArrowUpDown size={13} className="text-muted" />
                    Share of the network, $
                  </div>
                </th>
                <th className="sticky top-0 z-10 bg-chip px-2 py-1.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <ArrowUpDown size={13} className="text-muted" />
                    Share of the partner, $
                  </div>
                </th>
                <th className="sticky top-0 z-10 bg-chip px-2 py-1.5">Requests</th>
                <th className="sticky top-0 z-10 bg-chip px-2 py-1.5">Connected</th>
                <th className="sticky top-0 z-10 bg-chip py-1.5 pl-3 pr-4">Community members</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((item) => (
                <tr key={item.id} className="border-b border-line last:border-b-0 hover:bg-hover">
                  <td className="py-1 pl-4 pr-3">
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-6 w-6 shrink-0 place-items-center text-muted">
                        {item.isRoot ? <Link2 size={15} /> : <Repeat size={15} />}
                      </span>
                      <PartnerAvatar partner={item} />
                      <div className="min-w-0">
                        <div className="truncate text-[13.5px] font-medium leading-tight">{item.name}</div>
                        <div className="truncate text-[11.5px] leading-tight text-muted">{item.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-1">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-2 py-1 text-right text-[13.5px] font-medium tabular-nums">
                    {currency(item.volume)}
                  </td>
                  <td className="px-2 py-1 text-right text-[13px] tabular-nums text-body">
                    {currency(item.shareOfNetwork)}
                  </td>
                  <td className="px-2 py-1 text-right text-[13px] tabular-nums text-body">
                    {currency(item.shareOfPartner)}
                  </td>
                  <td className="px-2 py-1 text-[13px] tabular-nums text-body">{item.requests}</td>
                  <td className="px-2 py-1 text-[13px] tabular-nums text-body">{item.connected}</td>
                  <td className="py-1 pl-3 pr-4 text-[13px] tabular-nums text-body">
                    {item.communityMembers}
                  </td>
                </tr>
              ))}
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-sm text-muted">
                    No partners match your search.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>

          <div className="flex flex-col items-center gap-2 px-4 py-3">
            <p className="text-[13px] text-muted">
              Showing {visible.length} of {filtered.length} partners.
            </p>
            {hasMore ? (
              <div ref={sentinelRef} className="flex items-center gap-1.5 py-1 text-[12.5px] text-muted">
                <Loader2 size={14} className="animate-spin" />
                Loading more...
              </div>
            ) : null}
          </div>
        </div>

        <div className="mx-4 mt-3 flex shrink-0 items-center justify-between gap-4 rounded-xl bg-chip px-4 py-3 text-[13px]">
          <span className="font-medium text-body">Total</span>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 tabular-nums text-body">
            <span className="font-semibold text-ink">{currency(PARTNERS_TOTALS.volume)}</span>
            <span>{currency(PARTNERS_TOTALS.shareOfNetwork)}</span>
            <span>{currency(PARTNERS_TOTALS.shareOfPartner)}</span>
            <span>{PARTNERS_TOTALS.requests.toLocaleString('en-US')}</span>
            <span>{PARTNERS_TOTALS.connected.toLocaleString('en-US')}</span>
            <span>{PARTNERS_TOTALS.communityMembers.toLocaleString('en-US')}</span>
          </div>
        </div>
      </section>
    </main>
  )
}
