
import AparatIcon from "../../assets/icons/Footer/aparatIcon";
import InstagramIcon from "../../assets/icons/Footer/InstagramIcon";
import TelegramIcon from "../../assets/icons/Footer/TelegramIcon";


interface SocialLink {
  icon: React.JSX.Element;
  href: string;
}

interface SocialLinksProps {
  borderColor?: string; 
}

export default function SocialLinks({
  borderColor = "border-gray-300",
}: SocialLinksProps): React.JSX.Element {
  const socialLinks: SocialLink[] = [
    {
      icon: (
        <span className="w-[22px] h-[22px]">
          <InstagramIcon />
        </span>
      ),
      href: "https://www.instagram.com/payfa24",
    },
    {
      icon: (
        <span className="w-[22px] h-[22px]">
          <AparatIcon />
        </span>
      ),
      href: "https://www.aparat.com/PAYFA24",
    },
    {
      icon: (
        <span className="w-[18px] h-[15px]">
          <TelegramIcon />
        </span>
      ),
      href: "https://t.me/payfa24",
    },
  ];

  return (
    <div className="flex gap-4">
      {socialLinks.map(({ icon, href }, i) => (
        <a
          key={i}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-10 h-10 flex items-center justify-center rounded-full border ${borderColor} transition transform hover:shadow-lg hover:scale-110`}
        >
          {icon}
        </a>
      ))}
    </div>
  );
}
