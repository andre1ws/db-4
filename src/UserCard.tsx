import {
  Check,
  Clock3,
  ExternalLink,
  Laptop,
  MessageSquare,
  Pencil,
  Plus,
  RefreshCcw,
  Smartphone,
  UserRound,
  X,
} from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import type { User } from './users'

const tabs = [
  'Summary',
  'Verification',
  'Channels',
  'Advance',
  'Communication',
  'Transactions',
  'Revenue',
] as const

function KycBadge({ status }: { status: User['kyc'] }) {
  const styles = {
    Approved: 'bg-[#dcfce7] text-[#15803d]',
    Blocked: 'bg-line-strong text-body',
    Pending: 'bg-[#fff4dc] text-[#a16207]',
  }

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase ${styles[status]}`}>
      {status}
    </span>
  )
}

function Field({
  label,
  value,
  icon,
}: {
  label: string
  value?: string | number | null
  icon?: ReactNode
}) {
  const isEmpty = !value
  return (
    <div>
      <div className="text-[12.5px] text-muted">{label}</div>
      <div
        className={`mt-1 flex items-center gap-1.5 text-[13.5px] ${
          isEmpty ? 'text-muted' : 'font-medium text-ink'
        }`}
      >
        {!isEmpty && icon}
        {value || '—'}
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: string }) {
  return (
    <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{children}</h2>
  )
}

export default function UserCard({
  user,
  onClose,
}: {
  user: User | null
  onClose: () => void
}) {
  const [tab, setTab] = useState<(typeof tabs)[number]>('Summary')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (user) setTab('Summary')
  }, [user])

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  function handleClose() {
    setVisible(false)
    window.setTimeout(onClose, 250)
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  if (!user) return null

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity duration-250 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      <div
        className={`relative flex h-full w-full flex-col bg-white shadow-[-24px_0_80px_rgba(17,17,17,0.18)] transition-transform duration-300 ease-out sm:w-[70vw] ${
          visible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
          <div className="flex flex-wrap items-center gap-1 text-[12.5px] font-medium">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-body transition hover:bg-hover"
            >
              <RefreshCcw size={14} />
              To company
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1.5 font-semibold text-brand transition hover:bg-brand hover:text-white"
            >
              <Plus size={14} />
              Add channel
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-body transition hover:bg-hover"
            >
              <Pencil size={14} />
              Edit data
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-body transition hover:bg-hover"
            >
              <Clock3 size={14} />
              History
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-body transition hover:bg-hover"
            >
              <MessageSquare size={14} />
              Chat
            </button>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full hover:bg-hover-strong"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-4">
            <div className="flex items-center gap-3">
              {user.avatar ? (
                <img src={user.avatar} alt="" className="h-12 w-12 rounded-xl object-cover" />
              ) : (
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-tint text-brand">
                  <UserRound size={22} />
                </div>
              )}
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-[19px] font-bold tracking-[-0.03em]">{user.name}</h1>
                  <KycBadge status={user.kyc} />
                </div>
                <div className="mt-0.5 flex items-center gap-1.5 text-[13px] text-body">
                  {user.email}
                  <Check size={14} className="text-brand" />
                </div>
                {user.subtitle || user.role || user.company ? (
                  <div className="mt-0.5 text-[12.5px] text-muted">
                    {user.subtitle || user.role || user.company}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="rounded-xl bg-hover px-4 py-2.5 text-right">
              <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
                {user.accountLabel || 'Internal account'}
              </div>
              <div className="mt-1 text-[15px] font-semibold tabular-nums">
                {user.balanceUsd || '$0.00'} <span className="text-muted">/</span> {user.balanceEur || '€0.00'}
              </div>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="inline-flex items-center gap-0.5 rounded-full bg-chip p-1">
              {tabs.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTab(item)}
                  className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] transition ${
                    tab === item
                      ? 'bg-white font-semibold text-ink shadow-sm'
                      : 'font-normal text-muted hover:text-ink'
                  }`}
                >
                  {item}
                  {item === 'Revenue' ? <ExternalLink size={12} /> : null}
                </button>
              ))}
            </div>
          </div>

          {tab === 'Summary' ? (
            <div className="mt-5 space-y-5">
              <div>
                <SectionLabel>Personal info</SectionLabel>
                <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <Field label="Gender" value={user.gender} />
                  <Field
                    label="Birth date"
                    value={user.birthDate ? `${user.birthDate}${user.age ? `, ${user.age} years old` : ''}` : undefined}
                  />
                  <Field label="Country" value={user.country} />
                  <Field label="Date of ICA signing" value={user.icaDate} />
                  <Field label="Position" value={user.position || user.role} />
                </div>
              </div>

              <div className="border-t border-line pt-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <SectionLabel>Account details and settings</SectionLabel>
                  {user.twoFactor ? (
                    <button
                      type="button"
                      className="rounded-full border border-[#fecaca] px-3 py-1 text-[12px] font-semibold text-[#b91c1c] hover:bg-[#fff5f5]"
                    >
                      Disable 2FA
                    </button>
                  ) : null}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <Field label="Authorization via social networks" />
                  <Field label="Account password" value={user.passwordCreated ? 'Created' : 'Not created'} />
                  <Field
                    label="Two-Factor Authentication"
                    value={user.twoFactor}
                    icon={<Check size={14} className="text-brand" />}
                  />
                  <Field label="Registration date" value={user.registered} />
                  <Field
                    label="Last action"
                    value={user.lastAction}
                    icon={
                      user.device === 'desktop' ? (
                        <Laptop size={14} className="text-muted" />
                      ) : (
                        <Smartphone size={14} className="text-muted" />
                      )
                    }
                  />
                  <Field
                    label="Last action in the app"
                    value={user.lastActionApp || user.lastAction}
                    icon={
                      (user.lastActionAppDevice || 'mobile') === 'desktop' ? (
                        <Laptop size={14} className="text-muted" />
                      ) : (
                        <Smartphone size={14} className="text-muted" />
                      )
                    }
                  />
                </div>
              </div>

              <div className="grid gap-3 border-t border-line pt-5 sm:grid-cols-2">
                <div className="rounded-xl bg-hover px-4 py-3.5">
                  <div className="mb-1.5 flex items-center justify-between">
                    <h3 className="text-[13.5px] font-semibold">Roles</h3>
                    <button
                      type="button"
                      aria-label="Edit roles"
                      className="grid h-6 w-6 place-items-center rounded-full text-muted hover:bg-hover-strong hover:text-ink"
                    >
                      <Pencil size={13} />
                    </button>
                  </div>
                  <div className={`text-[13px] ${user.role ? 'text-body' : 'text-muted'}`}>
                    {user.role || 'No assigned roles'}
                  </div>
                </div>
                <div className="rounded-xl bg-hover px-4 py-3.5">
                  <div className="mb-1.5 flex items-center justify-between">
                    <h3 className="text-[13.5px] font-semibold">Fintech</h3>
                    <button
                      type="button"
                      aria-label="Edit fintech"
                      className="grid h-6 w-6 place-items-center rounded-full text-muted hover:bg-hover-strong hover:text-ink"
                    >
                      <Pencil size={13} />
                    </button>
                  </div>
                  <div className={`text-[13px] ${user.accountLabel ? 'text-body' : 'text-muted'}`}>
                    {user.accountLabel || 'No fintech settings'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center text-sm text-muted">{tab} details will appear here.</div>
          )}
        </div>
      </div>
    </div>
  )
}
