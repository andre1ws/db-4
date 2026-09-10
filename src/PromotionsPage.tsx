import {
  Archive,
  Search,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import FilterPanel from './FilterPanel'
import PromotionModal from './PromotionModal'
import {
  PROMOTION_FILTER_FIELDS,
  matchesPromotionFilters,
  promotions,
  type Promotion,
  type PromotionFilterField,
} from './promotions'
import type { FilterPreset, FilterRule } from './filters'

const PRESETS_STORAGE_KEY = 'promotions-filter-presets'

function Pill({ children }: { children: string }) {
  return (
    <span className="inline-flex max-w-full truncate rounded-full bg-chip px-2.5 py-1 text-[12px] font-medium text-body">
      {children}
    </span>
  )
}

export default function PromotionsPage({
  modal,
  onModalChange,
}: {
  modal: Promotion | 'new' | null
  onModalChange: (modal: Promotion | 'new' | null) => void
}) {
  const [query, setQuery] = useState('')
  const [filterRules, setFilterRules] = useState<FilterRule<PromotionFilterField>[]>([])
  const [presets, setPresets] = useState<FilterPreset<PromotionFilterField>[]>(() => {
    try {
      const raw = localStorage.getItem(PRESETS_STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(presets))
    } catch {
      return
    }
  }, [presets])

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return promotions.filter(
      (item) =>
        (!normalized ||
          item.name.toLowerCase().includes(normalized) ||
          item.segment.toLowerCase().includes(normalized) ||
          item.countries.toLowerCase().includes(normalized)) &&
        matchesPromotionFilters(item, filterRules),
    )
  }, [query, filterRules])

  function savePreset(name: string, rules: FilterRule<PromotionFilterField>[]) {
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

  return (
    <main className="flex h-full min-h-0 flex-col pl-2 pr-4 py-3">
      <section className="flex min-h-0 flex-1 flex-col rounded-2xl bg-white py-4 shadow-[0_12px_40px_rgba(17,17,17,0.05)]">
        <div className="relative mb-2.5 flex shrink-0 flex-wrap items-center gap-2 px-4">
          <label className="relative w-full min-w-[220px] sm:w-[35%]">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Banner name"
              className="h-9 w-full rounded-full border border-line bg-input pl-10 pr-4 text-[13.5px] outline-none placeholder:text-placeholder focus:border-line-focus"
            />
          </label>
          <FilterPanel
            fields={PROMOTION_FILTER_FIELDS}
            rules={filterRules}
            onApply={setFilterRules}
            presets={presets}
            onSavePreset={savePreset}
            onDeletePreset={deletePreset}
          />
          <button
            type="button"
            className="ml-auto inline-flex h-9 items-center gap-2 rounded-full border border-line-strong bg-white px-3.5 text-[13px] font-medium"
          >
            <Archive size={15} />
            Archive
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-auto">
          <table className="w-full min-w-[980px] table-fixed border-collapse text-left">
            <colgroup>
              <col className="w-[26%]" />
              <col className="w-[14%]" />
              <col className="w-[16%]" />
              <col className="w-[14%]" />
              <col className="w-[12%]" />
              <col className="w-[18%]" />
            </colgroup>
            <thead>
              <tr className="bg-chip text-[12.5px] font-medium text-body">
                <th className="sticky top-0 z-10 bg-chip py-1.5 pl-4 pr-3">
                  <div className="flex items-center gap-2">
                    Banner name
                    <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10.5px] text-muted">
                      {promotions.length}
                    </span>
                  </div>
                </th>
                <th className="sticky top-0 z-10 bg-chip px-2 py-1.5">Segment</th>
                <th className="sticky top-0 z-10 bg-chip px-2 py-1.5">Countries</th>
                <th className="sticky top-0 z-10 bg-chip px-2 py-1.5">Button leads to</th>
                <th className="sticky top-0 z-10 bg-chip px-2 py-1.5">End date</th>
                <th className="sticky top-0 z-10 bg-chip py-1.5 pl-3 pr-4">Date of last update</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className="cursor-pointer border-b border-line last:border-b-0 hover:bg-hover"
                  onClick={() => onModalChange(item)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      onModalChange(item)
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open promotion ${item.name}`}
                >
                  <td className="truncate py-1.5 pl-4 pr-3 text-[13.5px] font-medium">{item.name}</td>
                  <td className="px-2 py-1.5">
                    <Pill>{item.segment}</Pill>
                  </td>
                  <td className="px-2 py-1.5">
                    <Pill>{item.countries}</Pill>
                  </td>
                  <td className="px-2 py-1.5 text-[13px] text-body">{item.leadsTo}</td>
                  <td className="px-2 py-1.5 text-[13px] text-muted">{item.endDate || '—'}</td>
                  <td className="py-1.5 pl-3 pr-4 text-[13px] text-body">{item.updated}</td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-sm text-muted">
                    No promotions match your search.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      {modal ? (
        <PromotionModal
          promotion={modal === 'new' ? null : modal}
          onClose={() => onModalChange(null)}
        />
      ) : null}
    </main>
  )
}
