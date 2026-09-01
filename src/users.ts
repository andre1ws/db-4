export type KycStatus = 'Approved' | 'Blocked' | 'Pending'

export type User = {
  name: string
  email: string
  role?: string
  kyc: KycStatus
  lastAction: string
  device: 'desktop' | 'mobile'
  registered: string
  avatar?: string
  company?: string
  subtitle?: string
  gender?: string
  birthDate?: string
  age?: number
  country?: string
  icaDate?: string
  position?: string
  passwordCreated?: boolean
  twoFactor?: string
  lastActionApp?: string
  lastActionAppDevice?: 'desktop' | 'mobile'
  balanceUsd?: string
  balanceEur?: string
  accountLabel?: string
  hasAlert?: boolean
}

export const users: User[] = [
  { name: 'Andrey Gorbatykh', email: 'andriihorbatykh@genesiscsp.com', kyc: 'Pending', lastAction: '26 Aug 2026', device: 'desktop', registered: '30 Oct 2023', gender: 'Male', country: 'Belarus', position: 'Product Manager', passwordCreated: true },
  { name: 'Angel Gabriel Espinosa Nava', email: 'gabrielen105251@outlook.com', kyc: 'Approved', lastAction: '26 Aug 2026', device: 'mobile', registered: '22 Aug 2026', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80', gender: 'Male', country: 'Mexico', passwordCreated: true, twoFactor: '+52 55 1048 2219' },
  { name: 'Ivan Belchikov', email: 'johnbel@yandex.ru', kyc: 'Approved', lastAction: '26 Aug 2026', device: 'desktop', registered: '29 May 2026', gender: 'Male', country: 'Russia', passwordCreated: true },
  { name: 'Andrei Dziarkou', email: 'atai1976@yandex.by', kyc: 'Approved', lastAction: '26 Aug 2026', device: 'mobile', registered: '20 Apr 2020', gender: 'Male', country: 'Belarus', birthDate: '12 Mar 1976', age: 50, passwordCreated: true },
  { name: 'Anton Antonau', email: '17anton8@gmail.com', kyc: 'Approved', lastAction: '26 Aug 2026', device: 'mobile', registered: '06 Jul 2026', gender: 'Male', country: 'Belarus', passwordCreated: true },
  { name: 'Alina Sapon', email: 'sapina@mediacube.io', role: 'Community manager 2.0', kyc: 'Pending', lastAction: '26 Aug 2026', device: 'desktop', registered: '12 May 2026', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&h=80&q=80', gender: 'Female', country: 'Belarus', position: 'Community manager 2.0', passwordCreated: true },
  { name: 'Katsiaryna Markevich', email: 'katmark@mediacube.io', role: 'Support manager', kyc: 'Approved', lastAction: '26 Aug 2026', device: 'desktop', registered: '26 Feb 2025', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80', gender: 'Female', country: 'Belarus', position: 'Support manager', passwordCreated: true, twoFactor: '+375 29 441 2208' },
  { name: 'Olga Zhadetskaya', email: 'zhadetskaya.olga@gmail.com', kyc: 'Approved', lastAction: '26 Aug 2026', device: 'desktop', registered: '24 Aug 2026', gender: 'Female', country: 'Belarus', passwordCreated: true },
  { name: 'Yulia Leonova', email: 'alvasrleona@outlook.com', kyc: 'Approved', lastAction: '26 Aug 2026', device: 'desktop', registered: '15 Apr 2020', gender: 'Female', country: 'Belarus', passwordCreated: true },
  { name: 'castle faceit', email: 'castlefaceit@gmail.com', kyc: 'Blocked', lastAction: '26 Aug 2026', device: 'mobile', registered: '19 Aug 2026', hasAlert: true, passwordCreated: true },
  { name: 'Maksym Shyrshov', email: 'maksym.shyrshov@genesiscsp.com', kyc: 'Pending', lastAction: '26 Aug 2026', device: 'desktop', registered: '25 Aug 2026', gender: 'Male', country: 'Ukraine', passwordCreated: true },
  { name: 'Siarhei Slavinski', email: 'slavinski.sergey@gmail.com', role: 'Garna Partner (CY)', kyc: 'Approved', lastAction: '26 Aug 2026', device: 'desktop', registered: '23 Dec 2025', subtitle: 'Garna Partner (CY)', gender: 'Male', country: 'Cyprus', passwordCreated: true, twoFactor: '+357 99 214 880' },
  { name: 'Andrei Vasileuski', email: 'andre@mediacube.io', role: 'Super admin', kyc: 'Approved', lastAction: '26 Aug 2026', device: 'desktop', registered: '15 Nov 2021', gender: 'Male', country: 'Belarus', position: 'Super admin', passwordCreated: true, twoFactor: '+375 29 111 0001' },
  { name: 'PEACOCK ENTERTAINMENT', email: 'rh121287@gmail.com', kyc: 'Approved', lastAction: '26 Aug 2026', device: 'mobile', registered: '08 May 2025', company: 'PEACOCK ENTERTAINMENT', passwordCreated: true },
  { name: 'Jonathan Campbell', email: 'sayrexlive444@gmail.com', kyc: 'Pending', lastAction: '26 Aug 2026', device: 'desktop', registered: '26 Aug 2025', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=80&h=80&q=80', gender: 'Male', country: 'United States', passwordCreated: true },
  { name: 'Avantera LLC', email: 'contr@avantera.app', company: 'Avantera LLC', kyc: 'Approved', lastAction: '25 Aug 2026', device: 'desktop', registered: '03 Jan 2024', hasAlert: true, passwordCreated: true, country: 'United States', accountLabel: 'Garna Internal account', balanceUsd: '$1,240.00', balanceEur: '€1,140.00' },
  { name: 'Marina Kirilkina', email: 'marina.kirilkina@mediacube.io', kyc: 'Approved', lastAction: '25 Aug 2026', device: 'mobile', registered: '18 Mar 2022', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80', gender: 'Female', country: 'Belarus', position: 'Account manager', passwordCreated: true, twoFactor: '+375 29 555 0199' },
  {
    name: 'Aliaksandr Karunny',
    email: 'aliaksandr.karunny@mediacube.io',
    role: 'SEO boost | Garna',
    kyc: 'Approved',
    lastAction: '25 Aug 2026',
    device: 'desktop',
    registered: '24 Aug 2026',
    subtitle: 'SEO boost | Garna',
    gender: 'Male',
    birthDate: '25 Sep 1986',
    age: 39,
    country: 'Belarus',
    icaDate: '24.08.2026',
    position: 'Digital Marketing Services',
    passwordCreated: true,
    twoFactor: '+375297641859',
    lastActionApp: '26 Aug 2026',
    lastActionAppDevice: 'mobile',
    balanceUsd: '$0.00',
    balanceEur: '€0.00',
    accountLabel: 'Garna Internal account',
  },
]

export const USERS_PAGE_SIZE = 8

export type FilterField = 'role' | 'kyc' | 'company' | 'device' | 'country'
export type FilterCondition = 'empty' | 'is' | 'isNot'

export type FilterRule = {
  id: string
  field: FilterField
  condition: FilterCondition
  value?: string
}

export type FilterPreset = {
  id: string
  name: string
  rules: FilterRule[]
}

function unique(values: (string | undefined)[]) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value)))).sort()
}

