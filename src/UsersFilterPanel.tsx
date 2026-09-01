import { ChevronDown, ListFilter, Plus, Trash2, X } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  FILTER_FIELDS,
  type FilterCondition,
  type FilterField,
  type FilterPreset,
  type FilterRule,
} from './users'

const VISIBLE_PRESETS = 2

const conditionLabel: Record<FilterCondition, string> = {
  empty: 'Empty',
  is: 'It is',
  isNot: 'It is not',
}

function fieldLabel(field: FilterField) {
  return FILTER_FIELDS.find((item) => item.key === field)?.label ?? field
}

function ruleLabel(rule: FilterRule) {
  return `${fieldLabel(rule.field)}${rule.value ? `: ${rule.value}` : ''}`
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
        className="h-9 w-full appearance-none rounded-xl border border-line bg-white pl-3 pr-9 text-[13px] outline-none focus:border-line-focus"
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
  preset: FilterPreset
  active: boolean
  onApply: () => void
  onDelete: () => void
}) {
  return (
    <span
      className={`inline-flex h-9 items-center gap-1 rounded-full border pl-3 pr-1.5 text-[12.5px] font-semibold transition ${
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

export default function UsersFilterPanel({
  rules,
  onApply,
  presets,
  onSavePreset,
  onDeletePreset,
}: {
  rules: FilterRule[]
  onApply: (rules: FilterRule[]) => void
  presets: FilterPreset[]
  onSavePreset: (name: string, rules: FilterRule[]) => void
  onDeletePreset: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [showMorePresets, setShowMorePresets] = useState(false)
  const [draft, setDraft] = useState<FilterRule[]>(rules)
  const [field, setField] = useState<FilterField>(FILTER_FIELDS[0].key)
  const [condition, setCondition] = useState<FilterCondition>('is')
  const [value, setValue] = useState('')
  const [presetName, setPresetName] = useState('')
  const [editingPresetId, setEditingPresetId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open && !showMorePresets) return
    function onPointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
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

  const options = FILTER_FIELDS.find((item) => item.key === field)?.options ?? []
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

  function applyPreset(preset: FilterPreset) {
    setDraft(preset.rules)
    setEditingPresetId(preset.id)
    onApply(preset.rules)
    setShowMorePresets(false)
    setOpen(true)
  }

  return (
    <div className="flex flex-wrap items-center gap-2" ref={containerRef}>
      <div className="relative">
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
            <span className="absolute -right-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white">
              {rules.length}
            </span>
          ) : null}
        </button>
      </div>

      {open ? (
          <div className="absolute left-0 top-full z-30 mt-2 w-[580px] rounded-2xl border border-line bg-white p-4 shadow-[0_24px_60px_rgba(17,17,17,0.15)]">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="mb-1.5 text-[12px] font-medium text-muted">Value</div>
                <SelectField
                  value={field}
                  onChange={(next) => {
                    setField(next as FilterField)
                    setValue('')
                  }}
                >
                  {FILTER_FIELDS.map((item) => (
                    <option key={item.key} value={item.key}>
                      {item.label}
                    </option>
                  ))}
                </SelectField>
              </div>
              <div>
                <div className="mb-1.5 text-[12px] font-medium text-muted">Condition</div>
                <div className="flex rounded-xl border border-line p-0.5">
                  {(['empty', 'is', 'isNot'] as const).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setCondition(item)}
                      className={`flex-1 rounded-lg py-1.5 text-[12px] font-semibold transition ${
                        condition === item ? 'bg-brand text-white' : 'text-body hover:bg-hover'
                      }`}
                    >
                      {conditionLabel[item]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {condition !== 'empty' ? (
              <div className="mt-3">
                <div className="mb-1.5 text-[12px] font-medium text-muted">Choose</div>
                <SelectField value={value} onChange={setValue}>
                  <option value="">Choose</option>
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </SelectField>
              </div>
            ) : null}

            <button
              type="button"
              onClick={addRule}
              disabled={condition !== 'empty' && !value}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1.5 text-[12.5px] font-semibold text-brand disabled:opacity-40"
            >
              <Plus size={14} />
              Add filter
            </button>

            <div className="mt-4 border-t border-line pt-3">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[12px] font-medium text-muted">Added filters</span>
                {draft.length ? (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-[12px] font-semibold text-muted hover:text-ink"
                  >
                    Clear
                  </button>
                ) : null}
              </div>
              <div className="flex min-h-9 flex-wrap items-center gap-1.5 rounded-xl border border-line bg-chip px-2.5 py-2">
                {draft.length === 0 ? (
                  <span className="text-[12.5px] text-muted">No filters added yet</span>
                ) : (
                  draft.map((rule) => (
                    <span
                      key={rule.id}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[12px] font-medium text-body shadow-sm"
                    >
                      <span className="text-muted">{conditionLabel[rule.condition]}</span>
                      <span className="font-semibold text-ink">{ruleLabel(rule)}</span>
                      <button
                        type="button"
                        onClick={() => removeRule(rule.id)}
                        className="text-muted hover:text-ink"
                        aria-label="Remove filter"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={handleConfirm}
                className="rounded-full bg-brand px-4 py-2 text-[13px] font-semibold text-white"
              >
                Confirm
              </button>
              {editingPresetId ? (
                <button
                  type="button"
                  onClick={handleDeletePreset}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#fecaca] px-3 py-2 text-[12.5px] font-semibold text-[#b91c1c]"
                >
                  <Trash2 size={14} />
                  Delete preset
                </button>
              ) : null}
            </div>

            <div className="mt-3 border-t border-line pt-3">
              <div className="flex items-center gap-2">
                <input
                  value={presetName}
                  onChange={(event) => setPresetName(event.target.value)}
                  placeholder="Enter the preset name"
                  className="h-9 flex-1 rounded-xl border border-line bg-white px-3 text-[13px] outline-none placeholder:text-placeholder focus:border-line-focus"
                />
                <button
                  type="button"
                  onClick={handleCreatePreset}
                  disabled={!presetName.trim() || draft.length === 0}
                  className="rounded-full bg-ink px-3.5 py-2 text-[12.5px] font-semibold text-white disabled:opacity-40"
                >
                  Create
                </button>
              </div>
              {draft.length === 0 ? (
                <p className="mt-1.5 text-[11.5px] text-muted">
                  Add at least one filter above before saving a preset.
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

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
            className={`inline-flex h-9 items-center rounded-full border px-3.5 text-[12.5px] font-semibold transition ${
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
  )
}
