import { matchesFilters, type FilterFieldConfig, type FilterRule } from './filters'

export type PartnerStatus = 'Approved' | 'Pending' | 'Blocked'

export type Partner = {
  id: string
  name: string
  email: string
  avatar?: string
  isRoot?: boolean
  status: PartnerStatus
  volume: number
  shareOfNetwork: number
  shareOfPartner: number
  requests: number
  connected: number
  communityMembers: number
}

export const PARTNERS_TOTAL = 1002
export const MAIN_PARTNERS_TOTAL = 931
export const PARTNERS_PAGE_SIZE = 10

export const PARTNERS_TOTALS = {
  volume: 786_627_744.47,
  shareOfNetwork: 32_572_405.86,
  shareOfPartner: 23_174_358.35,
  requests: 23_972,
  connected: 26_107,
  communityMembers: 3_551,
}

export const partners: Partner[] = [
  { id: 'p1', name: 'Recruiting', email: 'rk@mediacube.io', isRoot: true, status: 'Approved', volume: 368_948_843.05, shareOfNetwork: 24_853_789.60, shareOfPartner: 99_474.15, requests: 7947, connected: 9230, communityMembers: 2273 },
  { id: 'p2', name: 'MediaCube Recruiters', email: 'root@mediacube.io', status: 'Approved', volume: 61_355_111.81, shareOfNetwork: 2_445_802.98, shareOfPartner: 2964.42, requests: 1197, connected: 1480, communityMembers: 126 },
  { id: 'p3', name: 'Marketing', email: 'sol@mediacube.io', status: 'Approved', volume: 58_728_849.46, shareOfNetwork: 3_590_723.84, shareOfPartner: 912.14, requests: 1668, connected: 1876, communityMembers: 268 },
  { id: 'p4', name: 'Magic Find (UFG)', email: 'david@magicfind.us', status: 'Approved', volume: 56_995_130.51, shareOfNetwork: 3858.22, shareOfPartner: 3_245_480.01, requests: 1449, connected: 1560, communityMembers: 113 },
  { id: 'p5', name: '2btube', email: 'fabienne@2btube.com', status: 'Approved', volume: 51_690_913.17, shareOfNetwork: 638.67, shareOfPartner: 3_627_186.22, requests: 1420, connected: 1493, communityMembers: 109 },
  { id: 'p6', name: 'Pavel Kadyrov', email: 'kad@mediacube.io', status: 'Approved', volume: 25_948_558.52, shareOfNetwork: 732_702.09, shareOfPartner: 731_802.57, requests: 134, connected: 240, communityMembers: 1 },
  { id: 'p7', name: 'Zoomin', email: 'instant.games@azerion.com', status: 'Approved', volume: 21_141_191.67, shareOfNetwork: 142.99, shareOfPartner: 1_547_162.55, requests: 1394, connected: 1547, communityMembers: 65 },
  { id: 'p8', name: 'Genesis', email: 'info@akatria.com', status: 'Approved', volume: 19_434_816.34, shareOfNetwork: 3270.49, shareOfPartner: 1_810_297.21, requests: 966, connected: 980, communityMembers: 66 },
  { id: 'p9', name: 'THINKBIG', email: 'thinkbigcsp@gmail.com', status: 'Approved', volume: 19_219_836.96, shareOfNetwork: 1662.87, shareOfPartner: 4_271_151.73, requests: 2311, connected: 2299, communityMembers: 40 },
  { id: 'p10', name: 'Diwan Videos', email: 'osama@diwangroup.com', status: 'Approved', volume: 13_637_190.83, shareOfNetwork: 9018.71, shareOfPartner: 1_974_467.13, requests: 897, connected: 987, communityMembers: 21 },
  { id: 'p11', name: 'KNOT', email: 'knot@2btube.com', status: 'Approved', volume: 13_422_807.67, shareOfNetwork: 0, shareOfPartner: 1_039_266.33, requests: 254, connected: 289, communityMembers: 8 },
  { id: 'p12', name: 'Splay One', email: 'martin.sadik@splayone.com', status: 'Approved', volume: 13_085_241.35, shareOfNetwork: 2163.63, shareOfPartner: 360_557.62, requests: 634, connected: 826, communityMembers: 157 },
  { id: 'p13', name: 'Thumb Media', email: 'miguel.sabino@thumbmedia.net', status: 'Approved', volume: 12_166_689.97, shareOfNetwork: 13_270.14, shareOfPartner: 479_754.66, requests: 705, connected: 714, communityMembers: 96 },
  { id: 'p14', name: 'Dot Republic', email: 'president.sophep@gmail.com', status: 'Approved', volume: 7_561_377.58, shareOfNetwork: 0, shareOfPartner: 8868.63, requests: 211, connected: 218, communityMembers: 2 },
  { id: 'p15', name: 'WildJam', email: 'ceo@wildjam.ru', status: 'Approved', volume: 6_159_878.71, shareOfNetwork: 307_315.26, shareOfPartner: 307_314.46, requests: 35, connected: 55, communityMembers: 1 },
  { id: 'p16', name: 'Vitaly Yaroshevich', email: 'vy@mediacube.io', status: 'Approved', volume: 5_252_135.95, shareOfNetwork: 240_939.68, shareOfPartner: 239_731.55, requests: 95, connected: 124, communityMembers: 7 },
  { id: 'p17', name: 'Bzzz Entertainment', email: 'bzzztvonline@gmail.com', status: 'Approved', volume: 4_398_986.68, shareOfNetwork: 0, shareOfPartner: 1_078_018.25, requests: 463, connected: 450, communityMembers: 29 },
  { id: 'p18', name: 'Dughero', email: 'paolo.dughero@gmail.com', status: 'Approved', volume: 3_444_358.95, shareOfNetwork: 0, shareOfPartner: 493_046.08, requests: 70, connected: 85, communityMembers: 0 },
  { id: 'p19', name: 'GT Channel', email: 'adrian@gtchannel.com', status: 'Approved', volume: 3_349_453.21, shareOfNetwork: 165.16, shareOfPartner: 113_306.24, requests: 180, connected: 196, communityMembers: 6 },
]

export type PartnerFilterField = 'status'

export const PARTNER_FILTER_FIELDS: FilterFieldConfig<PartnerFilterField>[] = [
  { key: 'status', label: 'Status', options: ['Approved', 'Pending', 'Blocked'] },
]

function partnerFieldValue(item: Partner, field: PartnerFilterField): string | undefined {
  switch (field) {
    case 'status':
      return item.status
  }
}

export function matchesPartnerFilters(item: Partner, rules: FilterRule<PartnerFilterField>[]): boolean {
  return matchesFilters(item, rules, partnerFieldValue)
}
