
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
  Securitysettings :'./Security settings',
  UserAccount:'./authProfile',
  BankAccount:'./authProfile',
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
    Root:'/services',
    CREATE:'/services/transaction'
},
    FAQ:{
    Root:'/services',
    CREATE:'/services/faq'
},
    BankCards:{
    Root:'/services',
    CREATE:'/services/BankCards'
}

}
