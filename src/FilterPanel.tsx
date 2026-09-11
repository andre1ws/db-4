import { ChevronDown, ListFilter, Plus, Trash2, X } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { FilterCondition, FilterFieldConfig, FilterPreset, FilterRule } from './filters'

const VISIBLE_PRESETS = 2

const conditionLabel: Record<FilterCondition, string> = {
  empty: 'Empty',
  is: 'It is',
  isNot: 'It is not',
}

function FieldLabel({ children }: { children: string }) {
  return <div className="mb-1 text-[10.5px] font-medium uppercase tracking-wide text-muted">{children}</div>
}

function SelectField({
  value,
  onChange,
  children,
}: {
  value: string
  onChange: (value: string) => void
  children: ReactNode
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 w-full appearance-none rounded-xl border border-line bg-white px-3.5 pr-9 text-[13.5px] outline-none focus:border-line-focus"
      >
        {children}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
      />
    </div>
  )
}

function PresetChip({
  preset,
  active,
  onApply,
  onDelete,
}: {
  preset: FilterPreset<string>
  active: boolean
  onApply: () => void
  onDelete: () => void
}) {
  return (
    <span
      className={`inline-flex h-9 items-center gap-1 rounded-full border pl-3 pr-1.5 text-[12.5px] font-medium transition ${
        active ? 'border-brand bg-brand-soft text-brand' : 'border-line bg-white text-body hover:bg-hover'
      }`}
    >
      <button type="button" onClick={onApply} className="max-w-[110px] truncate">
        {preset.name}
      </button>
      <button
        type="button"
        onClick={onDelete}
        aria-label={`Delete ${preset.name}`}
        className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-muted hover:bg-hover-strong hover:text-ink"
      >
        <X size={12} />
      </button>
    </span>
  )
}

