export type FilterCondition = 'empty' | 'is' | 'isNot'

export type FilterRule<F extends string = string> = {
  id: string
  field: F
  condition: FilterCondition
  value?: string
}

export type FilterPreset<F extends string = string> = {
  id: string
  name: string
  rules: FilterRule<F>[]
}

export type FilterFieldConfig<F extends string = string> = {
  key: F
  label: string
  options: string[]
}

export function matchesFilters<T, F extends string>(
  item: T,
  rules: FilterRule<F>[],
  fieldValue: (item: T, field: F) => string | undefined,
): boolean {
  return rules.every((rule) => {
    const value = fieldValue(item, rule.field)
    if (rule.condition === 'empty') return !value
    if (rule.condition === 'is') return value === rule.value
    return value !== rule.value
  })
}

export function uniqueValues(values: (string | undefined)[]): string[] {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value)))).sort()
}
