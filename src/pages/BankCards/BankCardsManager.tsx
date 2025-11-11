
// import { useEffect, useState } from "react";
// import { apiRequest } from "../../utils/apiClient";
// import BankCardForm from "../../components/BankCards/BankCardModal/BankCardForm";
// import BankCardList from "../../components/BankCards/BankCardList";
// import BreadcrumbNavigation from "../../components/BreadcrumbNavigation";
// import HeaderLayout from "../../layouts/HeaderLayout";
// import SkeletonCard from "../../components/BankCards/SkeletonCard";
// import { AddCardApi } from "../../components/BankCards/AddCardApi";
// import BankCardsPage from "../../components/BankCards/BankcardsPage";


// type Card = {
//   id: number;
//   number: string;
//   holder: string;
//   bankName: string;
//   status: "confirm" | "pending" | "rejected";
// };

// function BankCardManager() {
//   const [cards, setCards] = useState<Card[]>([]);
//  const [loading, setLoading] = useState<boolean>(true); 

//   const [error, setError] = useState<string | null>(null);


//   const fetchCards = async () => {
//     try {
//       setLoading(true);
//       const response = await apiRequest<{
//         status: boolean;
//         data: {
//           bank_name: string;
//           card_number: string;
//           iban: string;
//           status: string;
//           reason: string;
//           name_family: string;
//         }[];
//       }>({
//         url: "/account/credit-card/list",
//         method: "GET",
//       });

//       if (response.status && Array.isArray(response.data)) {
//         const mappedCards: Card[] = response.data.map((item, index) => ({
//           id: index + 1,
//           number: item.card_number,
//           holder: item.name_family,
//           bankName: item.bank_name,
//           status:
//             item.status === "confirm"
//               ? "confirm"
//               : item.status === "pending"
//               ? "pending"
//               : "rejected",
//         }));
//         setCards(mappedCards);
//       } else {
//         setError("دریافت کارت‌ها ناموفق بود");
//       }
//     } catch (err: any) {
//       setError("خطا در برقراری ارتباط با سرور");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCards();
//   }, []);

//   // const handleAddCard = async (cardNumber: string) => {
//   //   const result = await AddCardApi(cardNumber);
//   //   if (result) fetchCards();
//   // };
//   const handleAddCard = async (cardNumber: string) => {
//     const result = await AddCardApi(cardNumber);
//     if (result) {
//       // بعد از موفقیت، دوباره کارت‌ها را fetch کن
//       await fetchCards();
//     }
//   };

//   if (!loading && cards.length === 0) {
//   return <BankCardsPage />;
// }

//   return (
//     <HeaderLayout>
//       <div dir="rtl" className="bg-backgroundMain min-h-[400px] w-full">
//         <div className="container-style grid grid-col2 gap-8 lg:gap-12">
//           <div className="mt-7 lg:mt-4">
//             <BreadcrumbNavigation />
//           </div>

//           <div className="flex flex-col lg:flex-row gap-4 lg:gap-12 pb-8">
//             <div className="w-full lg:w-2/5 px-4 lg:px-0">
//               <BankCardForm onSave={handleAddCard} />
//             </div>

//             <div className="lg:w-3/5 pt-10 lg:pt-0">
//               {loading ? (
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//                   {Array.from({ length: 4 }).map((_, i) => (
//                     <SkeletonCard key={i} />
//                   ))}
//                 </div>
//               ) : error ? (
//                 <p className="text-red-500 animate-fade-in">{error}</p>
//               ) : (
//                 <BankCardList
//                   cards={cards}
//                   onAddCard={() => console.log("افزودن کارت")}
//                 />
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </HeaderLayout>
//   );
// }

// export default BankCardManager;
import { useEffect, useState } from "react";
import { apiRequest } from "../../utils/apiClient";
import HeaderLayout from "../../layouts/HeaderLayout";
import BreadcrumbNavigation from "../../components/BreadcrumbNavigation";
import BankCardForm from "../../components/BankCards/BankCardModal/BankCardForm";
import SkeletonCard from "../../components/BankCards/SkeletonCard";
import EmptyCards from "../../components/BankCards/EmptyCards";
import BankCardList from "../../components/BankCards/BankCardList";
import AddBankCardModal from "../../components/BankCards/BankCardModal/AddBankCardModal";
import { AddCardApi } from "../../components/BankCards/AddCardApi";

type Card = {
  id: number;
  number: string;
  holder: string;
  bankName: string;
  status: "confirm" | "pending" | "rejected";
};

function BankCardManager() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const response = await apiRequest<{ status: boolean; data: any[] }>({
        url: "/account/credit-card/list",
        method: "GET",
      });

      if (response.status && Array.isArray(response.data)) {
        setCards(
          response.data.map((item, index) => ({
            id: index + 1,
            number: item.card_number,
            holder: item.name_family,
            bankName: item.bank_name,
            status: item.status === "confirm" ? "confirm" : "pending",
          }))
        );
      }
    } catch {
      setError("خطا در دریافت کارت‌ها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleAddCard = async (cardNumber: string) => {
    const result = await AddCardApi(cardNumber);
    if (result) {
      setIsModalOpen(false);
      await fetchCards(); // بعد از اضافه کردن کارت، لیست بروزرسانی شود
    }
  };

  return (
    <HeaderLayout>
     <div dir="rtl" className="bg-backgroundMain min-h-[400px] w-full">
         <div className="container-style grid grid-col2 gap-8 lg:gap-12">
           <div className="mt-7 lg:mt-4">
             <BreadcrumbNavigation />
          </div>
<div className="flex flex-col lg:flex-row gap-4 lg:gap-12 pb-8">
  {/* فرم همیشه ثابت سمت چپ */}
  <div className="w-full lg:w-2/5 px-4 lg:px-0">
    <BankCardForm onSave={handleAddCard} />
  </div>

  {/* سمت راست: لیست کارت، اسکلتون یا EmptyCards */}
  <div className="lg:w-3/5 pt-10 lg:pt-0">
    {loading ? (
      // اسکلتون کارت‌ها هنگام لودینگ
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    ) : error ? (
      <p className="text-red-500">{error}</p>
    ) : cards.length === 0 ? (
      // اگر کارت وجود ندارد → Empty state
      <EmptyCards onAddCard={() => setIsModalOpen(true)} />
    ) : (
      // اگر کارت‌ها وجود دارند → لیست کارت‌ها
      <BankCardList cards={cards} onAddCard={() => setIsModalOpen(true)} />
    )}
  </div>
</div>

          {/* مدال افزودن کارت */}
          <AddBankCardModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleAddCard}
          />
        </div>
      </div>
    </HeaderLayout>
  );
}


export default BankCardManager;