export default function FilterPanel<F extends string>({
  fields,
  rules,
  onApply,
  presets,
  onSavePreset,
  onDeletePreset,
}: {
  fields: FilterFieldConfig<F>[]
  rules: FilterRule<F>[]
  onApply: (rules: FilterRule<F>[]) => void
  presets: FilterPreset<F>[]
  onSavePreset: (name: string, rules: FilterRule<F>[]) => void
  onDeletePreset: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [showMorePresets, setShowMorePresets] = useState(false)
  const [draft, setDraft] = useState<FilterRule<F>[]>(rules)
  const [field, setField] = useState<F>(fields[0].key)
  const [condition, setCondition] = useState<FilterCondition>('is')
  const [value, setValue] = useState('')
  const [presetName, setPresetName] = useState('')
  const [editingPresetId, setEditingPresetId] = useState<string | null>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  function fieldLabel(key: F) {
    return fields.find((item) => item.key === key)?.label ?? key
  }

  function ruleLabel(rule: FilterRule<F>) {
    return `${fieldLabel(rule.field)}${rule.value ? `: ${rule.value}` : ''}`
  }

  useEffect(() => {
    if (!open && !showMorePresets) return
    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node
      if (
        !triggerRef.current?.contains(target) &&
        !panelRef.current?.contains(target)
      ) {
        setOpen(false)
        setShowMorePresets(false)
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
        setShowMorePresets(false)
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, showMorePresets])

  const options = fields.find((item) => item.key === field)?.options ?? []
  const visiblePresets = presets.slice(0, VISIBLE_PRESETS)
  const overflowPresets = presets.slice(VISIBLE_PRESETS)

  function openPanel() {
    setDraft(rules)
    setEditingPresetId(null)
    setValue('')
    setShowMorePresets(false)
    setOpen(true)
  }

  function addRule() {
    if (condition !== 'empty' && !value) return
    setDraft((prev) => [
      ...prev,
      { id: crypto.randomUUID(), field, condition, value: condition === 'empty' ? undefined : value },
    ])
    setValue('')
  }

  function removeRule(id: string) {
    setDraft((prev) => prev.filter((rule) => rule.id !== id))
  }

  function handleConfirm() {
    onApply(draft)
    setOpen(false)
  }

  function handleClear() {
    setDraft([])
  }

  function handleCreatePreset() {
    const name = presetName.trim()
    if (!name || draft.length === 0) return
    onSavePreset(name, draft)
    setPresetName('')
  }

  function handleDeletePreset() {
    if (!editingPresetId) return
    deletePresetById(editingPresetId)
    setDraft([])
    setEditingPresetId(null)
  }

  function deletePresetById(id: string) {
    onDeletePreset(id)
    if (editingPresetId === id) onApply([])
  }

  function applyPreset(preset: FilterPreset<F>) {
    setDraft(preset.rules)
    setEditingPresetId(preset.id)
    onApply(preset.rules)
    setShowMorePresets(false)
    setOpen(true)
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2" ref={triggerRef}>
        <button
          type="button"
          onClick={() => (open ? setOpen(false) : openPanel())}
          className={`relative grid h-9 w-9 place-items-center rounded-xl border transition ${
            rules.length ? 'border-brand bg-brand-soft text-brand' : 'border-line bg-white text-ink hover:bg-hover'
          }`}
          aria-label="Filters"
        >
          <ListFilter size={16} />
          {rules.length ? (
            <span className="absolute -right-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[10px] font-medium text-white">
              {rules.length}
            </span>
          ) : null}
        </button>

        {visiblePresets.map((preset) => (
          <PresetChip
            key={preset.id}
            preset={preset}
            active={editingPresetId === preset.id && open}
            onApply={() => applyPreset(preset)}
            onDelete={() => deletePresetById(preset.id)}
          />
        ))}

        {overflowPresets.length ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMorePresets((v) => !v)}
              className={`inline-flex h-9 items-center rounded-full border px-3.5 text-[12.5px] font-medium transition ${
                showMorePresets ? 'border-brand bg-brand-soft text-brand' : 'border-line bg-white text-body hover:bg-hover'
              }`}
            >
              +{overflowPresets.length}
            </button>

            {showMorePresets ? (
              <div className="absolute left-0 top-full z-30 mt-2 w-60 rounded-2xl border border-line bg-white p-1.5 shadow-[0_24px_60px_rgba(17,17,17,0.15)]">
                <div className="max-h-64 overflow-y-auto">
                  {overflowPresets.map((preset) => (
                    <div
                      key={preset.id}
                      className={`flex items-center gap-2 rounded-xl px-2.5 py-2 transition ${
                        editingPresetId === preset.id && open ? 'bg-brand-soft' : 'hover:bg-hover'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => applyPreset(preset)}
                        className={`flex-1 truncate text-left text-[13px] font-medium ${
                          editingPresetId === preset.id && open ? 'text-brand' : 'text-body'
                        }`}
                      >
                        {preset.name}
                      </button>
                      <button
                        type="button"
                        onClick={() => deletePresetById(preset.id)}
                        aria-label={`Delete ${preset.name}`}
                        className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-muted hover:bg-hover-strong hover:text-ink"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {open ? (
        <div
          ref={panelRef}
          className="mt-1 w-full rounded-2xl border border-line bg-white p-3.5 shadow-[0_12px_40px_rgba(17,17,17,0.05)]"
        >
          <div className="mb-2.5 flex items-center justify-between">
            <h3 className="text-[13.5px] font-semibold">Filters</h3>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close filters"
              className="grid h-6 w-6 place-items-center rounded-full text-muted hover:bg-hover-strong hover:text-ink"
            >
              <X size={15} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            <div>
              <FieldLabel>Field</FieldLabel>
              <SelectField
                value={field}
                onChange={(next) => {
                  setField(next as F)
                  setValue('')
                }}
              >
                {fields.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.label}
                  </option>
                ))}
              </SelectField>
            </div>
            <div>
              <FieldLabel>Condition</FieldLabel>
              <div className="flex rounded-xl border border-line p-0.5">
                {(['empty', 'is', 'isNot'] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCondition(item)}
                    className={`flex-1 rounded-lg py-1.5 text-[12px] font-medium transition ${
                      condition === item ? 'bg-brand text-white' : 'text-body hover:bg-hover'
                    }`}
                  >
                    {conditionLabel[item]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <FieldLabel>Value</FieldLabel>
              {condition !== 'empty' ? (
                <SelectField value={value} onChange={setValue}>
                  <option value="">Select a value</option>
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </SelectField>
              ) : (
                <div className="flex h-9 items-center rounded-xl border border-line bg-chip px-3 text-[13px] text-muted">
                  —
                </div>
              )}
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={addRule}
              disabled={condition !== 'empty' && !value}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-[12.5px] font-medium text-brand disabled:opacity-40"
            >
              <Plus size={14} />
              Add filter
            </button>
            {draft.length ? (
              <button
                type="button"
                onClick={handleClear}
                className="text-[12px] font-medium text-muted hover:text-ink"
              >
                Clear all
              </button>
            ) : null}
          </div>

          {draft.length ? (
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5 rounded-xl border border-line bg-chip px-2.5 py-2">
              {draft.map((rule) => (
                <span
                  key={rule.id}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[12px] font-medium text-body shadow-sm"
                >
                  <span className="text-muted">{conditionLabel[rule.condition]}</span>
                  <span className="font-medium text-ink">{ruleLabel(rule)}</span>
                  <button
                    type="button"
                    onClick={() => removeRule(rule.id)}
                    className="text-muted hover:text-ink"
                    aria-label="Remove filter"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-line pt-3">
            <button
              type="button"
              onClick={handleConfirm}
              className="rounded-full bg-brand px-4 py-2 text-[13px] font-medium text-white"
            >
              Apply filters
            </button>
            {editingPresetId ? (
              <button
                type="button"
                onClick={handleDeletePreset}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#fecaca] px-3 py-2 text-[12.5px] font-medium text-[#b91c1c]"
              >
                <Trash2 size={14} />
                Delete preset
              </button>
            ) : null}

            <div className="ml-auto flex items-center gap-2">
              <input
                value={presetName}
                onChange={(event) => setPresetName(event.target.value)}
                placeholder={draft.length === 0 ? 'Add a filter to save as preset' : 'Preset name'}
                disabled={draft.length === 0}
                className="h-9 w-48 rounded-xl border border-line bg-white px-3.5 text-[13.5px] outline-none placeholder:text-placeholder focus:border-line-focus disabled:bg-chip"
              />
              <button
                type="button"
                onClick={handleCreatePreset}
                disabled={!presetName.trim() || draft.length === 0}
                className="rounded-full bg-ink px-3.5 py-2 text-[12.5px] font-medium text-white disabled:opacity-40"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
