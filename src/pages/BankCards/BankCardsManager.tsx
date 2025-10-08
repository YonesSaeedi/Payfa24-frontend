import React, { useEffect, useState } from "react";
//صفحه دو بخشیت
import { apiRequest } from "../../utils/apiClient"; // مسیرت رو تنظیم کن
import BankCardForm from "../../Components/BankCards/BankCardModal/BankCardForm";
import BankCardList from "../../Components/BankCards/BankCardList";
import BreadcrumbNavigation from "../../components/BreadcrumbNavigation";
import HeaderLayout from "../../layouts/HeaderLayout";
import useGetUser from "../../hooks/useGetUser";
import SkeletonCard from "../../Components/BankCards/SkeletonCard";
import { AddCardApi } from "../../Components/BankCards/AddCardApi";

type Card = {
  id: number;
  number: string;
  holder: string;
  bankName: string;
  status: "confirm" | "pending" | "rejected";
};

function BankCardManager() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 🎯 دریافت لیست کارت‌ها از API با apiRequest
  const fetchCards = async () => {
    try {
      setLoading(true);

      // ✅ درخواست با apiRequest
      const response = await apiRequest<{
        status: boolean;
        msg: string;
        data: {
          bank_name: string;
          card_number: string;
          iban: string;
          status: string;
          reason: string;
          name_family: string;
        }[];
      }>({
        url: "/api/account/credit-card/list",
        method: "GET",
      });

      if (response.status && Array.isArray(response.data)) {
        const mappedCards: Card[] = response.data.map((item, index) => ({
          id: index + 1,
          number: item.card_number,
          holder: item.name_family,
          bankName: item.bank_name,
          status:
            item.status === "confirm"
              ? "confirm"
              : item.status === "pending"
              ? "pending"
              : "rejected",
        }));

        setCards(mappedCards);
      } else {
        setError("دریافت کارت‌ها ناموفق بود");
      }
    } catch (err: any) {
      console.error(err);
      setError("خطا در برقراری ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  // 📦 فراخوانی API هنگام mount شدن کامپوننت
  useEffect(() => {
    fetchCards();
  }, []);


//   const cleanedNumber = cardNumber.replace(/-/g, "").trim();

//   try {
//     const response = await apiRequest<
//       { status: boolean; msg: string },
//       { CardNumber: string }
//     >({
//       url: "/api/account/credit-card",
//       method: "POST",
//       data: { CardNumber: cleanedNumber },
//     });

//     if (response.status) {
//       const newCard: Card = {
//         id: Date.now(),
//         number: cleanedNumber,
//         holder: "مالک کارت",
//         bankName,
//         status: "pending",
//       };
//       setCards((prev) => [...prev, newCard]);
//       toast.success("کارت با موفقیت ثبت شد!");
//     } else {
//       toast.error(response.msg); // پیام خطا یا کارت تکراری از سرور
//     }
//   } catch (err) {
//     console.error(err);
//     toast.error(err?.response?.data?.msg || err?.response?.data?.message || 'در ثبت کارت مشکلی پیش آمد.');
//   }
// };

const handleAddCard = async (cardNumber: string) => {
  const result = await AddCardApi(cardNumber);
  if (result) {
    // بعد از افزودن موفق، دوباره کل کارت‌ها رو از API بگیریم
    fetchCards();
  }
};



  const { data: userData } = useGetUser();
  console.log(userData);

  return (
    <HeaderLayout>
      <div dir="rtl" className="bg-backgroundMain min-h-[400px] w-full">
        <div className="container-style flex flex-col gap-8 lg:gap-12">
          <div className="mt-7 lg:mt-4">
            <BreadcrumbNavigation />
          </div>
          <div className=" flex gap-8 lg:gap-12 ">
            {/* 📋 فرم افزودن کارت */}
            <div>
              <BankCardForm onSave={handleAddCard} />
            </div>

            {/* 💳 نمایش کارت‌ها */}
            <div className="w-full lg:w-1/2 pt-10 lg:pt-0">
              {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : error ? (
                <p className="text-red-500 animate-fade-in">{error}</p>
              ) : (
                <BankCardList
                  cards={cards}
                  onAddCard={() =>
                    console.log(
                      "اینجا می‌تونی مودال افزودن کارت یا فرم رو باز کنی"
                    )
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </HeaderLayout>
  );
}

export default BankCardManager;
