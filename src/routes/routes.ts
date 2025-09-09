import GoogleAuthFlow from "../pages/Profile/GoogleAuthFlow";

export const ROUTES = {

  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  MARKET:'/market',
  FORGOT_PASSWORD: '/forgot-password',
  AuthenticationBasic:'/authentication',
  AuthenticationAdvance:'/authenticationAdvance',
  Profile:'/authProfile',
  ChangePassword :'/ChangePassword',
  VerifyGooglePage:'/verify/google',
  MultiFactor:'/MultiFactor',
  BankAccount:'/authProfile',
  ConnectedDevices:'/authProfile',
  GoogleAuthFlow:'/GoogleAuthFlow/ab',
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
}

}
