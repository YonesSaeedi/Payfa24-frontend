

const TicketItemSkeleton: React.FC = () => {
  return (
    <div
      className="p-3 mb-4 rounded-xl bg-gray27 border border-gray21 animate-pulse"
    >
      {/* ردیف اول: عنوان و وضعیت */}
      <div className="flex justify-between mt-2 mb-3">
        <div className="h-5 w-40 skeleton-bg rounded" />
        <div className="h-5 w-20 skeleton-bg rounded" />
      </div>

      {/* ردیف دوم: شماره پیگیری و تاریخ */}
      <div dir="rtl" className="flex justify-between mt-3">
        <div className="h-4 w-32 skeleton-bg rounded" />
        <div className="h-4 w-16 skeleton-bg rounded" />
      </div>
    </div>
  );
};

export default TicketItemSkeleton;
