import {
  BarChart3,
  BookOpen,
  Building2,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  FileText,
  Gift,
  Handshake,
  LayoutDashboard,
  Monitor,
  Percent,
  PlaySquare,
  UsersRound,
  Video,
  Wallet,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'

type NavKey =
  | 'users'
  | 'notifications'
  | 'labels'
  | 'promotions'
  | 'roles'
  | 'departments'
  | 'payments-cy'
  | 'payments-ca'
  | 'payments-cis'
  | 'payments-hk'
  | 'payment-methods'
  | 'regions'
  | 'csp'
  | 'accounts'
  | 'contracts'
  | 'requests'
  | 'analytics'
  | 'funds'
  | 'perks'
  | 'assets'
  | 'channels'
  | 'knowledge'
  | 'agents'

const adminItems: { key: NavKey; label: string; count?: number }[] = [
  { key: 'users', label: 'Users' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'labels', label: 'Labels' },
  { key: 'promotions', label: 'Promotions' },
  { key: 'roles', label: 'Roles' },
]

const paymentItems: { key: NavKey; label: string; count?: number }[] = [
  { key: 'payments-cy', label: 'Transactions CY', count: 37 },
  { key: 'payments-ca', label: 'Transactions CA' },
  { key: 'payments-cis', label: 'Transactions CIS', count: 68 },
  { key: 'payments-hk', label: 'Transactions HK', count: 1 },
  { key: 'payment-methods', label: 'Payment methods' },
  { key: 'regions', label: 'Regions' },
]

function SubNavGroup({
  items,
  active,
  onNavigate,
}: {
  items: { key: NavKey; label: string; count?: number }[]
  active: NavKey
  onNavigate: (key: NavKey) => void
}) {
  return (
    <div className="mb-0.5 ml-3.5 flex flex-col gap-0.5 border-l border-line pl-2.5">
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={() => onNavigate(item.key)}
          className={`flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-left transition ${
            active === item.key
              ? 'bg-brand-soft/60 font-semibold text-brand'
              : 'text-muted hover:bg-hover hover:text-ink'
          }`}
        >
          <span className="flex-1">{item.label}</span>
          {item.count ? (
            <span className="grid h-[18px] min-w-[18px] place-items-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white">
              {item.count}
            </span>
          ) : null}
        </button>
      ))}
    </div>
  )
}

