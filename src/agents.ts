export type AgentType = 'Workflow' | 'Agent'
export type AgentStatus = 'Private' | 'Public'

export type Agent = {
  id: string
  name: string
  icon: 'phone' | 'mail' | 'file' | 'chart' | 'pen' | 'bulb' | 'bot' | 'globe' | 'db' | 'spark' | 'chat' | 'cpu'
  updatedDate: string
  updatedTime: string
  type: AgentType
  runs: number
  rating: number
  reviews: number
  status: AgentStatus
}

const featured: Agent[] = [
  {
    id: 'ASDLKFNG82KD91',
    name: 'Call an LLM (Copy)',
    icon: 'phone',
    updatedDate: 'Jul 12, 2026',
    updatedTime: '02:34 am',
    type: 'Workflow',
    runs: 132,
    rating: 4.39,
    reviews: 122,
    status: 'Private',
  },
  {
    id: 'EML8SUMM01X92A',
    name: 'Email Summarizer',
    icon: 'mail',
    updatedDate: 'Jul 11, 2026',
    updatedTime: '11:08 pm',
    type: 'Agent',
    runs: 256,
    rating: 4.82,
    reviews: 89,
    status: 'Public',
  },
  {
    id: 'DOCPARS3R77Q1K',
    name: 'Document Parser',
    icon: 'file',
    updatedDate: 'Jul 10, 2026',
    updatedTime: '09:41 am',
    type: 'Workflow',
    runs: 98,
    rating: 4.15,
    reviews: 45,
    status: 'Private',
  },
  {
    id: 'DATAANLZ44B0ME',
    name: 'Data Analyzer',
    icon: 'chart',
    updatedDate: 'Jul 09, 2026',
    updatedTime: '04:19 pm',
    type: 'Agent',
    runs: 412,
    rating: 4.91,
    reviews: 203,
    status: 'Public',
  },
  {
    id: 'CNTWRITE9P2L0S',
    name: 'Content Writer',
    icon: 'pen',
    updatedDate: 'Jul 08, 2026',
    updatedTime: '07:55 am',
    type: 'Workflow',
    runs: 67,
    rating: 4.08,
    reviews: 31,
    status: 'Private',
  },
  {
    id: 'RSRCHAST6N11QD',
    name: 'Research Assistant',
    icon: 'bulb',
    updatedDate: 'Jul 07, 2026',
    updatedTime: '01:22 pm',
    type: 'Agent',
    runs: 189,
    rating: 4.67,
    reviews: 156,
    status: 'Public',
  },
]

const extraNames = [
  ['Lead Qualifier', 'bot'],
  ['SEO Outline Builder', 'globe'],
  ['Invoice Extractor', 'file'],
  ['Support Triage', 'chat'],
  ['Market Pulse', 'chart'],
  ['Meeting Notes', 'pen'],
  ['Knowledge Indexer', 'db'],
  ['Brand Voice Tuner', 'spark'],
  ['Ticket Router', 'cpu'],
  ['Outreach Drafter', 'mail'],
  ['FAQ Generator', 'bulb'],
  ['Competitor Watch', 'globe'],
  ['Resume Screener', 'file'],
  ['SQL Copilot', 'db'],
  ['Onboarding Guide', 'bot'],
  ['Legal Clause Finder', 'file'],
  ['Social Captioner', 'spark'],
  ['Forecast Helper', 'chart'],
  ['Voice Transcriber', 'phone'],
  ['Changelog Writer', 'pen'],
  ['Incident Reporter', 'cpu'],
  ['Customer Pulse', 'chat'],
  ['Promo Planner', 'spark'],
  ['Dataset Cleaner', 'db'],
  ['Policy Q&A', 'bulb'],
  ['Hiring Sourcer', 'bot'],
  ['Web Scrape Flow', 'globe'],
] as const

function makeId(seed: number) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let out = ''
  let n = seed * 7919 + 104729
  for (let i = 0; i < 14; i++) {
    n = (n * 1103515245 + 12345) >>> 0
    out += alphabet[n % alphabet.length]
  }
  return out
}

const extras: Agent[] = extraNames.map(([name, icon], i) => {
  const type: AgentType = i % 2 === 0 ? 'Agent' : 'Workflow'
  const status: AgentStatus = i % 3 === 0 ? 'Private' : 'Public'
  const day = 6 - (i % 6)
  return {
    id: makeId(i + 10),
    name,
    icon: icon as Agent['icon'],
    updatedDate: `Jul ${String(day).padStart(2, '0')}, 2026`,
    updatedTime: `${String(8 + (i % 12)).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')} ${i % 2 ? 'am' : 'pm'}`,
    type,
    runs: 24 + i * 17,
    rating: Number((3.9 + ((i * 13) % 11) / 10).toFixed(2)),
    reviews: 12 + i * 9,
    status,
  }
})

export const agents: Agent[] = [...featured, ...extras]
export const PAGE_SIZE = 6
