import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Calendar,
  CircleHelp,
  FilePlus,
  ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Underline,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Promotion } from './promotions'

const languages = ['EN', 'RU', 'ES', 'PT', 'TH', 'AR', 'VI'] as const

const emptyForm = {
  users: '',
  labels: '',
  csp: '',
  excludeCsp: '',
  countries: '',
  serial: '1',
  platforms: '',
  leadsTo: 'Balance',
  endDate: '',
  reminder: false,
  language: 'EN' as (typeof languages)[number],
  title: '',
  text: '',
  buttonText: '',
}

function FieldLabel({
  children,
  hint,
}: {
  children: string
  hint?: boolean
}) {
  return (
    <div className="mb-1.5 flex items-center gap-1.5 text-[13px] font-semibold">
      {children}
      {hint ? <CircleHelp size={13} className="text-muted" /> : null}
    </div>
  )
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

function UploadBox({
  title,
  size,
}: {
  title: string
  size: string
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[#d8c8f8] bg-[#fcfaff] px-4 py-4 text-center">
      <div className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-xl bg-white text-brand shadow-sm">
        <ImageIcon size={19} />
      </div>
      <div className="text-[13.5px] font-semibold">{title}</div>
      <p className="mx-auto mt-1 max-w-[420px] text-[12px] leading-5 text-muted">
        Photos up to 10 MB, .jpeg, .jpg, .png formats. Max number of photos is 1. Required image size: {size}
      </p>
      <button
        type="button"
        className="mt-2.5 inline-flex h-9 items-center rounded-full border border-brand bg-white px-3.5 text-[13px] font-semibold text-brand"
      >
        Add Files
      </button>
    </div>
  )
}

export default function PromotionModal({
  promotion,
  onClose,
}: {
  promotion: Promotion | null
  onClose: () => void
}) {
  const [form, setForm] = useState(emptyForm)
  const [visible, setVisible] = useState(false)
  const isEdit = Boolean(promotion)

  useEffect(() => {
    if (!promotion) {
      setForm(emptyForm)
      return
    }

    setForm({
      ...emptyForm,
      countries: promotion.countries,
      serial: String(promotion.serial),
      leadsTo: promotion.leadsTo[0].toUpperCase() + promotion.leadsTo.slice(1),
      endDate: promotion.endDate || '',
      title: promotion.title,
      text: promotion.text,
      buttonText: promotion.buttonText,
    })
  }, [promotion])

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
          <h2 className="text-[18px] font-bold tracking-[-0.03em]">
            {isEdit ? 'Edit a promotion' : 'Create a promotion'}
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
                placeholder="Users from selected countries in the segment will see the promotion"
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

          <section className="grid gap-3 sm:grid-cols-2">
            <div>
              <FieldLabel>Serial number of the promotion</FieldLabel>
              <input
                value={form.serial}
                onChange={(event) => patch('serial', event.target.value)}
                className="h-9 w-full rounded-xl border border-line bg-white px-3.5 text-[13.5px] outline-none focus:border-line-focus"
              />
            </div>
            <div>
              <FieldLabel>Platforms</FieldLabel>
              <SelectField
                value={form.platforms}
                onChange={(value) => patch('platforms', value)}
                placeholder="Where the promotion is shown"
                options={['Web', 'App', 'Web and app']}
              />
            </div>
            <div>
              <FieldLabel>Button leads to</FieldLabel>
              <SelectField
                value={form.leadsTo}
                onChange={(value) => patch('leadsTo', value)}
                placeholder="Select destination"
                options={['Balance', 'Dashboard', 'Contract', 'FAQ']}
              />
            </div>
            <div>
              <FieldLabel>End date (optional)</FieldLabel>
              <label className="relative block">
                <Calendar
                  size={15}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                />
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(event) => patch('endDate', event.target.value)}
                  className="h-9 w-full rounded-xl border border-line bg-white pl-10 pr-3.5 text-[13.5px] outline-none focus:border-line-focus"
                />
              </label>
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-3 border-y border-line py-3">
            <p className="text-[12.5px] text-muted">
              File with examples of segments and transitions (select the desired sheet).
            </p>
            <label className="inline-flex items-center gap-2 text-[13px] font-medium">
              <button
                type="button"
                onClick={() => patch('reminder', !form.reminder)}
                className={`relative h-6 w-11 rounded-full ${form.reminder ? 'bg-ink' : 'bg-line-strong'}`}
                aria-pressed={form.reminder}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                    form.reminder ? 'left-[22px]' : 'left-0.5'
                  }`}
                />
              </button>
              Add a reminder
              <CircleHelp size={13} className="text-muted" />
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            {languages.map((language) => (
              <button
                key={language}
                type="button"
                onClick={() => patch('language', language)}
                className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold ${
                  form.language === language
                    ? 'bg-brand text-white'
                    : 'border border-line text-body'
                }`}
              >
                {language}
              </button>
            ))}
          </div>

          <section>
            <FieldLabel hint>Promotion title</FieldLabel>
            <input
              value={form.title}
              onChange={(event) => patch('title', event.target.value)}
              placeholder="Recommended length is up to 95 characters"
              className="h-9 w-full rounded-xl border border-line bg-white px-3.5 text-[13.5px] outline-none placeholder:text-placeholder focus:border-line-focus"
            />
          </section>

          <section>
            <div className="overflow-hidden rounded-2xl border border-line focus-within:border-line-focus">
              <textarea
                value={form.text}
                onChange={(event) => patch('text', event.target.value)}
                placeholder="Promotion text in the modal window"
                rows={4}
                className="w-full resize-none bg-white px-3.5 py-2.5 text-[13.5px] outline-none placeholder:text-placeholder"
              />
              <div className="flex flex-wrap items-center gap-2 border-t border-line bg-hover px-3 py-1.5 text-body">
                <select className="rounded-lg border border-line bg-white px-2 py-1 text-[12px]">
                  <option>Normal</option>
                  <option>Heading</option>
                </select>
                <AlignLeft size={15} />
                <AlignCenter size={15} />
                <AlignRight size={15} />
                <AlignJustify size={15} />
                <Quote size={15} />
                <Bold size={15} />
                <Italic size={15} />
                <Underline size={15} />
                <List size={15} />
                <ListOrdered size={15} />
                <Link2 size={15} />
                <ImageIcon size={15} />
              </div>
            </div>
          </section>

          <section>
            <FieldLabel>Text on a button in the modal window</FieldLabel>
            <input
              value={form.buttonText}
              onChange={(event) => patch('buttonText', event.target.value)}
              placeholder="Recommended length is up to 25 characters"
              className="h-9 w-full rounded-xl border border-line bg-white px-3.5 text-[13.5px] outline-none placeholder:text-placeholder focus:border-line-focus"
            />
          </section>

          <div className="grid gap-3">
            <UploadBox title="Banner for web version" size="720x600 px" />
            <UploadBox title="Banner for app" size="1372x440 px" />
            <UploadBox title="Image for modal window" size="1744x800 px" />
          </div>
        </div>

        <div className="flex items-center gap-2.5 border-t border-line bg-hover px-5 py-3">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full bg-brand px-4 py-2 text-[13.5px] font-semibold text-white"
          >
            Publish
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full bg-line px-4 py-2 text-[13.5px] font-semibold text-body"
          >
            Save draft
          </button>
        </div>
      </div>
    </div>
  )
}
