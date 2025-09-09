import BreadcrumbNavigation from "../../Components/BreadcrumbNavigation";
import HeaderLayout from "../../layouts/HeaderLayout";
import IconCopy from "../../assets/Icons/AddFriend/IconCopy";
import Icongift from "../../assets/Icons/AddFriend/Icongift";
import IconUserAdd from "../../assets/Icons/AddFriend/IconUserAdd";
import inviteLeftImg from "../../assets/images/Addfriend/inviteLeft.png";
import inviteRightImg from "../../assets/images/Addfriend/inviteRight.png";
import Iconshare from "../../assets/Icons/AddFriend/Iconshare";
import IconUserOctagon from "../../assets/Icons/authentication/IconUserOctagon";

export default function AddFriend() {
  const LinkInvite = [
    {
      Title: "لینک دعوت شما :",
      Link: "https://panel.payfa24.com/panel/referral",
      Icon: <IconCopy />,
    },
    { Title: "کد دعوت شما :", Link: "8387299kuru", Icon: <IconCopy /> },
  ];

  const BoxInvite = [
    { Icon: <Icongift />, Text: "کل درآمد شما", count: "350,000 تومان" },
    { Icon: <IconUserAdd />, Text: "مجموع کاربران دعوت شده", count: "23نفر" },
  ];

  const QuestionBox = [
    {
      Icon: <Iconshare />,
      title: "اشتراک گذاری لینک دعوت",
      description: "لینک اختصاصی خود را با دوستانتان به اشتراک بگذراید.",
    },
    {
      Icon: <IconUserOctagon />,
      title: "ثبت نام در پی فا 24",
      description:
        "دوستان شما زمانی که با کد دعوت اختصاصی شما ثبت نام کنند واحراز هویت خودر را تکمیل و شروع به معامله کنند",
    },
    {
      Icon: <Icongift />,
      title: "دریافت پاداش",
      description:
        "دوستان شما زمانی که با کد دعوت اختصاصی شما ثبت نام کنند واحراز هویت خودر را تکمیل و شروع به معامله کنند.",
    },
  ];
  return (
    <>
      <HeaderLayout>
        <div className="">
          <BreadcrumbNavigation />

          {/* All==> */}
          <div>
            {/* Section1==> */}
            <div className="w-full bg-red-300">
              {/* right==> */}
              <div className="w-1/2">
                <img src={} alt="" />
              </div>
              {/* left==> */}
              <div className="w-1/2">
                <h3>
                  با دعوت از دوستانتان از 25 تا 45 درصد در سود تراکنش‌های آن‌ها
                  پاداش بگیرید
                </h3>
              </div>
            </div>
            {/* =============================================== */}
            {/* section 2 */}
            <div className="flex gap-5 items-center lg:flex-row flex-col">
              <img src={inviteLeftImg} alt="" />
              <img src={inviteRightImg} alt="" />
            </div>
            {/* =============================================== */}
            {/* section 3 */}
            <div className="flex flex-col gap-8">
              <h3>چطور پاداش دریافت کنیم؟</h3>
              <div className="flex">{/* باید مپ بزنی و کارد درست کنی  */}</div>
            </div>
          </div>
        </div>
      </HeaderLayout>
    </>
  );
}
