import React, { useState, useEffect } from "react";
import { Ticket } from "./types";
import bgChat from "../../../assets/images/Ticket/bgchat.jpg";
import supportAvatar from "../../../assets/images/Ticket/avator.jpg";
import { FileText, RefreshCw } from "lucide-react";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import IconSendMessage from "../../../assets/icons/ticket/IconSendMessage";
import IconAttachFile from "../../../assets/icons/ticket/IconAttachFile";
import { apiRequest } from "../../../utils/apiClient";
import { ticketStatusMap } from "../../../utils/statusMap";

import StatusBadge from "../../UI/Button/StatusBadge";


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
  attachment?: { type: "pdf"; name: string; size: string };
  system?: boolean;
}

// ---- ChatHeader همانند قبل بدون تغییر ----
const ChatHeader: React.FC<{ ticket: Ticket }> = ({ ticket }) => {
 const statusText = ticketStatusMap[ticket.status] || "نامشخص";


  return (
    <div className="border-b border-b-gray21 bg-gray37  rounded-t-[16px] px-4 py-3">
      <div className="flex items-center justify-between flex-row-reverse">
        <div dir="rtl" className="flex flex-col">
          <span className="text-gray5 text-sm">شماره تیکت: #{ticket.id}</span>
          <span className="font-medium text-black1 mt-2 text-base">{ticket.title}</span>
        </div>
        <div>
          <StatusBadge text={statusText} /> {/* ✅ نمایش وضعیت با Badge */}
        </div>
      </div>
    </div>
  );
};

// ---- ChatPanel با منطق API ----
const ChatPanel: React.FC<ChatPanelProps> = ({ ticket }) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);

  const fetchMessages = async () => {
    if (!ticket) return;
    try {
      const response = await apiRequest<{
        ticket: { id: number; status: string; title: string };
        ticket_message: { message: string; time: string; file?: string }[];
      }>({
        url: `/api/ticket/${ticket.id}/get-info`,
        method: "GET",
      });

      const serverMessages = response.ticket_message.map((msg, index) => ({
        id: index + 1,
        text: msg.message,
        isUser: false,
        timestamp: msg.time,
        attachment: msg.file
          ? { type: "pdf", name: msg.file, size: "؟MB" }
          : undefined,
      }));

      setMessages(serverMessages);
    } catch (err) {
      console.error("خطا در دریافت پیام‌ها:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [ticket]);

 const handleSend = async (e?: React.MouseEvent<HTMLButtonElement>) => {
  if (e) e.preventDefault(); // جلوگیری از رفتار پیش‌فرض
  if (!newMessage.trim() || !ticket || isSending) return;

  setIsSending(true);

  try {
    const payload = { message: newMessage };

    await apiRequest({
      url: `/api/ticket/${ticket.id}/new`,
      method: "POST",
      data: payload,
      isFormData: false,
    });

    const message: Message = {
      id: Date.now(),
      text: newMessage,
      isUser: true,
      timestamp: new Date().toLocaleString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
    };

    setMessages([...messages, message]);
    setNewMessage("");
    await fetchMessages(); // آپدیت مجدد لیست پیام‌ها
  } catch (err) {
    console.error("خطا در ارسال پیام:", err);
  } finally {
    setIsSending(false);
  }
};


  const currentTicket: Ticket = ticket || {
    id: 0,
    title: "تیکت پیش‌فرض",
    status: "pending",
    date: new Date().toISOString(),
  };

  return (
    <div className="flex-1">
      <div className="border border-gray21 rounded-[16px] h-[798px] flex flex-col overflow-hidden">
        <ChatHeader ticket={currentTicket} />

       
          <div
  className="relative flex-1 p-4 overflow-y-auto bg-cover bg-center"
  style={{ backgroundImage: `url(${bgChat})` }}
>
  <div className="relative z-10 flex flex-col gap-4">
            {messages.map((msg) =>
              msg.system ? (
                <div
                  key={msg.id}
                  className="text-blue-600 text-sm flex items-center gap-1 justify-center"
                >
                  <RefreshCw size={14} /> {msg.text}
                </div>
              ) : (
                <div key={msg.id} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    dir="rtl"
                    className={`shadow rounded-xl px-3 w-[379px] relative flex-col justify-end ${
                      msg.isUser ? "bg-black4 text-black1" : "bg-gray40 text-black1"
                    }`}
                  >
                    {!msg.isUser && (
                      <div dir="rtl" className="flex items-center gap-2 mb-2 mt-4">
                        <img src={supportAvatar} alt="پشتیبانی" className="w-6 h-6 rounded-full" />
                        <span className="text-xs text-black1">
                          {msg.senderName || "پشتیبانی"} ({msg.senderRole || "admin"})
                        </span>
                      </div>
                    )}

                    {msg.text && <p dir="rtl" className="mt-4">{msg.text}</p>}
                    {msg.attachment && (
                      <div className="flex items-center gap-2 border rounded-lg p-2 mt-1 bg-white">
                        <FileText size={20} className="text-blue-600" />
                        <div className="flex flex-col text-xs">
                          <span>{msg.attachment.name}.PDF</span>
                          <span className="text-gray-400">{msg.attachment.size}</span>
                        </div>
                      </div>
                    )}

                    <span dir="rtl" className="text-[10px] text-gray-400 block mt-4 text-right mb-4">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
</div>
      

        <div dir="rtl" className="p-3 flex gap-2 bg-white8">
          <input
            type="text"
            placeholder="پیام خود را بنویسید..."
            className="flex-1 px-3 py-2 focus:outline-none bg-white8"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button className="text-gray39 pl-3">
            <span className="icon-wrapper w-[22px] text-blue2 h-[22px]">
              <IconAttachFile />
            </span>
          </button>
        <button
  className="bg-blue15 text-white rounded-xl shadow w-[45px] h-[45px]"
  onClick={handleSend}
  disabled={isSending} // جلوگیری از کلیک همزمان
>
  <span className="icon-wrapper w-[22px] text-blue2 h-[22px]">
    <IconSendMessage />
  </span>
</button>

        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
