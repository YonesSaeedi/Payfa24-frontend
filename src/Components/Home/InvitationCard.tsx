
import GiftIcon from "../../assets/icons/Home/WalletCard/GiftIcon";

function InvitationCard() {
  return (
    <div className="lg:w-[630px] rounded-xl border border-gray-200 bg-[url('/images/pfbackground.png')] bg-cover bg-center p-8 shadow-sm">
      <div className="flex flex-col items-center text-center gap-4">
       
        <div className="mb-4 w-12 h-12">
          <GiftIcon  />
        </div>

   
        <p className="text-xl font-bold mb-2">دوستانتان را دعوت کنید!</p>

      
        <p className="text-sm text-gray-600 mb-6">
          دوستات رو دعوت کن و از پی‌فا24 جایزه بگیر
        </p>


        <button className="bg-blue-500 hover:bg-blue-600 transition text-white rounded-lg w-full py-2">
          دعوت
        </button>
      </div>
    </div>
  );
}

export default InvitationCard;

