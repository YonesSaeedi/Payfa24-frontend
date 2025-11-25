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
import ConnectedDevicesLayout from "../pages/ConnectedDevices/ConnectedDevicesLayout";
import UserAccount from "../pages/Profile/UserAccount";
import CreateTicketPage from "../pages/Ticket/CreateTicketPage";
import NotFoundPage from "../pages/NotFoundPage";
import useAuth from "../hooks/useAuth";
import BankCardManager from "../pages/BankCards/BankCardsManager";
import TicketsRoute from "../pages/Ticket/TicketsRoute";
import ProtectedRoute from "./ProtectedRoute";
import WithdrawFiat from "../pages/Withdrawal/WithdrawFiat";
import WithdrawCrypto from "../pages/Withdrawal/WithdrawCrypto";
import ScrollToTop from "../components/ScrollToTop";



export default function AppRouter() {
  const { isAuthenticated } = useAuth()

  return (
    <BrowserRouter>
     <ScrollToTop />
      <Routes>
        {/* =================== Public Routes =================== */}
        <Route element={<RecaptchaWrapper />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
          <Route path={ROUTES.FORGOT_PASSWORD_SET_PASSWORD} element={<ForgotPasswordPageSetPasswordPage />} />
          <Route path={ROUTES.CHANGE_PASSWORD} element={<ChangePassword />} />
        </Route>
        {/* =================== Protected Routes =================== */}
        <Route path={ROUTES.HOME} element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path={ROUTES.MARKET} element={<ProtectedRoute><MarketPage /></ProtectedRoute>} />
        <Route path={ROUTES.USER_ACCOUNT} element={<ProtectedRoute><UserAccount /></ProtectedRoute>} />
        <Route path={ROUTES.MULTI_FACTOR} element={<ProtectedRoute><MultiFactor /></ProtectedRoute>} />
        <Route path={ROUTES.GOOGLE_AUTH_FLOW} element={<ProtectedRoute><GoogleAuthFlow /></ProtectedRoute>} />
        <Route path={ROUTES.AUTHENTICATION_BASIC} element={<ProtectedRoute><AuthenticationBasic /></ProtectedRoute>} />
        <Route path={ROUTES.AUTHENTICATION_ADVANCED} element={<ProtectedRoute><AuthenticationAdvance /></ProtectedRoute>} />
        <Route path={ROUTES.ADD_FRIEND} element={<ProtectedRoute><AddFriend /></ProtectedRoute>} />
        <Route path={ROUTES.NOTIFICATIONS} element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        <Route path={ROUTES.WALLET} element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
        <Route path={ROUTES.DEPOSIT} element={<ProtectedRoute><DepositPage /></ProtectedRoute>} />
        <Route path={ROUTES.CONNECTED_DEVICES} element={<ProtectedRoute><ConnectedDevicesLayout /></ProtectedRoute>} />
        <Route path={ROUTES.BANK_CARDS} element={<ProtectedRoute><BankCardManager /></ProtectedRoute>} />
        <Route path={ROUTES.TICKET.ROOT} element={<ProtectedRoute><TicketsRoute /></ProtectedRoute>} />
        <Route path={ROUTES.TICKET.CREATE} element={<ProtectedRoute><CreateTicketPage /></ProtectedRoute>} />
        <Route path={ROUTES.TRADE.ROOT} element={<ProtectedRoute><TradeLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to={ROUTES.TRADE.BUY} replace />} />
          <Route path={ROUTES.TRADE.BUY} element={<Buy />} />
          <Route path={ROUTES.TRADE.SELL} element={<Sell />} />
        </Route>
          <Route path={ROUTES.WITHDRAWAL.ROOT} element={<ProtectedRoute><WithdrawPage /></ProtectedRoute>}>
          <Route index element={<Navigate to={ROUTES.WITHDRAWAL.FIAT} replace />} />
          <Route  path={ROUTES.WITHDRAWAL.FIAT} element={<WithdrawFiat />} />
          <Route path={ROUTES.WITHDRAWAL.CRYPTO} element={<WithdrawCrypto />} />
        </Route>
        <Route path={ROUTES.TRANSACTION.ROOT} element={<ProtectedRoute><TransactionLayout /></ProtectedRoute>}>
          <Route index element={<CryptoPage />} />
          <Route path={ROUTES.TRANSACTION.CRYPTO_HISTORY} element={<CryptoPage />} />
          <Route path={ROUTES.TRANSACTION.TOMAN_HISTORY} element={<TomanPage />} />
          <Route path={ROUTES.TRANSACTION.ORDER_HISTORY} element={<OrderPage />} />
        </Route>
        {/* FAQ + MarketView (also protected if needed) */}
        <Route path={ROUTES.FAQ} element={<ProtectedRoute><FaqLayout /></ProtectedRoute>} />
        <Route path={ROUTES.MARKET_VIEW} element={<ProtectedRoute><MarketViewPage /></ProtectedRoute>} />
        {/* =================== Not Found Page =================== */}
        <Route path="*" element={isAuthenticated ? <NotFoundPage /> : <Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

