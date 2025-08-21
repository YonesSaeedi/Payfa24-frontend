
import GiftIcon  from "../../assets/icons/Home/WalletCardIcon/GiftIcon";
import Pfbackground from "../../assets/images/Home/invitationIcon/pfbackground.png"


function InvitationCard() {
  return (
    <div className="lg:w-[630px] rounded-xl border border-gray21  bg-cover bg-center p-8 shadow-sm" style={{ backgroundImage: `url(${Pfbackground})` }}>
      <div className="flex flex-col items-center text-center gap-4">
       
        <div className="mb-4 w-[64px] h-[64px] text-blue2">
          <GiftIcon  />
        </div>

   
        <p className="text-xl font-bold text-black1" >!دوستانتان را دعوت کنید</p>

      
        <p className="text-sm text-text mb-6 text-black1">
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

