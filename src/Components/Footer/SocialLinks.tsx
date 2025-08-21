import InstagramIcon from "../../assets/icons/Footer/InstagramIcon";
import LinkdinIcon from "../../assets/icons/Footer/LinkdinIcon";
import TelegramIcon from "../../assets/icons/Footer/TelegramIcon";
import YoutubeIcon from "../../assets/icons/Footer/YoutubeIcon";

interface SocialLink {
  icon:  React.JSX.Element;
  href: string;
}

export default function SocialLinks(): React.JSX.Element {
  const socialLinks: SocialLink[] = [
    { icon: <span className="w-[22px] h-[22px]">
      <InstagramIcon />
    </span>, href: "#" },
    { icon: <span className="w-[18px] h-[18px]">
      <LinkdinIcon />
    </span>, href: "#" },
    { icon: <span className="w-[22px] h-[22px]"><YoutubeIcon /></span>, href: "#" },
    { icon: <span className="w-[18px] h-[15px]"><TelegramIcon /></span>, href: "#" },
  ];

  return (
    <div className="flex gap-4">
      {socialLinks.map(({ icon, href }, i) => (
        <a
          key={i}
          href={href}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-white transition"
        >
          {icon}
        </a>
      ))}
    </div>
  );
}
