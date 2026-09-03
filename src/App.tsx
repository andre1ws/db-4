import {
  BarChart3,
  Bell,
  Bot,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Copy,
  Crown,
  Cpu,
  Database,
  FileText,
  Globe,
  Lightbulb,
  Mail,
  MessageSquare,
  MoreHorizontal,
  PenLine,
  Phone,
  Plus,
  Search,
  Settings2,
  Sparkles,
  Star,
  Sun,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { PAGE_SIZE, agents, type Agent, type AgentStatus } from './agents'
import NotificationsPage from './NotificationsPage'
import PromotionsPage from './PromotionsPage'
import type { Notification } from './notifications'
import type { Promotion } from './promotions'
import Sidebar, { type NavKey } from './Sidebar'
import TransactionsPage from './TransactionsPage'
import UsersPage from './UsersPage'

const sectionMeta: Record<NavKey, { parent?: string; label: string }> = {
  agents: { label: 'Manage Agent Team' },
  users: { parent: 'Administrator', label: 'Users' },
  notifications: { parent: 'Administrator', label: 'Notifications' },
  labels: { parent: 'Administrator', label: 'Labels' },
  promotions: { parent: 'Administrator', label: 'Promotions' },
  roles: { parent: 'Administrator', label: 'Roles' },
  departments: { label: 'Departments' },
  payments: { parent: 'Payments', label: 'Transactions' },
  csp: { label: 'CSP' },
  accounts: { label: 'Payment accounts' },
  contracts: { label: 'Contracts' },
  requests: { label: 'Requests' },
  analytics: { label: 'Analytics' },
  funds: { label: 'Funds' },
  perks: { label: 'Perks and Benefits' },
  assets: { label: 'Assets' },
  channels: { label: 'Channels' },
  knowledge: { label: 'Knowledge base' },
}

const iconMap = {
  phone: Phone,
  mail: Mail,
  file: FileText,
  chart: BarChart3,
  pen: PenLine,
  bulb: Lightbulb,
  bot: Bot,
  globe: Globe,
  db: Database,
  spark: Sparkles,
  chat: MessageSquare,
  cpu: Cpu,
}

const iconTone = {
  phone: 'bg-brand-tint text-brand',
  mail: 'bg-[#e8f1ff] text-[#3b6fd8]',
  file: 'bg-brand-tint text-brand',
  chart: 'bg-[#e8fbf3] text-[#1f9a62]',
  pen: 'bg-[#ffe8ef] text-[#c44b6e]',
  bulb: 'bg-[#fff6d8] text-[#c59a12]',
  bot: 'bg-[#eceeff] text-[#4f56c9]',
  globe: 'bg-[#e7f6ff] text-[#2a7cb8]',
  db: 'bg-[#f1efe8] text-[#6b6356]',
  spark: 'bg-[#fdefff] text-[#b14ca8]',
  chat: 'bg-[#e9fff6] text-[#1f8f70]',
  cpu: 'bg-[#eeeef2] text-[#44445a]',
}

function Header({
  breadcrumb,
  onCreate,
}: {
  breadcrumb: { parent?: string; label: string }
  onCreate?: () => void
}) {
  return (
    <header className="sticky top-0 z-20 pl-2 pr-4 pt-3">
      <div className="flex h-14 items-center justify-between rounded-2xl bg-white px-4 shadow-[0_12px_40px_rgba(17,17,17,0.05)]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {breadcrumb.parent ? (
              <>
                <span className="text-[13.5px] font-medium text-muted">{breadcrumb.parent}</span>
                <ChevronRight size={14} className="text-muted" />
              </>
            ) : null}
            <span className="text-[16px] font-bold tracking-[-0.02em]">{breadcrumb.label}</span>
            {onCreate ? (
              <button
                type="button"
                onClick={onCreate}
                className="grid h-7 w-7 place-items-center rounded-full border border-line-strong text-muted hover:bg-hover hover:text-ink"
                aria-label={`Create ${breadcrumb.label}`}
              >
                <Plus size={14} />
              </button>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="grid h-8 w-8 place-items-center rounded-full text-body hover:bg-hover-strong"
            aria-label="Toggle theme"
          >
            <Sun size={16} />
          </button>
          <button
            type="button"
            className="relative grid h-8 w-8 place-items-center rounded-full text-body hover:bg-hover-strong"
            aria-label="Notifications"
          >
            <Bell size={16} />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#ef4444] ring-2 ring-white" />
          </button>
          <button type="button" className="flex items-center gap-1.5 pl-1">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80"
              alt="Profile"
              className="h-8 w-8 rounded-full object-cover"
            />
            <ChevronDown size={14} className="text-muted" />
          </button>
        </div>
      </div>
    </header>
  )
}

function StatusBadge({ status }: { status: AgentStatus }) {
  const isPublic = status === 'Public'
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium ${
        isPublic ? 'bg-public text-[#15803d]' : 'bg-private text-[#6d28d9]'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${isPublic ? 'bg-public-dot' : 'bg-private-dot'}`}
      />
      {status}
    </span>
  )
}

function TypeBadge({ type }: { type: Agent['type'] }) {
  const isWorkflow = type === 'Workflow'
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12.5px] font-medium ${
        isWorkflow ? 'bg-[#eef4ff] text-[#2563eb]' : 'bg-[#f3e8ff] text-[#7c3aed]'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${isWorkflow ? 'bg-workflow' : 'bg-agent'}`}
      />
      {type}
    </span>
  )
}

