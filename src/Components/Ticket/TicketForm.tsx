import React, { useState } from "react";

interface TicketFormProps {
  onSubmit: (data: { title: string; description: string; file?: File }) => void;
}

const TicketForm: React.FC<TicketFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description });
  };

  const FloatingInput = ({
    label,
    value,
    onChange,
    type = "text",
  }: {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    type?: string;
  }) => (
    <div className="relative w-full mt-4">
      {type === "textarea" ? (
        <textarea
          rows={4}
          value={value}
          onChange={onChange}
          placeholder=" "
          className="block w-full border border-gray-300 rounded-lg p-3 pt-5 text-gray-900 resize-none focus:outline-none focus:border-blue-500"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder=" "
          className="block w-full border border-gray-300 rounded-lg p-3 pt-5 text-gray-900 focus:outline-none focus:border-blue-500"
        />
      )}
      <label
        className={`absolute left-3 top-2 text-gray-500 text-sm px-1 bg-white transition-all duration-200
          ${value ? "-translate-y-2 text-xs text-blue-500" : "translate-y-0 text-gray-500"}`}
      >
        {label}
      </label>
    </div>
  );

  return (
    <form className=" p-6 rounded-lg " onSubmit={handleSubmit}>
      <h2 dir="rtl" className="text-xl font-semibold text-center mb-4">
        ایجاد تیکت جدید
      </h2>

      <FloatingInput label="عنوان تیکت" value={title} onChange={(e) => setTitle(e.target.value)} />
      <FloatingInput
        label="توضیحات تیکت"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        type="textarea"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition mt-4"
      >
        ارسال تیکت
      </button>
    </form>
  );
};

export default TicketForm;
