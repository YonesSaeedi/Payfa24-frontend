
import { useState } from "react";
import Fire from "../assets/icons/Home/SynchronizedSliders/fireIcon";
import YoYowIcon from "../assets/icons/Home/SynchronizedSliders/YoYowIcon";
import TrendDownIcon from "../assets/icons/Home/SynchronizedSliders/TrendDownIcon";
import TrinityIcon from "../assets/icons/Home/SynchronizedSliders/TrinityIcon";
import TrendIcon from "../assets/icons/Home/SynchronizedSliders/TrendIcon";
import Titan from "../assets/icons/Home/SynchronizedSliders/TitanIcon";
import WalletMoney from "../assets/icons/Home/SynchronizedSliders/WalletMoneyIcon";
import TetherIcon from "../assets/icons/Home/WalletCard/TetherIcon";
import TokoTokenIcon from "../assets/icons/Home/CryptoTable/TokoTokenIcon";
import TornIcon from "../assets/icons/Home/CryptoTable/TornIcon";
import Ultra from "../assets/icons/Home/CryptoTable/UltraIconIcon";
import VeChain from "../assets/icons/Home/CryptoTable/VeChainIcon";
import Veil from "../assets/icons/Home/CryptoTable/VeilIcon";
import HeaderFooterLayout from "../layouts/HeaderFooterLayout";
import img1 from "../assets/images/Home/image copy (1).jpg";
import WalletCard from "../components/Home/WalletCard/WalletCard";
import IdentityCard from "../components/Home/IdentityCard";
import PosterSlider from "../components/Home/PosterSlider";
import InvitationCard from "../components/Home/InvitationCard";
import SyncSlider from "../components/Home/SynchronizedSliders";
import CryptoTable from "../components/Home/CryptoTable";
import QuestionBox from "../components/Home/QuestionBox/QuestionBox";
import TravelaIcon from "../assets/icons/Home/CryptoTableIcon/TravelaIcon";

const boxes = [
  {
    header: "تازه های بازار",
    headerIcon: <Fire />,
    bgShape: "../../src/assets/images/Home/SynchronizedSlidersIcon/Yoyow (Yoyow).png",
    slides: [
      {
        title: "یویوو",
        subtitle: "YOYOW",
        price: 88901,
        changePct: 23.54,
        iconSrc: <YoYowIcon />,
      },
      {
        title: "یویوو",
        subtitle: "YOYOW",
        price: 91000,
        changePct: 24.12,
        iconSrc: <YoYowIcon />,
      },
    ],
  },
  {
    header: "بیشترین افت قیمت",
    headerIcon: <TrendDownIcon />,
    bgShape: "../../src/assets/images/Home/SynchronizedSlidersIcon/Trinity Network Credit (Tnc).png",
    slides: [
      {
        title: "ترینیتی نتورک",
        subtitle: "TNC",
        price: 88901,
        changePct: -23.54,
        iconSrc: <TrinityIcon />,
      },
      {
        title: "ترینیتی نتورک",
        subtitle: "TNC",
        price: 85000,
        changePct: -25.12,
        iconSrc: <TrinityIcon />,
      },
    ],
  },
  {
    header: "بیشترین افزایش قیمت",
    headerIcon: <TrendIcon />,
    bgShape: "../../src/assets/images/Home/SynchronizedSlidersIcon/TitanSwap (TITAN).png",
    slides: [
      {
        title: "تیتان سوآپ",
        subtitle: "TITAN",
        price: 88901,
        changePct: 23.54,
        iconSrc: <Titan />,
      },
      {
        title: "یویوو",
        subtitle: "YOYOW",
        price: 91000,
        changePct: 24.12,
        iconSrc: <Titan />,
      },
    ],
  },
  {
    header: "بیشترین معامله",
    headerIcon: <WalletMoney />,
    bgShape: "../../src/assets/images/Home/SynchronizedSlidersIcon/Tetherbackground (USDT).png",
    slides: [
      {
        title: "تتر",
        subtitle: "USDT",
        price: 88901,
        changePct: 23.54,
        iconSrc: <TetherIcon />,
      },
      {
        title: "تتر",
        subtitle: "USDT",
        price: 91000,
        changePct: 24.12,
        iconSrc: <TetherIcon />,
      },
    ],
  },
];
//////////////

