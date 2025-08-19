import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import { ROUTES } from './routes';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import RegisterPage from '../pages/RegisterPage';
import HomePage from '../pages/HomePage';
<<<<<<< HEAD
import PasswordInput from '../pages/PasswordInput';
import InviteLogin from '../pages/InviteLogin';
=======
import TradeLayout from '../pages/trade/TradeLayout';
import Buy from '../pages/trade/Buy';
import Sell from '../pages/trade/Sell';
>>>>>>> ba2bc7a10ed4383e5e692d80703afd80d7fe4044

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* auth pages ==================================================================================================== */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />

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
<<<<<<< HEAD
}
=======
}
>>>>>>> ba2bc7a10ed4383e5e692d80703afd80d7fe4044
