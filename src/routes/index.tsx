import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import { ROUTES } from './routes';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import RegisterPage from '../pages/RegisterPage';
import HomePage from '../pages/HomePage';
import TradeLayout from '../pages/trade/TradeLayout';
import Buy from '../pages/trade/Buy';
import Sell from '../pages/trade/Sell';
import MarketPage from '../pages/MarketPage';
import TicketPage from '../pages/Ticket/TicketPage';
import Authentication from '../pages/authentication/basic';
import TicketPanel from "./../Components/Ticket/TicketPanel"
import TicketLayout from '../pages/Ticket/TicketLayout';
import TransactionLayout from '../pages/Transaction/TransactionLayout';
import TransactionPage from '../pages/Transaction/TransactionPage'
import Transaction from '../Components/Transaction/Transaction';
// import TransactionTable from '../Components/Transaction/Transaction';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* auth pages ==================================================================================================== */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route path={ROUTES.authentication} element={<Authentication/>} />
        {/* header only pages ==================================================================================================== */}
        <Route path='trade' element={<TradeLayout />}>
          <Route index element={<Navigate to='buy' replace />} />
          <Route path='buy' element={<Buy />} />
          <Route path='sell' element={<Sell />} />
        </Route>

        <Route path="ticket" element={<TicketLayout />}>
          <Route index element={<TicketPage />} />         
          <Route path={ROUTES.Ticket.CREATE} element={<TicketPanel />} /> 
        </Route>

       <Route path="services" element={<TransactionLayout />}>
       <Route index element={<TransactionPage />} />
       <Route path="transaction" element={<Transaction/>} />
       </Route>


        {/* header + Footer pages ==================================================================================================== */}
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.MARKET} element={<MarketPage />} />

        {/* protected pages ==================================================================================================== */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
 }