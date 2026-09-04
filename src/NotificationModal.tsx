import { CircleHelp, FilePlus, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Notification } from './notifications'

const languages = ['EN', 'RU', 'ES', 'PT', 'TH', 'AR', 'VI'] as const
const contentTypes = ['Notification', 'Push'] as const

const emptyForm = {
  users: '',
  labels: '',
  csp: '',
  excludeCsp: '',
  countries: '',
  language: 'EN' as (typeof languages)[number],
  contentType: 'Notification' as (typeof contentTypes)[number],
  title: '',
  text: '',
  articleFormat: false,
  addButton: false,
  important: false,
}

function FieldLabel({ children }: { children: string }) {
  return <div className="mb-1.5 text-[13px] font-medium">{children}</div>
}

function SelectField({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
  options: string[]
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-9 w-full rounded-xl border border-line bg-white px-3.5 text-[13.5px] outline-none focus:border-line-focus"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}

function CounterField({
  value,
  onChange,
  placeholder,
  rows,
  max,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
  rows: number
  max: number
}) {
  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl border border-line focus-within:border-line-focus">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value.slice(0, max))}
          placeholder={placeholder}
          rows={rows}
          className="w-full resize-none bg-white px-3.5 pb-6 pt-2.5 text-[13.5px] outline-none placeholder:text-placeholder"
        />
        <span className="pointer-events-none absolute bottom-2 right-3 text-[11px] text-muted">
          {value.length}/{max}
        </span>
      </div>
      <p className="mt-1.5 text-[11.5px] text-muted">
        Variables – {'{user_name}'}, {'{credits_amount}'}, {'{funds_amount}'}, {'{balance_amount}'}
      </p>
    </div>
  )
}

function ToggleRow({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string
  checked: boolean
  onChange: (value: boolean) => void
  hint?: boolean
}) {
  return (
    <label className="flex items-center gap-2.5 text-[13px] font-medium">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? 'bg-ink' : 'bg-line-strong'}`}
        aria-pressed={checked}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
            checked ? 'left-[22px]' : 'left-0.5'
          }`}
        />
      </button>
      {label}
      {hint ? <CircleHelp size={13} className="text-muted" /> : null}
    </label>
  )
}

export default function NotificationModal({
  notification,
  onClose,
}: {
  notification: Notification | 'new' | null
  onClose: () => void
}) {
  const [form, setForm] = useState(emptyForm)
  const [visible, setVisible] = useState(false)
  const isEdit = notification !== null && notification !== 'new'

  useEffect(() => {
    if (!notification || notification === 'new') {
      setForm(emptyForm)
      return
    }

    setForm({
      ...emptyForm,
      labels: notification.segment,
      title: notification.title,
      text: notification.preview,
    })
  }, [notification])

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  function patch<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function handleClose() {
    setVisible(false)
    window.setTimeout(onClose, 250)
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity duration-250 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      <div
        className={`relative flex h-full w-full max-w-[760px] flex-col bg-white shadow-[-24px_0_80px_rgba(17,17,17,0.18)] transition-transform duration-300 ease-out ${
          visible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <h2 className="text-[18px] font-semibold tracking-[-0.03em]">
            {isEdit ? 'Edit a notification or article' : 'Create a notification or article'}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="grid h-8 w-8 place-items-center rounded-full hover:bg-hover-strong"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          <section>
            <FieldLabel>Add segment by users</FieldLabel>
            <div className="flex gap-2">
              <input
                value={form.users}
                onChange={(event) => patch('users', event.target.value)}
                placeholder="Usernames or email addresses"
                className="h-9 flex-1 rounded-xl border border-line bg-white px-3.5 text-[13.5px] outline-none placeholder:text-placeholder focus:border-line-focus"
              />
              <button
                type="button"
                className="grid h-9 w-9 place-items-center rounded-xl border border-line"
                aria-label="Upload users file"
              >
                <FilePlus size={16} />
              </button>
            </div>
          </section>

          <section>
            <FieldLabel>Add segment label and CSP</FieldLabel>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <div className="mb-1 text-[12px] text-muted">Label</div>
                <SelectField
                  value={form.labels}
                  onChange={(value) => patch('labels', value)}
                  placeholder="Select labels"
                  options={['Users', 'CSP', 'Partners']}
                />
              </div>
              <div>
                <div className="mb-1 text-[12px] text-muted">CSP</div>
                <SelectField
                  value={form.csp}
                  onChange={(value) => patch('csp', value)}
                  placeholder="Select a CSP"
                  options={['Garna', 'Genesis', 'MediaCube']}
                />
              </div>
              <div>
                <div className="mb-1 text-[12px] text-muted">Exclude CSP</div>
                <SelectField
                  value={form.excludeCsp}
                  onChange={(value) => patch('excludeCsp', value)}
                  placeholder="Select a CSP"
                  options={['Garna', 'Genesis', 'MediaCube']}
                />
              </div>
            </div>
          </section>

          <section>
            <FieldLabel>Narrow segment by country</FieldLabel>
            <div className="flex gap-2">
              <SelectField
                value={form.countries}
                onChange={(value) => patch('countries', value)}
                placeholder="Users from selected countries in the segment will see the content"
                options={['All countries', 'Kazakhstan +2', 'Russia +2', 'Belarus']}
              />
              <button
                type="button"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-line"
                aria-label="Upload countries file"
              >
                <FilePlus size={16} />
              </button>
            </div>
          </section>

          <div className="flex flex-wrap gap-2 border-t border-line pt-4">
            {languages.map((language) => (
              <button
                key={language}
                type="button"
                onClick={() => patch('language', language)}
                className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-medium ${
                  form.language === language ? 'bg-brand text-white' : 'border border-line text-body'
                }`}
              >
                {language}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {contentTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => patch('contentType', type)}
                className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium ${
                  form.contentType === type
                    ? 'bg-brand-soft text-brand'
                    : 'border border-line text-body'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <section>
            <FieldLabel>Notification title</FieldLabel>
            <CounterField
              value={form.title}
              onChange={(value) => patch('title', value)}
              placeholder="Recommended length is up to 70 characters"
              rows={2}
              max={100}
            />
          </section>

          <section>
            <FieldLabel>Notification text</FieldLabel>
            <CounterField
              value={form.text}
              onChange={(value) => patch('text', value)}
              placeholder="Recommended length is up to 200 characters"
              rows={4}
              max={500}
            />
          </section>

          <div className="space-y-3 border-t border-line pt-4">
            <ToggleRow
              label="Article format"
              checked={form.articleFormat}
              onChange={(value) => patch('articleFormat', value)}
            />
            <ToggleRow label="Add a button" checked={form.addButton} onChange={(value) => patch('addButton', value)} />
            <ToggleRow
              label="Mark notification as important"
              checked={form.important}
              onChange={(value) => patch('important', value)}
              hint
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5 border-t border-line bg-hover px-5 py-3">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full bg-brand px-4 py-2 text-[13.5px] font-medium text-white"
          >
            Create
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full bg-line px-4 py-2 text-[13.5px] font-medium text-muted"
          >
            Preview
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full bg-line px-4 py-2 text-[13.5px] font-medium text-muted"
          >
            Save draft
          </button>
        </div>
      </div>
    </div>
  )
}
