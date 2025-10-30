// src/components/DatePickerModal.tsx
import { Dispatch, SetStateAction } from "react";
import { Calendar } from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

type DatePickerModalProps = {
  setBirthDateBtnValue: Dispatch<SetStateAction<string | null>>;
  onClose: () => void;
};

const DatePickerModal = ({ setBirthDateBtnValue, onClose }: DatePickerModalProps) => {
  const handleDateChange = (date: DateObject) => {
    const formatted = date.format("YYYY/MM/DD");
    setBirthDateBtnValue(formatted);
    onClose();
  };

  const maxSelectableDate = new DateObject({ calendar: persian }).subtract(18, "years");

  return (
    <div
      className="fixed inset-0 bg-black/40 z-30 flex items-center justify-center"
      onClick={onClose}
    >
      {/* 🔹 خود باکس مودال */}
      <div
        className="w-[335px] lg:w-[410px]  p-4 lg:p-5 rounded-[20px] flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()} 
      >
        <Calendar
          calendar={persian}
          locale={persian_fa}
          onChange={handleDateChange}
          maxDate={maxSelectableDate}
          digits={["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]}
          className="w-full flex items-center justify-center"
        />
      </div>
    </div>
  );
};

export default DatePickerModal;
