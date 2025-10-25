// banner
export interface Banner {
  imgUrl?: string // "94download.jpg"
  locale?: string[] // ['fa', 'en']
  link?: string // "https://payfa24.org/settings",
  sort?: string // "2"
  [key: string]: unknown
}

// dashboard
export interface Dashboard {
  wallets?: {
    toman?: {
      balance?: number // 782521
    },
    crypto?: {
      balance?: number // 679.61
    }
  },
  banner?: {
    status?: boolean,
    perPage?: string // "2",
    banner?: Banner[]
  },
  [key: string]: unknown // allowing other optional key value pairs
}