interface MultiFactorCardProps {
  dataCard: {
    type?: string;
    img?: string;
    text?: string;
    Title?: string;
    button?: string;
    icon?: string | React.ReactNode;
  };
  onClick: () => void;
}

export default function MultiFactorCard({ dataCard, onClick, }: MultiFactorCardProps) {
  const { icon, button, Title, text, img } = dataCard;

  return (
    <div className="w-full rounded-xl lg:p-6 lg:h-44 p-4 border border-gray21">
      {/* بخش بالایی کارت */}
      <div className="flex items-center justify-between flex-row-reverse mb-5">
        <button onClick={(e) => { e.preventDefault(); onClick(); }} className="lg:w-[99px] lg:h-9 h-[30px] w-[83px] rounded-lg border border-blue2 lg:text-base text-xs text-blue2 font-medium">{button}</button>
        {img ? <img className="w-[43px] h-11" src={img} alt={Title} />
          :
          <span className="icon-wrapper w-10 h-10 text-blue2">{icon}</span>
        }
      </div>
      {/* بخش پایینی کارت */}
      <div className="flex text-start flex-col gap-2">
        <h1 className="text-base font-medium">{Title}</h1>
        <p className="lg:text-sm text-xs font-normal text-gray5">{text}</p>
      </div>
    </div>
  );
}
