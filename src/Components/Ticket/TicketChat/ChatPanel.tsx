import React, { useState, useEffect, useRef } from "react";
import { Ticket } from "./types";
import bgChat from "../../../assets/images/Ticket/bgchat.jpg";
import supportAvatar from "../../../assets/images/Ticket/avator.jpg";
import { FileText } from "lucide-react";
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
  attachment?: {
    type: "pdf" | "image";
    name: string;
    size: string;
    url?: string;
  };
  system?: boolean;
}

const ChatHeader: React.FC<{ ticket: Ticket }> = ({ ticket }) => {
  const statusText = ticketStatusMap[ticket.status] || "نامشخص";

  return (
    <div className="border-b border-b-gray21 bg-gray37 rounded-t-[16px] px-4 py-3">
      <div className="flex items-center justify-between flex-row-reverse">
        <div dir="rtl" className="flex flex-col">
          <span className="text-gray5 text-sm">شماره تیکت: #{ticket.id}</span>
          <span className="font-medium text-black1 mt-2 text-base">{ticket.title}</span>
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [isSentPreview, setIsSentPreview] = useState(false); // حالت جدید


  // بارگذاری پیام‌ها از سرور
  const fetchMessages = async () => {
    if (!ticket) return;
    try {
      console.log("sending file:", selectedFile);

      const response = await apiRequest<{
        ticket_message: {
          id: number;
          message: string;
          author: string;
          time: string;
          file?: string;
        }[];
      }>({
        url: `/api/ticket/${ticket.id}/get-info`,
        method: "GET",
      });

      const serverMessages: Message[] = response.ticket_message.map((msg) => {
        let attachment;
        if (msg.file) {
          const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(msg.file);
          attachment = {
            type: isImage ? "image" : "pdf",
            name: msg.file,
            size: "؟MB",
            url: isImage ? `/api/ticket/file/${msg.file}` : undefined,
          };
        }
       console.log(response);
       console.log("sending file:", selectedFile);

       
       
        return {
          id: msg.id,
          text: msg.message,
          isUser: msg.author === "user",
          timestamp: msg.time,
          senderName: msg.author === "user" ? "شما" : "پشتیبانی",
          senderRole: msg.author === "user" ? "user" : "admin",
          attachment,
        };
      });
console.log(serverMessages);
      setMessages(serverMessages);
    } catch (err) {
      console.error("خطا در دریافت پیام‌ها:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [ticket]);
    
  // ارسال پیام جدید
  const handleSend = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();
    if ((!newMessage.trim() && !selectedFile) || !ticket || isSending) return;

    setIsSending(true);
    setIsSentPreview(true); // وقتی ارسال زدیم، حالت preview اصلی فعال بشه

    try {
      const formData = new FormData();
      formData.append("message", newMessage.trim() || "فایل پیوست شد");
      if (selectedFile) formData.append("file", selectedFile);
      else formData.append("file", "");

      await apiRequest({
        url: `/api/ticket/${ticket.id}/new`,
        method: "POST",
        data: formData,
        // headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event: ProgressEvent) => {
          if (event.total) setUploadProgress(Math.round((event.loaded * 100) / event.total));
        },
      });

      // اضافه کردن پیام به لیست محلی
      const isImage = selectedFile?.type.startsWith("image/");
      const message: Message = {
        id: Date.now(),
        text: newMessage.trim() || undefined,
        isUser: true,
        timestamp: new Date().toLocaleString("fa-IR", {
          hour: "2-digit",
          minute: "2-digit",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
        attachment: selectedFile
          ? {
              type: isImage ? "image" : "pdf",
              name: selectedFile.name,
              size: `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`,
              url: isImage ? URL.createObjectURL(selectedFile) : undefined,
            }
          : undefined,
      };
      console.log("new message", message);

      setMessages((prev) => [...prev, message]);
      setNewMessage("");
      setSelectedFile(null);
      setIsSentPreview(false);

      if (fileInputRef.current) fileInputRef.current.value = "";

      // بارگذاری مجدد پیام‌ها از سرور برای همگام‌سازی
      fetchMessages();
    } catch (err) {
      console.error("خطا در ارسال پیام:", err);
    } finally {
      setIsSending(false);
      setUploadProgress(null);
    }
  };

  const handleAttachClick = () => fileInputRef.current?.click();

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files.length > 0) setSelectedFile(e.target.files[0]);
  //   setIsSentPreview(false);

  // };
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
    setIsSentPreview(false);

  };

  // کش کردن تصاویر با DataURL
  useEffect(() => {
    const loadImages = async () => {
      for (const msg of messages) {
        if (msg.attachment?.type === "image" && msg.attachment.name && !msg.attachment.url) {
          try {
            const res = await fetch(`/api/ticket/file/${msg.attachment.name}`);
            const blob = await res.blob();
            const reader = new FileReader();
            reader.onloadend = () => {
              const url = reader.result as string;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === msg.id
                    ? { ...m, attachment: { ...m.attachment!, url } }
                    : m
                )
              );
            };
            reader.readAsDataURL(blob);
          } catch (err) {
            console.error("خطا در دریافت تصویر:", err);
          }
        }
      }
    };
    loadImages();
  }, [messages]);

  // اسکرول خودکار به آخر پیام‌ها
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1">
      <div className="border border-gray21 rounded-[16px] h-[798px] flex flex-col overflow-hidden">
        <ChatHeader
          ticket={
            ticket || {
              id: 0,
              title: "",
              status: "pending",
              date: new Date().toISOString(),
            }
          }
        />

        <div
          className="relative flex-1 p-4 overflow-y-auto bg-cover bg-center"
          style={{ backgroundImage: `url(${bgChat})` }}
        >
          <div className="relative z-10 flex flex-col gap-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  dir="rtl"
                  className={`shadow rounded-xl px-3 w-[379px] relative flex-col justify-end ${
                    msg.isUser
                      ? "bg-black4 text-black1"
                      : "bg-gray40 text-black1"
                  }`}
                >
                  {!msg.isUser && (
                    <div
                      dir="rtl"
                      className="flex items-center gap-2 mb-2 mt-4"
                    >
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

                  {msg.text && (
                    <p dir="rtl" className="mt-4">
                      {msg.text}
                    </p>
                  )}
                  {msg.attachment && (
                    <>
                      {msg.attachment.type === "pdf" && (
                        <div className="flex items-center gap-2 border rounded-lg p-2 mt-1 bg-white">
                          <FileText size={20} className="text-blue-600" />
                          <div className="flex flex-col text-xs">
                            <span>{msg.attachment.name}.PDF</span>
                            <span className="text-gray-400">
                              {msg.attachment.size}
                            </span>
                          </div>
                        </div>
                      )}

                      {msg.attachment.type === "image" &&
                        msg.attachment.url && (
                          <div className="rounded-2xl w-fit shadow bg-white p-2 mt-2">
                            <img
                              src={msg.attachment.url}
                              alt="attachment"
                              className="rounded-xl object-contain max-h-[150px] max-w-[200px] cursor-pointer"
                              onClick={() =>
                                setFullscreenImage(msg.attachment!.url!)
                              }
                            />
                          </div>
                        )}
                    </>
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

            {/* پیش‌نمایش فایل انتخابی */}
            {selectedFile && !isSentPreview && (
              <>
                {selectedFile.type.startsWith("image/") ? (
                  <div className="flex items-center justify-between rounded-full bg-white shadow px-3 py-2 mt-2 w-fit">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={removeSelectedFile}
                        className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-sm"
                      >
                        ×
                      </button>
                      <span className="text-sm font-medium">
                        {selectedFile.name}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between rounded-full bg-white shadow px-3 py-2 mt-2 w-fit">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={removeSelectedFile}
                        className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-sm"
                      >
                        ×
                      </button>
                      <span className="text-sm font-medium">
                        {selectedFile.name}
                      </span>
                    </div>
                  </div>
                )}
              </>
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

        {/* ورودی پیام و دکمه‌ها */}
        <div dir="rtl" className="p-3 flex gap-2 bg-white8">
          <input
            type="text"
            placeholder="پیام خود را بنویسید..."
            className="flex-1 px-3 py-2 focus:outline-none bg-white8"
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
            <span className="icon-wrapper w-[22px] text-blue2 h-[22px]">
              <IconSendMessage />
            </span>
          </button>
        </div>
      </div>

      {/* نمایش تصویر فول‌اسکرین */}
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
