import { Link } from "react-router";
import GiftIcon from "../../assets/icons/Home/WalletCardIcon/GiftIcon";
import Pfbackground from "../../assets/images/Home/invitationIcon/pfbackground.png";
import { ROUTES } from "../../routes/routes";
import { toast } from "react-toastify";
import IconCopy from "../../assets/icons/AddFriend/IconCopy";

type InvitationCardProps = {
  referralLink?: string;
};

function InvitationCard({ referralLink }: InvitationCardProps) {
  const handleCopy = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    toast.info("لینک دعوت کپی شد.");
  };

  return (
    <div
      className="lg:w-[630px] rounded-xl border border-gray21 bg-cover bg-center p-6 shadow-sm"
      style={{ backgroundImage: `url(${Pfbackground})` }}
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-2 w-[64px] h-[64px] text-blue2">
          <GiftIcon />
        </div>

        <p className="text-xl font-bold text-black1 mb-2">!دوستانتان را دعوت کنید</p>
        <p className="text-xs text-text text-black1 mb-4">
          دوستات رو دعوت کن و از پی‌فا24 جایزه بگیر
        </p>

        {referralLink && (
          <div className="mt-3 w-full">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1 block">
              لینک دعوت
            </label>

            {/* Box with COPY Icon */}
            <div
              onClick={handleCopy}
              className="
                w-full py-2 px-4 border border-gray21 shadow-sm rounded-lg 
                text-sm text-gray-800 dark:text-gray-200 
                dark:bg-gray27
                flex items-center justify-center
                cursor-pointer  transition-all
              "
            >
               <span className="icon-wrapper w-4 h-4 text-blue2 flex-shrink-0">
                <IconCopy />
              </span>
              <span className="break-all ml-1 hover:text-blue2 text-sm">{referralLink}</span>

             
            </div>
          </div>
        )}

        <Link
          to={ROUTES.ADD_FRIEND}
          className="
            mt-4 bg-blue2 border border-transparent font-bold 
            text-base text-white rounded-lg w-full py-2
            hover:border-blue2 hover:text-blue2 hover:bg-transparent 
            transition-all duration-200 ease-in
          "
        >
          دعوت
        </Link>
      </div>
    </div>
  );
}

export default InvitationCard;
