import AddFriend from "../pages/Addfriend/AddFriend";


export const ROUTES = {

  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  MARKET:'/market',
  NOTIFICATIONS:'/notifications',
  FORGOT_PASSWORD: '/forgot-password',
  AuthenticationBasic:'/authentication',
  AuthenticationAdvance:'/authenticationAdvance',
  Profile:'/authProfile',
  ChangePassword :'/ChangePassword',
  VerifyGooglePage:'/verify/google',
  MultiFactor:'/MultiFactor',
  BankAccount:'/authProfile',
  ConnectedDevices:'/authProfile',
  GoogleAuthFlow:'/GoogleAuthFlow',
  AddFriend:'/AddFriend',
  Deposit:'/DepositPage',
  Securitysettings :'./Security settings',
  UserAccount:'./authProfile',
  BankAccount:'./authProfile',
  Wallet:'/wallet',
  ConnectedDevices:{
  Root:'/services',
  CREATE:'/services/ConnectedDevices'
},
  TRADE: {
    ROOT: '/trade',
    BUY: '/trade/buy',
    SELL: '/trade/sell',
  },
  Ticket: {
    ROOT: '/ticket',
    CREATE: '/ticket/create',
},
   Transaction:{
    ROOT:'/services',
    CREATE:'/services/transaction'
},
    FAQ:{
    ROOT:'/services',
    CREATE:'/services/faq'
},
    Bank_Cards:{
    ROOT:'/services',
    CREATE:'/services/BankCards'
},
 withdrawal:{
  ROOT:'/',
  CREATE:'/withdrawal'
}

}
