import React, { useState, useEffect, useRef } from "react";
import { Ticket } from "./types";
import bgChat from "../../../assets/images/Ticket/bgchat.jpg";
import supportAvatar from "../../../assets/images/Ticket/avator.jpg";
import IconSendMessage from "../../../assets/icons/ticket/IconSendMessage";
import IconAttachFile from "../../../assets/icons/ticket/IconAttachFile";
import { apiRequest } from "../../../utils/apiClient";
import { ticketStatusMap } from "../../../utils/statusMap";
import StatusBadge from "../../UI/Button/StatusBadge";
import IconCircledAttach from "../../../assets/icons/ticket/IconCircledAttach";
import axios from "axios";
import { toast } from "react-toastify";


interface ChatPanelProps {
  ticket: Ticket | null;
}

interface Message {
  id: number;
  text?: string;
  isUser: boolean;
  timestamp: string;
  senderName?: string;
  senderRole?: string;
  file?: string;
  attachment?: {
    type: "pdf" | "image";
    name: string;
    size: string;
    url?: string;
  };
  system?: boolean;
}



type TicketInfo = {
  ticket: {
    id: number;
    title: string;
    status: keyof typeof ticketStatusMap;
  };
  ticket_message: Message[];
};

const ChatHeader: React.FC<{ ticket: Ticket }> = ({ ticket }) => {
  const statusText = ticketStatusMap[ticket.status] || "نامشخص";

  return (
    <div className="border-b border-b-gray21 bg-gray37 rounded-t-[16px] px-4 py-3">
      <div className="flex items-center justify-between flex-row-reverse">
        <div dir="rtl" className="flex flex-col">
          <span className="text-gray5 text-sm">شماره تیکت: #{ticket.id}</span>
          <span className="font-medium text-black1 mt-2 text-base">
            {ticket.title}
          </span>
        </div>
        <div>
          <StatusBadge text={statusText} />
        </div>
      </div>
    </div>
  );
};