export const FILTER_FIELDS: { key: FilterField; label: string; options: string[] }[] = [
  {
    key: 'role',
    label: 'Role',
    options: [
      'Super admin',
      'Admin',
      'Support manager',
      'Content ID manager',
      'Community manager 2.0',
      'Distribution-Agency-Digital manager',
      'Accountant',
      'Garna Partner (CY)',
      'SEO boost | Garna',
    ],
  },
  { key: 'kyc', label: 'KYC status', options: ['Approved', 'Pending', 'Blocked'] },
  { key: 'company', label: 'Company', options: unique(users.map((user) => user.company)) },
  { key: 'device', label: 'Device', options: ['Desktop', 'Mobile'] },
  { key: 'country', label: 'Country', options: unique(users.map((user) => user.country)) },
]

function fieldValue(user: User, field: FilterField): string | undefined {
  switch (field) {
    case 'role':
      return user.role
    case 'kyc':
      return user.kyc
    case 'company':
      return user.company
    case 'device':
      return user.device === 'desktop' ? 'Desktop' : 'Mobile'
    case 'country':
      return user.country
  }
}

export function matchesFilters(user: User, rules: FilterRule[]): boolean {
  return rules.every((rule) => {
    const value = fieldValue(user, rule.field)
    if (rule.condition === 'empty') return !value
    if (rule.condition === 'is') return value === rule.value
    return value !== rule.value
  })
}
