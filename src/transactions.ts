export type TransactionStatus = 'New' | 'In processing' | 'In processing (auto)' | 'Confirmed'
export type MethodTone = 'crypto' | 'transfer' | 'plain'
export type TransactionRegion = 'CY' | 'CA' | 'CIS' | 'HK'

export type Transaction = {
  id: string
  user: string
  avatar?: string
  quickTransfer?: boolean
  status: TransactionStatus
  expresses: boolean
  createdDate: string
  updatedDate: string
  method: string
  methodTone: MethodTone
  amount: number
  region: TransactionRegion
}

export const REGION_STATS: Record<TransactionRegion, { new: number; requireClarification: number; quickTransfer: number }> = {
  CY: { new: 37, requireClarification: 1, quickTransfer: 0 },
  CA: { new: 12, requireClarification: 0, quickTransfer: 0 },
  CIS: { new: 68, requireClarification: 3, quickTransfer: 1 },
  HK: { new: 1, requireClarification: 0, quickTransfer: 0 },
}

export const TRANSACTIONS_PAGE_SIZE = 10

export const transactions: Transaction[] = [
  { id: 'TRX0001', user: 'Hussein Al-Jazairi', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80', quickTransfer: true, status: 'In processing (auto)', expresses: true, createdDate: '27 Aug 2026', updatedDate: '27 Aug 2026', method: 'To an account in local currency (Quick pay)', methodTone: 'transfer', amount: 4400, region: 'CY' },
  { id: 'TRX0002', user: 'Lt. Eddy Incorporated', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=80&h=80&q=80', quickTransfer: true, status: 'In processing (auto)', expresses: true, createdDate: '26 Aug 2026', updatedDate: '27 Aug 2026', method: 'To an account in local currency (Quick pay)', methodTone: 'transfer', amount: 169.54, region: 'CA' },
  { id: 'TRX0003', user: 'Alejandro Velazquez', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80', status: 'Confirmed', expresses: true, createdDate: '28 Aug 2026', updatedDate: '28 Aug 2026', method: 'Tether TRC20 – USDT', methodTone: 'crypto', amount: 56.25, region: 'CIS' },
  { id: 'TRX0004', user: 'Veronika Filimonova', status: 'Confirmed', expresses: false, createdDate: '28 Aug 2026', updatedDate: '28 Aug 2026', method: 'Tether TRC20 – USDT', methodTone: 'crypto', amount: 2600, region: 'HK' },
  { id: 'TRX0005', user: 'LLC Medium Quality Production', status: 'In processing', expresses: false, createdDate: '28 Aug 2026', updatedDate: '28 Aug 2026', method: 'To an account in RUB (non sanctioned)', methodTone: 'transfer', amount: 9221.82, region: 'CY' },
  { id: 'TRX0006', user: 'Vitaliy Dovgaluk', status: 'New', expresses: false, createdDate: '28 Aug 2026', updatedDate: '28 Aug 2026', method: 'To an account in RUB (non sanctioned)', methodTone: 'plain', amount: 20.94, region: 'CA' },
  { id: 'TRX0007', user: 'Pavel Babko', status: 'Confirmed', expresses: false, createdDate: '28 Aug 2026', updatedDate: '28 Aug 2026', method: 'To a card in USD (Paysend)', methodTone: 'transfer', amount: 1400, region: 'CIS' },
  { id: 'TRX0008', user: 'Nikita Chikin', status: 'In processing (auto)', expresses: false, createdDate: '28 Aug 2026', updatedDate: '28 Aug 2026', method: 'Bitcoin – BTC', methodTone: 'crypto', amount: 300, region: 'HK' },
  { id: 'TRX0009', user: 'Iaroslav Bazikalov', status: 'New', expresses: false, createdDate: '28 Aug 2026', updatedDate: '28 Aug 2026', method: 'To an account in RUB (non sanctioned)', methodTone: 'crypto', amount: 12250, region: 'CY' },
  { id: 'TRX0010', user: 'Stanislau Tsaryk', status: 'New', expresses: false, createdDate: '28 Aug 2026', updatedDate: '28 Aug 2026', method: 'To a card in USD (Paysend)', methodTone: 'crypto', amount: 2300, region: 'CA' },
  { id: 'TRX0011', user: 'Tomislav Sipuljak', status: 'Confirmed', expresses: false, createdDate: '28 Aug 2026', updatedDate: '28 Aug 2026', method: 'To an account in EUR (Airwallex)', methodTone: 'transfer', amount: 1341, region: 'CIS' },
  { id: 'TRX0012', user: 'Maxim Filaretov', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80', status: 'In processing (auto)', expresses: false, createdDate: '28 Aug 2026', updatedDate: '28 Aug 2026', method: 'Bitcoin – BTC', methodTone: 'crypto', amount: 5000, region: 'HK' },
  { id: 'TRX0013', user: 'JUAN PASCUAL', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80', status: 'Confirmed', expresses: false, createdDate: '28 Aug 2026', updatedDate: '28 Aug 2026', method: 'Digital Card (Cardspro)', methodTone: 'plain', amount: 500, region: 'CY' },
  { id: 'TRX0014', user: 'LLC MAMARIKA', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=80&h=80&q=80', status: 'Confirmed', expresses: false, createdDate: '28 Aug 2026', updatedDate: '28 Aug 2026', method: 'Tether ERC20 – USDT', methodTone: 'plain', amount: 775, region: 'CA' },
  { id: 'TRX0015', user: 'Aitor Fernandez', status: 'Confirmed', expresses: false, createdDate: '28 Aug 2026', updatedDate: '28 Aug 2026', method: 'To an account in EUR (Airwallex)', methodTone: 'transfer', amount: 1427, region: 'CIS' },
  { id: 'TRX0016', user: 'Andrew Hirschler', status: 'Confirmed', expresses: false, createdDate: '28 Aug 2026', updatedDate: '28 Aug 2026', method: 'PayPal – USD', methodTone: 'transfer', amount: 845.61, region: 'HK' },
  { id: 'TRX0017', user: 'Kenneth Beetseh', status: 'Confirmed', expresses: false, createdDate: '28 Aug 2026', updatedDate: '28 Aug 2026', method: 'Tether TRC20 – USDT', methodTone: 'crypto', amount: 321.5, region: 'CY' },
  { id: 'TRX0018', user: 'Ilja Kostyuck', status: 'Confirmed', expresses: false, createdDate: '28 Aug 2026', updatedDate: '28 Aug 2026', method: 'USD Coin ERC20 – USDC', methodTone: 'crypto', amount: 932, region: 'CA' },
  { id: 'TRX0019', user: 'Rusya Ryabov', status: 'Confirmed', expresses: false, createdDate: '28 Aug 2026', updatedDate: '28 Aug 2026', method: 'Tether TRC20 – USDT', methodTone: 'plain', amount: 59.45, region: 'CIS' },
  { id: 'TRX0020', user: 'Timofey Gundak', status: 'Confirmed', expresses: false, createdDate: '28 Aug 2026', updatedDate: '28 Aug 2026', method: 'Tether TRC20 – USDT', methodTone: 'plain', amount: 918.94, region: 'HK' },
  { id: 'TRX0021', user: 'Lizzy Gold Onuwaje', status: 'Confirmed', expresses: false, createdDate: '28 Aug 2026', updatedDate: '28 Aug 2026', method: 'Tether TRC20 – USDT', methodTone: 'crypto', amount: 1081, region: 'CY' },
]
