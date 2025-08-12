import InstagramIcon from "../Icons/Footer/InstagramIcon";
import LinkdinIcon from "../Icons/Footer/LinkdinIcon";
import TelegramIcon from "../Icons/Footer/TelegramIcon";
import YoutubeIcon from "../Icons/Footer/YoutubeIcon";

interface SocialLink {
  icon:  React.JSX.Element;
  href: string;
}

export default function SocialLinks(): React.JSX.Element {
  const socialLinks: SocialLink[] = [
    { icon: <InstagramIcon />, href: "#" },
    { icon: <LinkdinIcon />, href: "#" },
    { icon: <YoutubeIcon />, href: "#" },
    { icon: <TelegramIcon />, href: "#" },
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
