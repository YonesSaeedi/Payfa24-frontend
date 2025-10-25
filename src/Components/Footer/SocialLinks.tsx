import InstagramIcon from "../../assets/icons/Footer/InstagramIcon";
import LinkdinIcon from "../../assets/icons/Footer/LinkdinIcon";
import TelegramIcon from "../../assets/icons/Footer/TelegramIcon";
import YoutubeIcon from "../../assets/icons/Footer/YoutubeIcon";

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
      href: "https://www.instagram.com/yourusername",
    },
    {
      icon: (
        <span className="w-[18px] h-[18px]">
          <LinkdinIcon />
        </span>
      ),
      href: "https://www.linkedin.com/in/yourusername",
    },
    {
      icon: (
        <span className="w-[22px] h-[22px]">
          <YoutubeIcon />
        </span>
      ),
      href: "https://www.youtube.com/channel/yourchannel",
    },
    {
      icon: (
        <span className="w-[18px] h-[15px]">
          <TelegramIcon />
        </span>
      ),
      href:"https://t.me/yourusername",
    },
  ];

  return (
    <div className="flex gap-4">
      {socialLinks.map(({ icon, href }, i) => (
      <a
  key={i}
  href={href}
  className={`w-10 h-10 flex items-center justify-center rounded-full border ${borderColor} transition transform hover:shadow-lg hover:scale-110`}
>
  {icon}
</a>

      ))}
    </div>
  );
}
