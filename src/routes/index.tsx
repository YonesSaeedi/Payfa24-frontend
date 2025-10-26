import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import { ROUTES } from "./routes";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import RegisterPage from "../pages/RegisterPage";
import HomePage from "../pages/Home/HomePage";
import TradeLayout from "../pages/trade/TradeLayout";
import Buy from "../pages/trade/Buy";
import Sell from "../pages/trade/Sell";
import AuthenticationBasic from "../pages/authentication/basic";
import AuthenticationAdvance from "../pages/authentication/advance";
import MarketPage from "../pages/MarketPage";
import TicketPage from "../pages/Ticket/TicketPage";
import TicketPanel from "../components/Ticket/TicketPanel";
import TicketLayout from "../pages/Ticket/TicketLayout";
import TransactionLayout from "../pages/Transaction/TransactionLayout";
import CryptoPage from "../components/History/CryptoPage";
import NotificationsPage from "../pages/Notifications/NotificationsPage";
import FaqLayout from "../pages/FAQ/FaqLayout";
import Wallet from "../pages/Wallet/Wallet";
import WithdrawPage from "../pages/Withdrawal/WithdrawPage";
import ChangePassword from "../pages/Profile/ChangePassword";
import MultiFactor from "../pages/Profile/MultiFactor";
import GoogleAuthFlow from "../pages/Profile/GoogleAuthFlow";
import AddFriend from "../pages/Addfriend/AddFriend";
import DepositPage from "../pages/Deposit/DepositPage";
import ForgotPasswordPageSetPasswordPage from "../pages/ForgotPasswordPageSetPasswordPage";
import MarketViewPage from "../pages/market-view/MarketViewPage";
import TomanPage from "../components/History/TomanPage";
import OrderPage from "../components/History/OrderPage";
import RecaptchaWrapper from "../components/RecaptchaWrapper";
import BankCardsContainer from "../pages/BankCards/BankCardsContainer";
import DepositForm from "../components/Deposit/DepositForm";
import ConnectedDevicesLayout from "../pages/ConnectedDevices/ConnectedDevicesLayout";
import UserAccount from "../pages/Profile/UserAccount";


export default function AppRouter() {

  return (
    <BrowserRouter>
      <Routes>
        {/* recaptcha provider */}
        <Route element={<RecaptchaWrapper />}>
          {/* auth pages ======================================================================================================== */}
          <Route path={ROUTES.CHANGE_PASSWORD} element={<ChangePassword />} />
          <Route path={ROUTES.MULTI_FACTOR} element={<MultiFactor />} />
          <Route path={ROUTES.GOOGLE_AUTH_FLOW} element={<GoogleAuthFlow />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
          <Route path={ROUTES.FORGOT_PASSWORD_SET_PASSWORD} element={<ForgotPasswordPageSetPasswordPage />} />
        </Route>
        {/* header only pages ==================================================================================================== */}

        <Route path={ROUTES.USER_ACCOUNT} element={<UserAccount />} />
        <Route path={ROUTES.AUTHENTICATION_BASIC} element={<AuthenticationBasic />} />
        <Route path={ROUTES.AUTHENTICATION_ADVANCED} element={<AuthenticationAdvance />} />
        <Route path={ROUTES.DEPOSIT} element={<DepositPage />} />
        <Route path={ROUTES.ADD_FRIEND.ROOT} element={<AddFriend />} />
        <Route path={ROUTES.NOTIFICATIONS} element={<NotificationsPage />} />
        <Route path={ROUTES.WALLET} element={<Wallet />} />
        <Route path={ROUTES.WITHDRAWAL_FIAT} element={<WithdrawPage />} />
        <Route path={ROUTES.WITHDRAWAL_CRYPTO} element={<WithdrawPage />} />
        <Route path={ROUTES.TRADE.ROOT} element={<TradeLayout />}>
          <Route index element={<Navigate to={ROUTES.TRADE.BUY} replace />} />
          <Route path={ROUTES.TRADE.BUY} element={<Buy />} />
          <Route path={ROUTES.TRADE.SELL} element={<Sell />} />
        </Route>
        <Route path={ROUTES.TICKET.ROOT} element={<TicketLayout />}>
          <Route index element={<TicketPage />} />
          <Route path={ROUTES.TICKET.CREATE} element={<TicketPanel />} />
        </Route>
        <Route path={ROUTES.TRANSACTION.ROOT} element={<TransactionLayout />}>
          <Route index element={<CryptoPage />} />                                     {/* /history */}
          <Route path={ROUTES.TRANSACTION.CRYPTO_HISTORY} element={<CryptoPage />} />  {/* /history/Crypto */}
          <Route path={ROUTES.TRANSACTION.TOMAN_HISTORY} element={<TomanPage />} />    {/* /history/toman */}
          <Route path={ROUTES.TRANSACTION.ORDER_HISTORY} element={<OrderPage />} />    {/* /history/order */}
        </Route>
        <Route path={ROUTES.FAQ} element={<FaqLayout />} />
        <Route path={ROUTES.CONNECTED_DEVICES} element={<ConnectedDevicesLayout />} />
        {/* <Route path={ROUTES.BANK_CARDS} element={<BankCardsPage />} />
        <Route path={ROUTES.Cards_Manager} element={<CardsManager />} /> */}
        <Route path={ROUTES.BANK_CARDS_CONTAINER} element={<BankCardsContainer />} />

        <Route path={ROUTES.DEPOSIT_GATEWAY} element={<DepositForm />} />
        <Route path={ROUTES.DEPOSIT_IDENTIFIER} element={<DepositPage selected="identifier" />} />
        <Route path={ROUTES.DEPOSIT_CARD} element={<DepositPage selected="card" />} />
        <Route path={ROUTES.DEPOSIT_RECEIPT} element={<DepositPage selected="receipt" />} />
        <Route path={ROUTES.DEPOSIT_WALLET} element={<DepositPage selected="wallet" />} />

        <Route path={ROUTES.DEPOSIT_TXID} element={<DepositPage selected="txid" />} />


        <Route path={ROUTES.MARKET_VIEW} element={<MarketViewPage />} />
        {/* header + Footer pages ==================================================================================================== */}
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.MARKET} element={<MarketPage />} />
        {/* protected pages ========================================================================================================== */}
        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes >
    </BrowserRouter >
  );
}

