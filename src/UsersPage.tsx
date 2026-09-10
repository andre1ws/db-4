import {
  Download,
  Laptop,
  Loader2,
  Search,
  ShieldCheck,
  Smartphone,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import DefaultAvatar from './DefaultAvatar'
import FilterPanel from './FilterPanel'
import UserCard from './UserCard'
import {
  FILTER_FIELDS,
  USERS_PAGE_SIZE,
  matchesFilters,
  users,
  type FilterPreset,
  type FilterRule,
  type KycStatus,
  type User,
} from './users'

const PRESETS_STORAGE_KEY = 'users-filter-presets'

function KycBadge({ status }: { status: KycStatus }) {
  const styles = {
    Approved: 'bg-[#dcfce7] text-[#15803d]',
    Blocked: 'bg-line-strong text-body',
    Pending: 'bg-[#fff4dc] text-[#a16207]',
  }

  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11.5px] font-medium ${styles[status]}`}>
      {status}
    </span>
  )
}

function UserAvatar({ user }: { user: User }) {
  if (user.avatar) {
    return <img src={user.avatar} alt="" className="h-7 w-7 rounded-full object-cover" />
  }

  return <DefaultAvatar className="h-7 w-7 shrink-0" />
}

function UserRow({ user, onOpen }: { user: User; onOpen: (user: User) => void }) {
  const Device = user.device === 'desktop' ? Laptop : Smartphone

  return (
    <tr
      className="cursor-pointer border-b border-line last:border-b-0 hover:bg-hover"
      onClick={() => onOpen(user)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen(user)
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Open profile for ${user.name}`}
    >
      <td className="py-1.5 pl-4 pr-4">
        <div className="flex min-w-[220px] items-center gap-2.5">
          <UserAvatar user={user} />
          <div className="min-w-0">
            <div className="truncate text-[13.5px] font-medium">{user.name}</div>
            <div className="mt-0.5 truncate text-[11.5px] text-muted">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="py-1.5 pl-2 pr-4">
        {user.role ? (
          <span className="inline-flex max-w-full truncate rounded-full bg-chip px-2.5 py-1 text-[12px] font-medium text-body">
            {user.role}
          </span>
        ) : (
          <span className="text-muted">—</span>
        )}
      </td>
      <td className="py-1.5 pl-2 pr-4">
        <KycBadge status={user.kyc} />
      </td>
      <td className="py-1.5 pl-2 pr-4">
        <div className="flex items-center gap-2 text-[12.5px] text-body">
          <Device size={15} className="text-muted" />
          {user.lastAction}
        </div>
      </td>
      <td className="py-1.5 pl-2 pr-4 text-[12.5px] text-body">{user.registered}</td>
    </tr>
  )
}

export default function UsersPage() {
  const [query, setQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(USERS_PAGE_SIZE)
  const [selected, setSelected] = useState<User | null>(null)
  const [filterRules, setFilterRules] = useState<FilterRule[]>([])
  const [presets, setPresets] = useState<FilterPreset[]>(() => {
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
    return users.filter(
      (user) =>
        (!normalized ||
          user.name.toLowerCase().includes(normalized) ||
          user.email.toLowerCase().includes(normalized) ||
          user.role?.toLowerCase().includes(normalized)) &&
        matchesFilters(user, filterRules),
    )
  }, [query, filterRules])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  function applyFilters(rules: FilterRule[]) {
    setFilterRules(rules)
    setVisibleCount(USERS_PAGE_SIZE)
  }

  function savePreset(name: string, rules: FilterRule[]) {
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
          setVisibleCount((count) => Math.min(count + USERS_PAGE_SIZE, filtered.length))
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
          <label className="relative w-full min-w-[220px] sm:w-[32%]">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setVisibleCount(USERS_PAGE_SIZE)
              }}
              placeholder="Username, role or email"
              className="h-9 w-full rounded-full border border-line bg-input pl-10 pr-4 text-[13.5px] outline-none placeholder:text-placeholder focus:border-line-focus"
            />
          </label>
          <FilterPanel
            fields={FILTER_FIELDS}
            rules={filterRules}
            onApply={applyFilters}
            presets={presets}
            onSavePreset={savePreset}
            onDeletePreset={deletePreset}
          />
          <div className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-full border border-line-strong bg-white px-3.5 text-[13px] font-medium text-ink">
            <ShieldCheck size={16} className="text-brand" />
            Checking KYC
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-chip px-1 text-[11px] text-body">9</span>
          </div>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-full border border-line-strong bg-white px-3.5 text-[13px] font-medium"
          >
            <Download size={15} />
            Export
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-auto">
          <table className="w-full min-w-[1060px] table-fixed border-collapse text-left">
            <colgroup>
              <col className="w-[32%]" />
              <col className="w-[18%]" />
              <col className="w-[16%]" />
              <col className="w-[18%]" />
              <col className="w-[16%]" />
            </colgroup>
            <thead>
              <tr className="bg-chip text-[12.5px] font-medium text-body">
                <th className="sticky top-0 z-10 bg-chip py-1.5 pl-4 pr-3">
                  <div className="flex items-center gap-2">
                    User
                    <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10.5px] text-muted">
                      500339
                    </span>
                  </div>
                </th>
                <th className="sticky top-0 z-10 bg-chip px-2 py-1.5">Role</th>
                <th className="sticky top-0 z-10 bg-chip px-2 py-1.5">KYC status</th>
                <th className="sticky top-0 z-10 bg-chip px-2 py-1.5">Last action</th>
                <th className="sticky top-0 z-10 bg-chip py-1.5 pl-3 pr-4">Registration date</th>
              </tr>
            </thead>
            <tbody>
                {visible.map((user) => (
                  <UserRow key={user.email} user={user} onOpen={setSelected} />
                ))}
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-sm text-muted">
                    No users match your search.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>

          <div className="flex flex-col items-center gap-2 px-4 py-3">
            <p className="text-[13px] text-muted">
              Showing {visible.length} of {filtered.length} users.
            </p>
            {hasMore ? (
              <div ref={sentinelRef} className="flex items-center gap-1.5 py-1 text-[12.5px] text-muted">
                <Loader2 size={14} className="animate-spin" />
                Loading more...
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {selected ? <UserCard user={selected} onClose={() => setSelected(null)} /> : null}
    </main>
  )
}