function HomePage() {
  const [active, setActive] = useState(0);
  const data = [
    {
      name: "ننننننننننننتوکو توکن",
      symbol: "TKO",
      priceUSDT: 489.7,
      sellPrice: 489700,
      buyPrice: 485000,
      change24h: -12,
      logo: <TokoTokenIcon />,
    },
    {
      name: "تورِن",
      symbol: "TURN",
      priceUSDT: 489.7,
      sellPrice: 489700,
      buyPrice: 485000,
      change24h: +12,
      logo: <TornIcon />,
    },
    {
      name: "تراولا",
      symbol: "AVA",
      priceUSDT: 489.7,
      sellPrice: 489700,
      buyPrice: 485000,
      change24h: +12,
      logo: <TravelaIcon />,
    },
    {
      name: "آلترا",
      symbol: "UOS",
      priceUSDT: 489.7,
      sellPrice: 489700,
      buyPrice: 485000,
      change24h: -12,
      logo: <Ultra />,
    },
    {
      name: "وی چین",
      symbol: "VET",
      priceUSDT: 489.7,
      sellPrice: 489700,
      buyPrice: 485000,
      change24h: -12,
      logo: <VeChain />,
    },
    {
      name: "ولی",
      symbol: "VAI",
      priceUSDT: 489.7,
      sellPrice: 489700,
      buyPrice: 485000,
      change24h: -12,
      logo: <Veil />,
    },
  ];

  const slidesData = [
    {
      title: "کارمزد رایگان",
      subtitle: "بر روی معاملات بیت‌کوین",
      buttonText: "ورود به دنیای رمز ارز",
      imageSrc: img1,
    },
    {
      title: "آینده مالی خود را بسازید",
      subtitle: "با سرمایه‌گذاری روی ارزهای دیجیتال",
      buttonText: "شروع کنید",
      imageSrc: "../assets/images/Home/Screenshot 2025-08-20 141154.png",
    },
    {
      title: "سریع و امن",
      subtitle: "انتقال ارز در کمترین زمان",
      buttonText: "ثبت‌نام",
      imageSrc: "../assets/images/Home/Screenshot 2025-08-20 141154.png",
    },
  ];

  return (
    <div>
      <HeaderFooterLayout>
        <div className="bg-white1 text-text">
          <div className="container-style" >
            <div className="pt-8 pb-12 flex flex-col lg:flex-row-reverse justify-between gap-4 bg-backgroundMain">
              <WalletCard balance={844000} changeAmount={34000} change={12.4} />
              <IdentityCard
                title="احراز هویت سطح 1"
                items={["مشخصات فردی", "تصویر مدرک شناسایی"]}
                accesses={["مشاهده قیمت‌ها", "خرید و فروش رمز ارزها"]}
                onClick={() => console.log("start identity")}
              />
            </div>

            <div className="flex flex-col lg:flex-row-reverse justify-between gap-4 pb-10 ">
              <PosterSlider slides={slidesData} />
              <InvitationCard />
            </div>

            <div id="SyncSlider" className="pt-12 pb-12">
              <SyncSlider boxes={boxes} />
            </div>

            <div className="w-full pt-7">
              <CryptoTable data={data} active={active} setActive={setActive} />
            </div>
            <div id="qustionBox" className="pt-12 lg:pb-28 pb-14">
              <QuestionBox />
            </div>
          </div>
        </div>

      </HeaderFooterLayout>
    </div>
  );
}

export default HomePage;
