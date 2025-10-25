
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  MARKET: "/market",
  NOTIFICATIONS: "/notifications",
  FORGOT_PASSWORD: "/forgot-password",
  FORGOT_PASSWORD_SET_PASSWORD: "/forgot-password-set-password",
  AUTHENTICATION_BASIC: "/kyc-basic",
  AUTHENTICATION_ADVANCED: "/kyc-advanced",
  BANK_CARDS_CONTAINER: "/services/bank-cards",
  PROFILE: "/profile",
  USER_ACCOUNT: "./authProfile",
  BANK_ACCOUNT: "./authProfile",
  WALLET: "/wallet",
  CHANGE_PASSWORD: "/change-password",
  VERIFY_GOOGLE: "/verify/google",
  MULTI_FACTOR: "/multi-factor",
  GOOGLE_AUTH_FLOW: "/google-auth-flow",
  CONNECTED_DEVICES: "/services/connected-devices",
  FAQ: "/services/faq",
  BANK_CARDS: "/services/bank-cards",
  WITHDRAWAL_FIAT: "/withdraw/fiat",
  WITHDRAWAL_CRYPTO: "/withdraw/crypto",
  MARKET_VIEW: '/services/market-view',
  TRADE: {
    ROOT: "/trade",
    BUY: "/trade/buy",
    SELL: "/trade/sell",
  },
  TICKET: {
    ROOT: "/ticket",
    CREATE: "/ticket/create",
  },
  TRANSACTION: {
    ROOT: "/history",
    CRYPTO_HISTORY: "/history/Cryptocurrency",
    TOMAN_HISTORY: "/history/toman",
    ORDER_HISTORY: "/history/order",
  },

  
ADD_FRIEND: {
 ROOT:"/services/add-friend", // مسیر اصلی را به زیرمجموعه خدمات ببرید
},

PROFILE_MEN: {
  ROOT: "/profile",
  USER_ACCOUNT: "/profile/user-account",
 SECURITY_SETTINGS: "/profile/security-settings", // ✅ اضافه شدن مسیر تنظیمات امنیت
    CHANGE_PASSWORD: "/profile/security-settings/change-password", // ✅ تغییر مسیر به زیرمجموعه security-settings
    MULTI_FACTOR: "/profile/security-settings/multi-factor",
  CONNECTED_DEVICES: "/profile/connected-devices",
  BANK_CARDS: "/profile/bank-cards",
  // SECURITY_SETTINGS رو حذف کن! صفحه نداره
},

DEPOSIT: "/deposit",
DEPOSIT_GATEWAY: "/deposit/closeDeal",
DEPOSIT_IDENTIFIER: "/deposit/identifier",
DEPOSIT_CARD: "/deposit/card",
DEPOSIT_RECEIPT: "/deposit/receipt",
DEPOSIT_WALLET: "/deposit/wallet",
DEPOSIT_TXID: "/deposit/txid",

};



