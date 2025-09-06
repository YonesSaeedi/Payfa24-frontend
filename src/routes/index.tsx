import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import { ROUTES } from './routes';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import RegisterPage from '../pages/RegisterPage';
import HomePage from '../pages/HomePage';
import TradeLayout from '../pages/trade/TradeLayout';
import Buy from '../pages/trade/Buy';
import Sell from '../pages/trade/Sell';
import AuthenticationBasic from '../pages/authentication/basic';
import AuthenticationAdvance from '../pages/authentication/advance';
import Profile from '../pages/Profile';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* auth pages ==================================================================================================== */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route path={ROUTES.AuthenticationBasic} element={<AuthenticationBasic/>} />
        <Route path={ROUTES.AuthenticationAdvance} element={<AuthenticationAdvance/>} />
        <Route path={ROUTES.Profile} element={<Profile/>}/>
        {/* header only pages ==================================================================================================== */}
        <Route path='trade' element={<TradeLayout />}>
          <Route index element={<Navigate to='buy' replace />} />
          <Route path='buy' element={<Buy />} />
          <Route path='sell' element={<Sell />} />
        </Route>
        {/* header + Footer pages ==================================================================================================== */}
        <Route path={ROUTES.HOME} element={<HomePage />} />

        {/* protected pages ==================================================================================================== */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
 }