function AgentIcon({ icon }: { icon: Agent['icon'] }) {
  const Icon = iconMap[icon]
  return (
    <div
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${iconTone[icon]}`}
    >
      <Icon size={18} strokeWidth={2} />
    </div>
  )
}

function AgentRow({ agent }: { agent: Agent }) {
  const [copied, setCopied] = useState(false)
  const shortId = `${agent.id.slice(0, 8)}...`

  async function copyId() {
    try {
      await navigator.clipboard.writeText(agent.id)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1200)
    } catch {
      setCopied(false)
    }
  }

  return (
    <tr className="border-b border-line last:border-b-0">
      <td className="py-2 pl-3 pr-4">
        <div className="flex items-center gap-2.5">
          <AgentIcon icon={agent.icon} />
          <div className="min-w-0">
            <div className="truncate text-[13.5px] font-semibold tracking-[-0.01em]">
              {agent.name}
            </div>
            <div className="mt-0.5 flex items-center gap-1 text-[11.5px] text-muted">
              <span>ID: {shortId}</span>
              <button
                type="button"
                onClick={copyId}
                className="rounded p-0.5 hover:bg-hover-strong"
                aria-label="Copy agent id"
              >
                <Copy size={11} />
              </button>
              {copied ? <span className="text-[#16a34a]">Copied</span> : null}
            </div>
          </div>
        </div>
      </td>
      <td className="py-2 pl-2 pr-4">
        <div className="text-[13px] font-medium">{agent.updatedDate}</div>
        <div className="mt-0.5 flex items-center gap-1 text-[12px] text-muted">
          <Clock3 size={12} />
          {agent.updatedTime}
        </div>
      </td>
      <td className="py-2 pl-2 pr-4">
        <TypeBadge type={agent.type} />
      </td>
      <td className="py-2 pl-2 pr-4 text-[13.5px] font-medium tabular-nums">
        {agent.runs}
      </td>
      <td className="py-2 pl-2 pr-4">
        <div className="flex items-center gap-1 text-[13px] font-medium">
          <Star size={14} className="fill-[#f5c518] text-[#f5c518]" />
          <span>
            {agent.rating.toFixed(2)}{' '}
            <span className="font-normal text-muted">({agent.reviews})</span>
          </span>
        </div>
      </td>
      <td className="py-2 pl-2 pr-4">
        <StatusBadge status={agent.status} />
      </td>
      <td className="py-2 pl-2 pr-3">
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            className="rounded-full border border-line-strong bg-white px-3 py-1 text-[12.5px] font-medium hover:bg-hover"
          >
            Edit
          </button>
          <button
            type="button"
            className="rounded-full border border-line-strong bg-white px-3 py-1 text-[12.5px] font-medium hover:bg-hover"
          >
            Run
          </button>
          <button
            type="button"
            className="grid h-7 w-7 place-items-center rounded-full border border-line-strong hover:bg-hover"
            aria-label="More actions"
          >
            <MoreHorizontal size={15} />
          </button>
        </div>
      </td>
    </tr>
  )
}

function AgentsPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'All' | AgentStatus>('All')
  const [page, setPage] = useState(1)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return agents.filter((agent) => {
      const matchesQuery =
        !q ||
        agent.name.toLowerCase().includes(q) ||
        agent.id.toLowerCase().includes(q)
      const matchesStatus = status === 'All' || agent.status === status
      return matchesQuery && matchesStatus
    })
  }, [query, status])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * PAGE_SIZE
  const visible = filtered.slice(start, start + PAGE_SIZE)
  const from = filtered.length === 0 ? 0 : start + 1
  const to = Math.min(start + PAGE_SIZE, filtered.length)

  function goto(next: number) {
    setPage(Math.min(pageCount, Math.max(1, next)))
  }

  return (
    <main className="pl-2 pr-4 py-4">
        <section className="rounded-2xl bg-white p-5 shadow-[0_12px_40px_rgba(17,17,17,0.05)]">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <label className="relative w-full min-w-[220px] sm:w-[38%]">
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setPage(1)
                }}
                placeholder="Search Builders..."
                className="h-9 w-full rounded-full border border-line bg-input pl-10 pr-16 text-[13.5px] outline-none placeholder:text-placeholder focus:border-line-focus"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-line bg-white px-1.5 py-0.5 text-[11px] font-medium text-muted">
                ⌘ K
              </span>
            </label>
            <label className="relative">
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value as 'All' | AgentStatus)
                  setPage(1)
                }}
                className="h-9 appearance-none rounded-full border border-line bg-white pl-3.5 pr-9 text-[13px] font-medium outline-none"
              >
                <option value="All">All Status</option>
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
              />
            </label>
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-white text-[#3f3f46]"
              aria-label="More filters"
            >
              <Settings2 size={17} />
            </button>
            <button
              type="button"
              className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-ink bg-white px-3.5 py-2 text-[13px] font-semibold"
            >
              <Plus size={16} />
              Create Agent
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] table-fixed border-collapse text-left">
              <colgroup>
                <col className="w-[28%]" />
                <col className="w-[14%]" />
                <col className="w-[12%]" />
                <col className="w-[8%]" />
                <col className="w-[12%]" />
                <col className="w-[11%]" />
                <col className="w-[15%]" />
              </colgroup>
              <thead>
                <tr className="bg-chip text-[12.5px] font-semibold text-body">
                  <th className="rounded-l-xl px-3 py-2">Name :</th>
                  <th className="px-2 py-2">Last Update :</th>
                  <th className="px-2 py-2">Type :</th>
                  <th className="px-2 py-2">Runs :</th>
                  <th className="px-2 py-2">Rating :</th>
                  <th className="px-2 py-2">Status :</th>
                  <th className="rounded-r-xl px-3 py-2 text-right">Actions :</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((agent) => (
                  <AgentRow key={agent.id} agent={agent} />
                ))}
                {visible.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-sm text-muted">
                      No agents match your search.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[13px] text-muted">
              Showing {from} to {to} of {filtered.length} agents.
            </p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => goto(currentPage - 1)}
                className="grid h-7 w-7 place-items-center rounded-full border border-line disabled:opacity-40"
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => goto(item)}
                  className={`grid h-7 w-7 place-items-center rounded-full text-[13px] font-medium ${
                    item === currentPage
                      ? 'bg-ink text-white'
                      : 'text-body hover:bg-hover-strong'
                  }`}
                >
                  {item}
                </button>
              ))}
              <button
                type="button"
                onClick={() => goto(currentPage + 1)}
                className="grid h-7 w-7 place-items-center rounded-full border border-line disabled:opacity-40"
                disabled={currentPage === pageCount}
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>

        <section className="mt-3 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-blush px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#d4a017] shadow-sm">
              <Crown size={20} fill="currentColor" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold tracking-[-0.02em]">
                Unlock More With Pro
              </h2>
              <p className="mt-0.5 text-[13px] text-muted">
                Get full access to all Pro agents, premium features and unlimited runs.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-full bg-ink px-4 py-2 text-[13px] font-semibold text-white"
          >
            Upgrade to Pro →
          </button>
        </section>
    </main>
  )
}

function PlaceholderPage() {
  return (
    <main className="pl-2 pr-4 py-4">
      <section className="rounded-2xl bg-white p-7 shadow-[0_12px_40px_rgba(17,17,17,0.05)]">
        <p className="text-[13px] text-muted">This section is ready for content.</p>
      </section>
    </main>
  )
}

function hashToNav(hash: string): NavKey {
  const value = hash.replace('#', '').split('?')[0]
  if (
    value === 'users' ||
    value === 'notifications' ||
    value === 'labels' ||
    value === 'promotions' ||
    value === 'roles' ||
    value === 'departments' ||
    value === 'payments' ||
    value === 'csp' ||
    value === 'accounts' ||
    value === 'contracts' ||
    value === 'requests' ||
    value === 'analytics' ||
    value === 'funds' ||
    value === 'perks' ||
    value === 'assets' ||
    value === 'channels' ||
    value === 'knowledge' ||
    value === 'agents'
  ) {
    return value
  }
  return 'users'
}

export default function App() {
  const [section, setSection] = useState<NavKey>(() => hashToNav(window.location.hash))
  const [promoModal, setPromoModal] = useState<Promotion | 'new' | null>(null)
  const [notifModal, setNotifModal] = useState<Notification | 'new' | null>(null)

  useEffect(() => {
    function syncSection() {
      setSection(hashToNav(window.location.hash))
    }

    window.addEventListener('hashchange', syncSection)
    return () => window.removeEventListener('hashchange', syncSection)
  }, [])

  function changeSection(next: NavKey) {
    window.location.hash = next
    setSection(next)
  }

  const page =
    section === 'users' ? (
      <UsersPage />
    ) : section === 'promotions' ? (
      <PromotionsPage modal={promoModal} onModalChange={setPromoModal} />
    ) : section === 'agents' ? (
      <AgentsPage />
    ) : section === 'payments' ? (
      <TransactionsPage />
    ) : section === 'notifications' ? (
      <NotificationsPage modal={notifModal} onModalChange={setNotifModal} />
    ) : (
      <PlaceholderPage />
    )

  const breadcrumb = sectionMeta[section]

  return (
    <div className="flex min-h-svh bg-page text-ink">
      <Sidebar active={section} onNavigate={changeSection} />
      <div className="min-w-0 flex-1">
        <Header
          breadcrumb={breadcrumb}
          onCreate={
            section === 'promotions'
              ? () => setPromoModal('new')
              : section === 'notifications'
                ? () => setNotifModal('new')
                : undefined
          }
        />
        <div className="pt-1">{page}</div>
      </div>
    </div>
  )
}
