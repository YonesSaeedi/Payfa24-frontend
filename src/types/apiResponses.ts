import { CryptoItem } from "./crypto"

// application =========================================================================================
export interface ChangeItemMessage {
  fa: string | null
  en: string | null
}
export interface ApplicationStore {
  change_item_message: ChangeItemMessage
  link: string
  message: string | null
  os: string
  reqiuard: string
  status: string
  version_code: string | number
}
export type ApplicationInfo = Record<string, ApplicationStore>
// deposit methods =========================================================================================
export interface DepositMethodInfo {
  isDisable: boolean
  isHidden: boolean
}
export type DepositMethods = Record<string, DepositMethodInfo>
// general info =========================================================================================
export interface GeneralInfo {
  application: ApplicationInfo
  cryptocurrency: CryptoItem[]
  depositMethods: DepositMethods
  [key: string]: unknown // allows extra keys without breaking type-check
}