const ChatPanel: React.FC<ChatPanelProps> = ({ ticket }) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [imageCache, setImageCache] = useState<Record<number, string>>({});
  const [ticketInfo, setTicketInfo] = useState<TicketInfo | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);

  // دریافت اطلاعات تیکت و پیام‌ها
  const fetchData = async () => {
    if (!ticket?.id) return;
    try {
      const res = await apiRequest<any>({
        url: `/api/ticket/${ticket.id}/get-info`,
        method: "GET",
      });

      const formattedMessages = res.ticket_message.map((m: any) => ({
        id: m.id,
        text: m.message,
        isUser: m.author === "user",
        timestamp: m.time,
        file: m.file,
      }));

      setTicketInfo(res); // ✅ درست شد
      setMessages(formattedMessages);
    } catch (err) {
      console.error("ticket/get-info:", err);
    } finally {
      setLoading(false);
    }
  };


  const fetchFileAsDataUrl = async (fileToken: string) => {
    const filePath = `/api/image/${fileToken}`;
    const timestamp = Math.floor(Date.now() / 1000).toString();

    try {
      const blob = await apiRequest<Blob>({
        url: filePath,
        method: "GET",
        responseType: "blob",
        headers: { "x-timestamp": timestamp},
      });

      // فایل PDF رو هم می‌تونیم blob URL بسازیم
      return URL.createObjectURL(blob); // ✅ blob URL برای PDF و تصاویر
    } catch (err) {
      console.error("خطا در دریافت فایل:", err);
      return null;
    }
  };



  useEffect(() => {
    fetchData();
  }, [ticket]);

  // بارگذاری تصویر فایل‌های تیکت
  useEffect(() => {
    if (!ticketInfo) return;

    const loadFiles = async () => {
      const newCache = { ...imageCache };
      let updated = false;
      for (const msg of ticketInfo.ticket_message) {
        if (msg.file && !newCache[msg.id]) {
          const fileUrl = await fetchFileAsDataUrl(msg.file);
          if (fileUrl) {
            newCache[msg.id] = fileUrl;
            updated = true;
          }
        }
      }
      if (updated) setImageCache(newCache);
    };

    loadFiles();
  }, [ticketInfo]);


  // ارسال پیام جدید
  const handleSend = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();
    if ((!newMessage.trim() && !selectedFile) || !ticket || isSending) return;

    setIsSending(true);
    setUploadProgress(0); // شروع آپلود

    try {
      const formData = new FormData();
      formData.append("message", newMessage.trim() || "فایل پیوست شد");
      if (selectedFile) formData.append("file", selectedFile);

      await apiRequest({
        url: `/api/ticket/${ticket.id}/new`,
        method: "POST",
        data: formData,
        isFormData: true,
       
        onUploadProgress: (event?: any) => {
          if (event?.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            setUploadProgress(percent);
          }
        },
      });

      // پاک کردن ورودی‌ها بعد از ارسال موفق
      setNewMessage("");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      await fetchData(); // دریافت مجدد پیام‌ها و فایل‌ها
    } catch (err) {
       if (axios.isAxiosError(err) && err.code === "ECONNABORTED") {
    toast.error("درخواست بیش از ۱۰ ثانیه طول کشید و لغو شد!");}
      console.error("خطا در ارسال پیام:", err);
    } finally {
      setIsSending(false);
      setUploadProgress(null); // بعد از آپلود نوار پیشرفت را مخفی کن
    }
  };


  const handleAttachClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        alert("فقط فرمت‌های jpg, jpeg, png مجاز است");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setSelectedFile(file);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  return (
    <div className="flex-1 w-full h-full">
      <div className="border border-gray21 rounded-[16px] h-[798px] flex flex-col overflow-hidden">
        {ticket && <ChatHeader ticket={ticket} />}

        {/* پیام‌ها */}
        <div
          className="relative flex-1 p-4 overflow-y-auto bg-cover bg-center"
          style={{ backgroundImage: `url(${bgChat})` }}
        >
          <div className="relative z-10 flex flex-col gap-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  dir="rtl"
                  className={`shadow rounded-xl px-3 w-[379px] relative flex-col ${msg.isUser ? "bg-black4 text-black1" : "bg-gray40 text-black1"
                    }`}
                >
                  {!msg.isUser && (
                    <div dir="rtl" className="flex items-center gap-2 mb-2 mt-4">
                      <img
                        src={supportAvatar}
                        alt="پشتیبانی"
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-xs text-black1">
                        {msg.senderName || "پشتیبانی"} (
                        {msg.senderRole || "admin"})
                      </span>
                    </div>
                  )}

                  {msg.text && <p dir="rtl" className="mt-4">{msg.text}</p>}

                 
        {msg.file && (
  <div className="rounded-2xl w-fit p-2 mt-2">
    {imageCache[msg.id] ? (
      msg.file.endsWith(".pdf") ? (
        <a
          href={imageCache[msg.id]}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-blue-600 underline"
        >
          <IconCircledAttach />
          <span>دانلود PDF</span>
        </a>
      ) : (
        <img
          src={imageCache[msg.id]}
          alt="attachment"
          className="rounded-xl object-contain max-h-[150px] max-w-[200px] cursor-pointer"
          onClick={() => setFullscreenImage(imageCache[msg.id])}
        />
      )
    ) : (
      // اسکلتون مشابه جدول کریپتو
      <div className="border rounded-lg border-gray21 animate-pulse w-[200px] h-[150px] skeleton-bg"></div>
    )}
  </div>
)}



                  <span
                    dir="rtl"
                    className="text-[10px] text-gray-400 block mt-4 text-right mb-4"
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            <div ref={bottomRef} />

            {/* پیش‌نمایش فایل */}
            {selectedFile && (
              <div className="flex items-center justify-between rounded-full bg-white shadow px-3 py-2 mt-2 w-fit">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={removeSelectedFile}
                    className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-sm"
                  >
                    ×
                  </button>
                  <span className="text-sm font-medium">{selectedFile.name}</span>
                </div>
              </div>
            )}

            {uploadProgress !== null && (
              <div className="w-[379px] h-1 bg-gray-300 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}

          </div>
        </div>

        {/* ناحیه ارسال پیام */}
        <div dir="rtl" className="p-3 flex gap-2 bg-white8">
          <input
            type="text"
            placeholder="پیام خود را بنویسید..."
            className="flex-1 px-3 py-2 focus:outline-none bg-white8 text-black0"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          <input
            type="file"
            ref={fileInputRef}
            accept=".jpg,.jpeg,.png"
            className="hidden"
            onChange={handleFileChange}
          />

          <button className="text-gray39 pl-3" onClick={handleAttachClick}>
            <span className="icon-wrapper w-[22px] text-blue2 h-[22px]">
              <IconAttachFile />
            </span>
          </button>

          <button
            className="bg-blue15 text-white rounded-xl shadow w-[45px] h-[45px]"
            onClick={handleSend}
            disabled={isSending}
          >
            {isSending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
            ) : (
              <span className="icon-wrapper w-[22px] text-blue2 h-[22px]">
                <IconSendMessage />
              </span>
            )}
          </button>
        </div>
      </div>

      {/* نمایش فول‌اسکرین تصویر */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setFullscreenImage(null)}
        >
          <img
            src={fullscreenImage}
            alt="fullscreen"
            className="max-h-full max-w-full rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default ChatPanel;
