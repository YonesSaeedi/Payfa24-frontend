import { JSX, useEffect, useState } from "react";
import { apiRequest } from "../../utils/apiClient";
import BankCardsPage from "../../components/BankCards/BankcardsPage";
import BankCardManager from "../../components/BankCards/BankCardsManager";

interface BankCard {
  bank_name: string;
  card_number: string;
  iban: string;
  status: "active" | "inactive" | string;
  reason: string;
  name_family: string;
}

interface BankCardsResponse {
  status: boolean;
  msg: string;
  data: BankCard[];
}


export default function BankCardsRoute() {
  const [selectedComponent, setSelectedComponent] = useState<JSX.Element | null>(null);

  useEffect(() => {
    const checkCards = async () => {
      try {
        const res = await apiRequest<BankCardsResponse>({
          url: "/account/credit-card/list",
          method: "GET",
        });

        if (res.status && Array.isArray(res.data) && res.data.length > 0) {
          setSelectedComponent(<BankCardManager />);
        } else {
          setSelectedComponent(<BankCardsPage />);
        }
      } catch (error) {
        console.error("❌ خطا در بررسی کارت‌ها:", error);
        setSelectedComponent(<BankCardsPage />);
      }
    };

    checkCards();
  }, []);
  return selectedComponent;
}
