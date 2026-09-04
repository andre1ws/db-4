import {
  Archive,
  ListFilter,
  Search,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import PromotionModal from './PromotionModal'
import { promotions, type Promotion } from './promotions'

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

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return promotions.filter(
      (item) =>
        !normalized ||
        item.name.toLowerCase().includes(normalized) ||
        item.segment.toLowerCase().includes(normalized) ||
        item.countries.toLowerCase().includes(normalized),
    )
  }, [query])

  return (
    <main className="pl-2 pr-4 py-4">
      <section className="rounded-2xl bg-white p-5 shadow-[0_12px_40px_rgba(17,17,17,0.05)]">
        <div className="mb-3 flex flex-wrap items-center gap-2">
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
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-white"
            aria-label="More filters"
          >
            <ListFilter size={16} />
          </button>
          <button
            type="button"
            className="ml-auto inline-flex h-9 items-center gap-2 rounded-full border border-line-strong bg-white px-3.5 text-[13px] font-semibold"
          >
            <Archive size={15} />
            Archive
          </button>
        </div>

        <div className="overflow-x-auto">
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
              <tr className="bg-chip text-[12.5px] font-semibold text-body">
                <th className="rounded-l-xl px-3 py-2">
                  <div className="flex items-center gap-2">
                    Banner name
                    <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10.5px] text-muted">
                      {promotions.length}
                    </span>
                  </div>
                </th>
                <th className="px-2 py-2">Segment</th>
                <th className="px-2 py-2">Countries</th>
                <th className="px-2 py-2">Button leads to</th>
                <th className="px-2 py-2">End date</th>
                <th className="rounded-r-xl px-3 py-2">Date of last update</th>
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
                  <td className="truncate px-3 py-2 text-[13.5px] font-medium">{item.name}</td>
                  <td className="px-2 py-2">
                    <Pill>{item.segment}</Pill>
                  </td>
                  <td className="px-2 py-2">
                    <Pill>{item.countries}</Pill>
                  </td>
                  <td className="px-2 py-2 text-[13px] text-body">{item.leadsTo}</td>
                  <td className="px-2 py-2 text-[13px] text-muted">{item.endDate || '—'}</td>
                  <td className="px-3 py-2 text-[13px] text-body">{item.updated}</td>
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
