import {
  ArrowLeft,
  Check,
  Clock3,
  ExternalLink,
  Info,
  Laptop,
  MessageSquare,
  Pencil,
  Plus,
  RefreshCcw,
  Smartphone,
  UserRound,
} from 'lucide-react'
import { useState } from 'react'
import { users, type User } from './users'

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

function Field({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div>
      <div className="text-[12px] text-muted">{label}</div>
      <div className="mt-0.5 text-[13.5px] font-medium">{value || '—'}</div>
    </div>
  )
}

export default function UserCard({
  user,
  onBack,
  onSelect,
}: {
  user: User
  onBack: () => void
  onSelect: (next: User) => void
}) {
  const [tab, setTab] = useState<(typeof tabs)[number]>('Summary')

  return (
    <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(17,17,17,0.05)]">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <div className="text-[14px] font-semibold">User</div>
          <span className="rounded-full bg-chip px-2 py-0.5 text-[11px] text-muted">500387</span>
        </div>
        <div className="max-h-[720px] overflow-y-auto p-1.5">
          {users.map((item) => {
            const selected = item.email === user.email
            return (
              <button
                key={item.email}
                type="button"
                onClick={() => onSelect(item)}
                className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left ${
                  selected ? 'bg-brand-soft' : 'hover:bg-hover'
                }`}
              >
                {item.avatar ? (
                  <img src={item.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-brand-tint text-brand">
                    <UserRound size={15} />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-semibold">{item.name}</div>
                  <div className="truncate text-[11px] text-muted">{item.email}</div>
                </div>
                {item.hasAlert ? (
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-[#fff4dc] text-[#c2410c]">
                    <Info size={11} />
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>
      </aside>

      <section className="rounded-2xl bg-white p-4 shadow-[0_12px_40px_rgba(17,17,17,0.05)]">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-[13px] font-medium text-muted hover:text-ink"
          >
            <ArrowLeft size={16} />
            Back to list
          </button>
          <div className="flex flex-wrap items-center gap-1 text-[12.5px] font-semibold">
            <button type="button" className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 hover:bg-hover">
              <RefreshCcw size={14} />
              To company
            </button>
            <button type="button" className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-brand hover:bg-brand-soft">
              <Plus size={14} />
              Add channel
            </button>
            <button type="button" className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 hover:bg-hover">
              <Pencil size={14} />
              Edit data
            </button>
            <button type="button" className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 hover:bg-hover">
              <Clock3 size={14} />
              History
            </button>
            <button type="button" className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 hover:bg-hover">
              <MessageSquare size={14} />
              Chat
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-4">
          <div className="flex items-center gap-3">
            {user.avatar ? (
              <img src={user.avatar} alt="" className="h-14 w-14 rounded-2xl object-cover" />
            ) : (
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-tint text-brand">
                <UserRound size={26} />
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
              <div className="mt-0.5 text-[12.5px] text-muted">{user.subtitle || user.role || user.company || '—'}</div>
            </div>
          </div>
          <div className="rounded-xl bg-hover px-3.5 py-2.5 text-right">
            <div className="text-[12px] text-muted">{user.accountLabel || 'Internal account'}</div>
            <div className="mt-0.5 text-[16px] font-semibold">
              {user.balanceUsd || '$0.00'}/{user.balanceEur || '€0.00'}
            </div>
          </div>
        </div>

        <div className="mt-3 flex gap-1 overflow-x-auto border-b border-line">
          {tabs.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={`inline-flex items-center gap-1 whitespace-nowrap px-2.5 py-2 text-[13px] font-medium ${
                tab === item
                  ? 'border-b-2 border-ink text-ink'
                  : 'text-muted hover:text-ink'
              }`}
            >
              {item}
              {item === 'Revenue' ? <ExternalLink size={12} /> : null}
            </button>
          ))}
        </div>

        {tab === 'Summary' ? (
          <div className="mt-4 space-y-4">
            <div>
              <h2 className="mb-2.5 text-[15px] font-semibold">Personal info</h2>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <Field label="Gender" value={user.gender} />
                <Field
                  label="Birth date"
                  value={user.birthDate ? `${user.birthDate}${user.age ? `, ${user.age} years old` : ''}` : '—'}
                />
                <Field label="Country" value={user.country} />
                <Field label="Date of ICA signing" value={user.icaDate} />
                <Field label="Position" value={user.position || user.role} />
              </div>
            </div>

            <div className="border-t border-line pt-4">
              <div className="mb-2.5 flex items-center justify-between gap-3">
                <h2 className="text-[15px] font-semibold">Account details and settings</h2>
                {user.twoFactor ? (
                  <button
                    type="button"
                    className="rounded-full border border-[#fecaca] px-3 py-1 text-[12px] font-semibold text-[#b91c1c]"
                  >
                    Disable 2FA
                  </button>
                ) : null}
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <Field label="Authorization via social networks" value="—" />
                <Field label="Account password" value={user.passwordCreated ? 'Created' : 'Not created'} />
                <div>
                  <div className="text-[12px] text-muted">Two-Factor Authentication</div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[13.5px] font-medium">
                    {user.twoFactor ? (
                      <>
                        <Check size={15} className="text-brand" />
                        {user.twoFactor}
                      </>
                    ) : (
                      '—'
                    )}
                  </div>
                </div>
                <Field label="Registration date" value={user.registered} />
                <div>
                  <div className="text-[12px] text-muted">Last action</div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[13.5px] font-medium">
                    {user.device === 'desktop' ? <Laptop size={15} className="text-muted" /> : <Smartphone size={15} className="text-muted" />}
                    {user.lastAction}
                  </div>
                </div>
                <div>
                  <div className="text-[12px] text-muted">Last action in the app</div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[13.5px] font-medium">
                    {(user.lastActionAppDevice || 'mobile') === 'desktop' ? (
                      <Laptop size={15} className="text-muted" />
                    ) : (
                      <Smartphone size={15} className="text-muted" />
                    )}
                    {user.lastActionApp || user.lastAction}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 border-t border-line pt-4 sm:grid-cols-2">
              <div className="rounded-xl bg-hover px-3.5 py-3">
                <div className="mb-1.5 flex items-center justify-between">
                  <h3 className="text-[14px] font-semibold">Roles</h3>
                  <button type="button" aria-label="Edit roles">
                    <Pencil size={14} className="text-muted" />
                  </button>
                </div>
                <div className="text-[13px] text-body">{user.role || 'No assigned roles'}</div>
              </div>
              <div className="rounded-xl bg-hover px-3.5 py-3">
                <div className="mb-1.5 flex items-center justify-between">
                  <h3 className="text-[14px] font-semibold">Fintech</h3>
                  <button type="button" aria-label="Edit fintech">
                    <Pencil size={14} className="text-muted" />
                  </button>
                </div>
                <div className="text-[13px] text-body">
                  {user.accountLabel || 'No fintech settings'}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-10 text-center text-sm text-muted">{tab} details will appear here.</div>
        )}
      </section>
    </div>
  )
}
