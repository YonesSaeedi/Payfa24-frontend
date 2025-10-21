// BankCardsRedirector.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../utils/apiClient";
import { ROUTES } from "../../routes/routes";

export default function BankCardsRedirector() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkCards = async () => {
      try {
        const res = await apiRequest({ url: "/api/account/credit-card/list", method: "GET" });
        if (res.status && Array.isArray(res.data) && res.data.length > 0) {
          navigate(ROUTES.Cards_Manager, { replace: true });
        } else {
          navigate(ROUTES.BANK_CARDS, { replace: true });
        }
      } catch (e) {
        console.error(e);
        navigate(ROUTES.BANK_CARDS, { replace: true });
      }
    };
    checkCards();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen text-gray-600">
      در حال بررسی کارت‌های شما...
    </div>
  );
}
