
import React from "react";

interface DownloadCardProps {
  title: string;
  img: string;
  href: string;
}

export default function DownloadCard({ title, img, href  }: DownloadCardProps): React.JSX.Element {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 cursor-pointer hover:drop-shadow-md">
       
      <div className="text-end">
        <span>دریافت برنامه از</span>
        <p className="font-bold">{title}</p>
      </div>
      <img src={img} alt={`لوگوی ${title}`} className="w-9 h-9" />

    </a>
   
  );
}
