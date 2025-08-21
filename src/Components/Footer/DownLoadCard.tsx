
import React from "react";

interface DownloadCardProps {
  title: string;
  img: string;
}

export default function DownloadCard({ title, img }: DownloadCardProps): React.JSX.Element {
  return (
    <div className="flex items-center gap-2 ">
      <div className="text-end">
        <span>دریافت برنامه از</span>
        <p className="font-bold">{title}</p>
      </div>
      <img src={img} alt={`لوگوی ${title}`} className="w-9 h-9" />
    </div>
  );
}
