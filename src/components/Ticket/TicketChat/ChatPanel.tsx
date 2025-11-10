
import React, { useState, useEffect, useRef } from "react";
import { Ticket } from "./types";
import bgChat from "../../../assets/images/Ticket/bgchat.jpg";
import supportAvatar from "../../../assets/images/Ticket/avator.jpg";
import IconSendMessage from "../../../assets/icons/ticket/IconSendMessage";
import IconAttachFile from "../../../assets/icons/ticket/IconAttachFile";
import  { apiRequest } from "../../../utils/apiClient";
import { ticketStatusMap } from "../../../utils/statusMap";
import StatusBadge from "../../UI/Button/StatusBadge";
import axios from "axios";
import { toast } from "react-toastify";
import type { AxiosProgressEvent } from "axios";

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

interface TicketMessageResponse {
  id: number;
  message: string;
  author: "user" | "support";
  time: string;
  file?: string;
}

interface TicketInfoResponse {
  ticket: {
    id: number;
    title: string;
    status: keyof typeof ticketStatusMap;
  };
  ticket_message: TicketMessageResponse[];
}

type TicketInfo = TicketInfoResponse;

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
  const [, setUploadProgress] = useState<number | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [imageCache, setImageCache] = useState<Record<number, string>>({});
  const [ticketInfo, setTicketInfo] = useState<TicketInfo | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
 const [loading, setLoading] = useState(true);


const fetchData = async () => {
  if (!ticket?.id) return;
  setLoading(true);
  try {
    const res = await apiRequest<TicketInfoResponse>({
      url: `/ticket/${ticket.id}/get-info`,
      method: "GET",
    });

    const formattedMessages: Message[] = res.ticket_message.map((m) => ({
      id: m.id,
      text: m.message,
      isUser: m.author === "user",
      timestamp: m.time,
      file: m.file,
    }));

    setTicketInfo(res);
    setMessages(formattedMessages);
  } catch (err) {
    console.error("ticket/get-info:", err);
  } finally {
    setLoading(false);
  }
};


  const fetchFileAsDataUrl = async (fileToken: string) => {
    const filePath = `/image/${fileToken}`;
    const timestamp = Math.floor(Date.now() / 1000).toString();

    try {
      const blob = await apiRequest<Blob>({
        url: filePath,
        method: "GET",
        responseType: "blob",
        headers: { "x-timestamp": timestamp },
      });

      return URL.createObjectURL(blob);
    } catch (err) {
      console.error("خطا در دریافت فایل:", err);
      return null;
    }
  };
//   const fetchFileAsDataUrl = async (fileToken: string) => {
//   if (!fileToken) return null;

//   const filePath = `/image/${fileToken}`;
//   const timestamp = Math.floor(Date.now() / 1000).toString();

//   console.log("📡 در حال درخواست فایل:", filePath);

//   try {
//     const response = await apiClient.get(filePath, {
//       responseType: "blob",
//       headers: {
//         "x-timestamp": timestamp,
//       },
//     });

//     const blob = response.data;
//     const objectUrl = URL.createObjectURL(blob);
//     console.log("✅ فایل لود شد:", objectUrl);
//     return objectUrl;
//   } catch (err) {
//     console.error("🚫 خطا در دریافت فایل:", err);
//     return null;
//   }
// };


  useEffect(() => {
    fetchData();
  }, [ticket]);

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

  


  const handleSend = async (e?: React.MouseEvent<HTMLButtonElement>) => {
  if (e) e.preventDefault();

  console.log("✅ handleSend اجرا شد", {
  newMessage,
  selectedFile,
  ticket,
  isSending,
});

if ((!newMessage.trim() && !selectedFile) || !ticket || isSending) {
  console.warn("🚫 شرط جلوی ارسال را گرفت!", {
    newMessage,
    selectedFile,
    ticket,
    isSending,
  });
  return;
}

  if ((!newMessage.trim() && !selectedFile) || !ticket || isSending) return;

  setIsSending(true);
  setUploadProgress(0);

  try {
    const formData = new FormData();
    formData.append("message", newMessage.trim() || "فایل پیوست شد");
    if (selectedFile) formData.append("file", selectedFile);

    await apiRequest({
      url: `/ticket/${ticket.id}/new`,
      method: "POST",
      data: formData,
      isFormData: true,
      onUploadProgress: (event?: AxiosProgressEvent) => { 
        if (event?.loaded && event?.total) {
          const percent = Math.round((event.loaded * 100) / event.total);
          setUploadProgress(percent);
        }
      },
    });

    setNewMessage("");
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    await fetchData();
  } catch (err) {
    if (axios.isAxiosError(err) && err.code === "ECONNABORTED") {
      toast.error("درخواست بیش از ۱۰ ثانیه طول کشید و لغو شد!");
    }
    console.error("خطا در ارسال پیام:", err);
  } finally {
    setIsSending(false);
    setUploadProgress(null);
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


  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 w-full h-full">
      <div className="border border-gray21 rounded-[16px] h-[798px] flex flex-col overflow-hidden">
        {ticket && <ChatHeader ticket={ticket} />}

        <div
          className="relative flex-1 p-4 overflow-y-auto bg-cover bg-center"
          style={{ backgroundImage: `url(${bgChat})` }}
        >
     
          <div className="relative z-10 flex flex-col gap-4">
{loading ? (
  <>
    {[1, 2, 3].map((i) => (
      <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
        <div
          dir="rtl"
          className="shadow rounded-xl px-3 w-[360px] h-[110px] relative flex-col bg-gray40 text-black1 animate-pulse"
        >
          <div className="h-4 w-32 skeleton-bg rounded mt-4 mb-2"></div>
          <div className="h-4 w-64 skeleton-bg rounded mb-4"></div>
        </div>
      </div>
    ))}
  </>
) : (
  messages.map((msg) => (
    <div key={msg.id} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
      <div
        dir="rtl"
        className={`shadow px-3 w-[379px] relative flex-col ${
          msg.isUser
            ? "bg-black4 text-black1 rounded-tl-[8px] rounded-tr-[8px] rounded-bl-[8px]"
            : "bg-gray40 text-black1 rounded-tl-[8px] rounded-tr-[8px] rounded-br-[8px]"
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
              {msg.senderName || "پشتیبانی"} ({msg.senderRole || "admin"})
            </span>
          </div>
        )}

        {msg.text && <p dir="rtl" className="mt-4">{msg.text}</p>}

        {msg.file && (
          <div className="rounded-2xl w-fit p-2 mt-2">
            {imageCache[msg.id] ? (
              <img
                src={imageCache[msg.id]}
                alt="attachment"
                className="rounded-lg border border-gray21 w-[200px] h-[150px] object-cover cursor-pointer"
                onClick={() => setFullscreenImage(imageCache[msg.id])}
              />
            ) : (
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
  ))
)}

</div>

        </div>

        <div dir="rtl" className="p-3 flex gap-2 bg-white8">
          <input
            type="text"
            placeholder="پیام خود را بنویسید..."
            className="flex-1 px-3 py-2 focus:outline-none bg-white8 text-black0"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
           onKeyDown={(e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    console.log("🔹 Enter pressed! مقدار فعلی پیام:", newMessage);
    setTimeout(() => handleSend(), 0);
  }
}}

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
