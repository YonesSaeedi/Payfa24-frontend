
import { useState } from "react";

import WalletCard from "../Components/Home/WalletCard/WalletCard";
import HeaderFooterLayout from "../layouts/HeaderFooterLayout";
import PosterSlider from "../Components/Home/PosterSlider";
import InvitationCard from "../Components/Home/InvitationCard";
import CryptoTable from "./../Components/Home/CryptoTable";
import QuestionBox from "../Components/Home/QuestionBox/QuestionBox";
import SyncSlider from "../Components/Home/SynchronizedSliders";
import WalletMoney from "../Components/Icons/Home/SynchronizedSliders/WalletMoneyIcon";
import Titan from "../Components/Icons/Home/SynchronizedSliders/TitanIcon";
import TetherTopIcon from "../Components/Icons/Home/SynchronizedSliders/TetherTopIcon";
import TrendIcon from "../Components/Icons/Home/SynchronizedSliders/TrendIcon";
import TrinityIcon from "../Components/Icons/Home/SynchronizedSliders/TrinityIcon";
import TrendDownIcon from "../Components/Icons/Home/SynchronizedSliders/TrendDownIcon";
import Fire from "../Components/Icons/Home/SynchronizedSliders/fireIcon";
import YoYowIcon from "../Components/Icons/Home/SynchronizedSliders/YoYowIcon";
import TokoTokenIcon from "../Components/Icons/Home/CryptoTable/TokoTokenIcon";
import TornIcon from "../Components/Icons/Home/CryptoTable/TornIcon";
import TravelaIcon from "../Components/Icons/Home/CryptoTable/TravelaIcon";
import VeilIcon from "../Components/Icons/Home/CryptoTable/VeilIcon";
import VeChain from "../Components/Icons/Home/CryptoTable/VeChainIcon";
import Ultra from "../Components/Icons/Home/CryptoTable/UltraIconIcon";
import IdentityCard from "../Components/Home/IdentityCard";

const boxes = [
  {
    header: "تازه های بازار",
    headerIcon: <Fire />,
    bgShape: "../../public/images/Yoyow (Yoyow).png",
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
    bgShape: "../../public/images/Trinity Network Credit (Tnc).png",
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
    bgShape: "./../../public/images/TitanSwap (TITAN).png",
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
    bgShape: "./../../public/images/Tetherbackground (USDT).png",
    slides: [
      {
        title: "تتر",
        subtitle: "USDT",
        price: 88901,
        changePct: 23.54,
        iconSrc: <TetherTopIcon />,
      },
      {
        title: "تتر",
        subtitle: "USDT",
        price: 91000,
        changePct: 24.12,
        iconSrc: <TetherTopIcon />,
      },
    ],
  },
];
//////////////

function HomePage() {
  const [active, setActive] = useState(0);
  const data = [
    {
      name: "توکو توکن",
      symbol: "TKO",
      priceUSDT: 489.7,
      sellPrice: 489700,
      buyPrice: 485000,
      change24h: -1,
      logo: <TokoTokenIcon />,
    },
    {
      name: "تورِن",
      symbol: "TURN",
      priceUSDT: 489.7,
      sellPrice: 489700,
      buyPrice: 485000,
      change24h: +1.1,
      logo: <TornIcon />,
    },
    {
      name: "تراولا",
      symbol: "AVA",
      priceUSDT: 489.7,
      sellPrice: 489700,
      buyPrice: 485000,
      change24h: +1.1,
      logo: <TravelaIcon />,
    },
    {
      name: "آلترا",
      symbol: "UOS",
      priceUSDT: 489.7,
      sellPrice: 489700,
      buyPrice: 485000,
      change24h: -1,
      logo: <Ultra />,
    },
    {
      name: "وی چین",
      symbol: "VET",
      priceUSDT: 489.7,
      sellPrice: 489700,
      buyPrice: 485000,
      change24h: -1,
      logo: <VeChain />,
    },
    {
      name: "ولی",
      symbol: "VAI",
      priceUSDT: 489.7,
      sellPrice: 489700,
      buyPrice: 485000,
      change24h: -1,
      logo: <VeilIcon />,
    },
  ];

  const slidesData = [
    {
      title: "کارمزد رایگان",
      subtitle: "بر روی معاملات بیت‌کوین",
      buttonText: "ورود به دنیای رمز ارز",
      imageSrc: "../../public/images/Layer11.png",
    },
    {
      title: "آینده مالی خود را بسازید",
      subtitle: "با سرمایه‌گذاری روی ارزهای دیجیتال",
      buttonText: "شروع کنید",
      imageSrc: "/images/slide2.png",
    },
    {
      title: "سریع و امن",
      subtitle: "انتقال ارز در کمترین زمان",
      buttonText: "ثبت‌نام",
      imageSrc: "/images/slide3.png",
    },
  ];

  return (
    <div>
      <HeaderFooterLayout>
        <div className="container-style">
          <div className="pt-8 pb-8 flex flex-col lg:flex-row-reverse justify-between gap-4">
            <WalletCard balance={844000} changeAmount={34000} change={12.4} />
            <IdentityCard
              title="احراز هویت سطح 1"
              items={["مشخصات فردی", "تصویر مدرک شناسایی"]}
              accesses={["مشاهده قیمت‌ها", "خرید و فروش رمز ارزها"]}
              onClick={() => console.log("start identity")}
            />
          </div>

          <div className="flex flex-col lg:flex-row-reverse justify-between gap-4">
            <PosterSlider slides={slidesData} />
            <InvitationCard />
          </div>

          <div id="SyncSlider" className="pt-12 pb-12">
            <SyncSlider boxes={boxes} />
          </div>

          <div className="w-full pt-7">
            <CryptoTable data={data} active={active} setActive={setActive} />
          </div>
          <div id="qustionBox" className="pt-12 pb-28">
            <QuestionBox />
          </div>
        </div>
      </HeaderFooterLayout>
    </div>
  );
}

export default HomePage;