export default function Sidebar({
  active,
  onNavigate,
}: {
  active: NavKey
  onNavigate: (key: NavKey) => void
}) {
  const [adminOpen, setAdminOpen] = useState(true)
  const [paymentsOpen, setPaymentsOpen] = useState(true)
  const isAdmin = adminItems.some((item) => item.key === active)
  const isPayments = paymentItems.some((item) => item.key === active)

  return (
    <aside className="sticky top-0 flex h-svh w-[224px] shrink-0 flex-col py-3 pl-3 pr-1.5">
      <div className="flex h-full flex-col rounded-2xl bg-white p-3 shadow-[0_12px_40px_rgba(17,17,17,0.05)]">
        <div className="mb-4 flex items-center gap-2 px-1.5 pt-1">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-white">
            <LayoutDashboard size={17} />
          </div>
          <div>
            <div className="text-[14px] font-semibold tracking-[-0.02em]">Dashboard</div>
            <div className="text-[11px] font-medium text-muted">Control panel</div>
          </div>
        </div>

        <div className="px-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
          Sections
        </div>

        <nav className="mt-2 flex flex-1 flex-col gap-0.5 overflow-y-auto text-[13.5px]">
          <button
            type="button"
            onClick={() => setAdminOpen((open) => !open)}
            className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition hover:bg-hover ${
              isAdmin ? 'text-ink' : 'text-body'
            }`}
          >
            <span className="grid h-7 w-7 place-items-center text-body">
              <UsersRound size={15} strokeWidth={1.75} />
            </span>
            <span className="flex-1 font-medium">Administrator</span>
            {adminOpen ? (
              <ChevronDown size={15} className="text-muted" />
            ) : (
              <ChevronRight size={15} className="text-muted" />
            )}
          </button>

          {adminOpen ? <SubNavGroup items={adminItems} active={active} onNavigate={onNavigate} /> : null}

          <NavItem
            icon={<FileText size={16} strokeWidth={1.75} />}
            label="Departments"
            active={active === 'departments'}
            onClick={() => onNavigate('departments')}
          />

          <button
            type="button"
            onClick={() => setPaymentsOpen((open) => !open)}
            className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition hover:bg-hover ${
              isPayments ? 'text-ink' : 'text-body'
            }`}
          >
            <span className="grid h-7 w-7 place-items-center text-body">
              <CircleDollarSign size={16} strokeWidth={1.75} />
            </span>
            <span className="flex-1 font-medium">Payments</span>
            {paymentsOpen ? (
              <ChevronDown size={15} className="text-muted" />
            ) : (
              <ChevronRight size={15} className="text-muted" />
            )}
          </button>

          {paymentsOpen ? <SubNavGroup items={paymentItems} active={active} onNavigate={onNavigate} /> : null}

          <NavItem
            icon={<Handshake size={16} strokeWidth={1.75} />}
            label="CSP"
            active={active === 'csp'}
            onClick={() => onNavigate('csp')}
            chevron
          />
          <NavItem
            icon={<Building2 size={16} strokeWidth={1.75} />}
            label="Payment accounts"
            active={active === 'accounts'}
            onClick={() => onNavigate('accounts')}
            chevron
          />
          <NavItem
            icon={<Percent size={16} strokeWidth={1.75} />}
            label="Contracts"
            active={active === 'contracts'}
            onClick={() => onNavigate('contracts')}
          />
          <NavItem
            icon={<PlaySquare size={16} strokeWidth={1.75} />}
            label="Requests"
            active={active === 'requests'}
            onClick={() => onNavigate('requests')}
            badge
            chevron
          />
          <NavItem
            icon={<BarChart3 size={16} strokeWidth={1.75} />}
            label="Analytics"
            active={active === 'analytics'}
            onClick={() => onNavigate('analytics')}
          />
          <NavItem
            icon={<Wallet size={16} strokeWidth={1.75} />}
            label="Funds"
            active={active === 'funds'}
            onClick={() => onNavigate('funds')}
          />
          <NavItem
            icon={<Gift size={16} strokeWidth={1.75} />}
            label="Perks and Benefits"
            active={active === 'perks'}
            onClick={() => onNavigate('perks')}
          />
          <NavItem
            icon={<Monitor size={16} strokeWidth={1.75} />}
            label="Assets"
            active={active === 'assets'}
            onClick={() => onNavigate('assets')}
          />
          <NavItem
            icon={<Video size={16} strokeWidth={1.75} />}
            label="Channels"
            active={active === 'channels'}
            onClick={() => onNavigate('channels')}
          />
          <NavItem
            icon={<BookOpen size={16} strokeWidth={1.75} />}
            label="Knowledge base"
            active={active === 'knowledge'}
            onClick={() => onNavigate('knowledge')}
          />
        </nav>
      </div>
    </aside>
  )
}

function NavItem({
  icon,
  label,
  active,
  onClick,
  badge,
  chevron,
}: {
  icon: ReactNode
  label: string
  active?: boolean
  onClick: () => void
  badge?: boolean
  chevron?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition ${
        active
          ? 'bg-brand-soft/60 font-semibold text-brand'
          : 'text-body hover:bg-hover'
      }`}
    >
      <span className="grid h-7 w-7 place-items-center text-body">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge ? <span className="h-2 w-2 rounded-full bg-private-dot" /> : null}
      {chevron ? <ChevronRight size={15} className="text-muted" /> : null}
    </button>
  )
}

export type { NavKey }
