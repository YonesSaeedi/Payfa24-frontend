import { Paperclip } from "lucide-react";
import { UseFormRegister } from "react-hook-form";
import { TicketFormInputs} from "./Types";


interface FileUploadProps {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  register: UseFormRegister<TicketFormInputs>;
}


export default function FileUpload({ selectedFile, setSelectedFile, register }: FileUploadProps) {
  return (
    <div className="relative">
      <input
        type="file"
        id="file"
        {...register("file")}
        onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
        className="hidden mt-4 bg-gray43"
      />
      <label
        htmlFor="file"
        className="peer flex items-center justify-between w-full border rounded-lg p-3 text-sm cursor-pointer bg-gray43 border-gray12 h-[56px] mt-8  hover:bg-gray-100"
      >
        {selectedFile ? (
          <span className="text-gray-700">{selectedFile.name}</span>
        ) : (
          <span className="text-gray-400">هنوز فایلی انتخاب نکرده‌اید (اختیاری)</span>
        )}
        <Paperclip size={18} className="text-gray-400" />
      </label>
      <span className="absolute right-3 top-6 bg-gray43 px-1 text-gray-500 text-xs">
        فایل پیوست
      </span>
    </div>
  );
}
