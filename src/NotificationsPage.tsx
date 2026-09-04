import { Archive, ArrowDown, Check, ListFilter, Search, UserRound, Zap } from 'lucide-react'
import { useMemo, useState } from 'react'
import NotificationModal from './NotificationModal'
import { NOTIFICATIONS_TOTAL, notifications, type Notification } from './notifications'

function SegmentPill({ children }: { children: string }) {
  return (
    <span className="inline-flex rounded-full bg-chip px-2.5 py-1 text-[12px] font-medium text-body">
      {children}
    </span>
  )
}

function SenderAvatar({ item }: { item: Notification }) {
  if (item.isSystem) {
    return (
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand text-white">
        <Zap size={16} fill="currentColor" />
      </div>
    )
  }

  if (item.avatar) {
    return <img src={item.avatar} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
  }

  return (
    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-tint text-brand">
      <UserRound size={16} strokeWidth={2.2} />
    </div>
  )
}

export default function NotificationsPage({
  modal,
  onModalChange,
}: {
  modal: Notification | 'new' | null
  onModalChange: (modal: Notification | 'new' | null) => void
}) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return notifications.filter(
      (item) =>
        !normalized ||
        item.sender.toLowerCase().includes(normalized) ||
        item.senderEmail.toLowerCase().includes(normalized),
    )
  }, [query])

  return (
    <main className="pl-2 pr-4 py-4">
      <section className="rounded-2xl bg-white p-5 shadow-[0_12px_40px_rgba(17,17,17,0.05)]">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <label className="relative w-full min-w-[220px] sm:w-[32%]">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Username or email"
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
            className="ml-auto inline-flex h-9 items-center gap-2 rounded-full border border-line-strong bg-white px-3.5 text-[13px] font-medium"
          >
            <Archive size={15} />
            Archive
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] table-fixed border-collapse text-left">
            <colgroup>
              <col className="w-[20%]" />
              <col className="w-[10%]" />
              <col className="w-[8%]" />
              <col className="w-[48%]" />
              <col className="w-[14%]" />
            </colgroup>
            <thead>
              <tr className="bg-chip text-[12.5px] font-medium text-body">
                <th className="rounded-l-xl px-3 py-1.5">
                  <div className="flex items-center gap-2">
                    Sender
                    <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10.5px] text-muted">
                      {NOTIFICATIONS_TOTAL}
                    </span>
                  </div>
                </th>
                <th className="px-2 py-1.5">Segment</th>
                <th className="px-2 py-1.5 text-center">Push</th>
                <th className="px-2 py-1.5">Message</th>
                <th className="rounded-r-xl px-3 py-1.5">
                  <div className="flex items-center gap-1">
                    Sent
                    <ArrowDown size={13} />
                  </div>
                </th>
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
                  aria-label={`Open notification from ${item.sender}`}
                >
                  <td className="py-1.5 pl-3 pr-2">
                    <div className="flex items-center gap-2.5">
                      <SenderAvatar item={item} />
                      <div className="min-w-0">
                        <div className="truncate text-[13px] font-medium">{item.sender}</div>
                        <div className="truncate text-[11.5px] text-muted">{item.senderEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-1.5">
                    <SegmentPill>{item.segment}</SegmentPill>
                  </td>
                  <td className="px-2 py-1.5 text-center">
                    {item.pushSent ? (
                      <span className="inline-grid h-5 w-5 place-items-center rounded-full border border-line-strong text-muted">
                        <Check size={12} />
                      </span>
                    ) : null}
                  </td>
                  <td className="px-2 py-1.5">
                    <div className="truncate text-[13.5px] font-medium">{item.title}</div>
                    <div className="mt-0.5 truncate text-[12px] text-muted">{item.preview}</div>
                  </td>
                  <td className="px-3 py-1.5 text-[13px] text-body">{item.sentDate}</td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-sm text-muted">
                    No notifications match your search.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      {modal ? (
        <NotificationModal
          notification={modal}
          onClose={() => onModalChange(null)}
        />
      ) : null}
    </main>
  )
}
