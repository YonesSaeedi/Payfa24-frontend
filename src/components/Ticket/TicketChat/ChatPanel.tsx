
//کد اولیه با درخواست های متعدد 401

import React, { useState, useEffect, useRef } from "react";
import { Ticket } from "./types";
import bgChat from "../../../assets/images/Ticket/bgchatlight.jpg";
import bgchatDark from "../../../assets/images/Ticket/bgchatDark.jpg";
import supportAvatar from "../../../assets/images/Ticket/avator.jpg";
import IconSendMessage from "../../../assets/icons/ticket/IconSendMessage";
import IconAttachFile from "../../../assets/icons/ticket/IconAttachFile";
import { apiRequest } from "../../../utils/apiClient";
import { ticketStatusMap } from "../../../utils/statusMap";
import StatusBadge from "../../UI/Button/StatusBadge";
import axios from "axios";
import { toast } from "react-toastify";
import type { AxiosProgressEvent } from "axios";
import IconCloseButtun from "../../../assets/icons/services/IconCloseButtun";

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
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [imageCache, setImageCache] = useState<Record<number, string>>({});
  const imageCacheRef = useRef<Record<number, string>>({}); // sync ref to avoid stale closures
  const pendingFetches = useRef<Set<number>>(new Set()); // ids currently being fetched
  const [ticketInfo, setTicketInfo] = useState<TicketInfo | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // بررسی کلاس dark روی <html>
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

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

    try {
      const blob = await apiRequest<Blob>({
        url: filePath,
        method: "GET",
        responseType: "blob",
      });

      return URL.createObjectURL(blob);
    } catch (err) {
      console.error("خطا در دریافت فایل:", err);
      return null;
    }
  };

  useEffect(() => {
    fetchData();
  }, [ticket]);

  // ---------- NEW: incremental image loader (prevents refetching all files) ----------
  useEffect(() => {
    if (!ticketInfo) return;

    // loop on messages and fetch only those that:
    // - have file token
    // - are not already in imageCacheRef
    // - are not currently being fetched (pendingFetches)
    ticketInfo.ticket_message.forEach((msg) => {
      if (!msg.file) return;
      const id = msg.id;
      if (imageCacheRef.current[id] || pendingFetches.current.has(id)) {
        return; // already have it or already fetching
      }

      // mark as fetching
      pendingFetches.current.add(id);

      // start download (do not await sequentially)
      fetchFileAsDataUrl(msg.file)
        .then((fileUrl) => {
          if (fileUrl) {
            // update both ref and state (atomic update)
            imageCacheRef.current = { ...imageCacheRef.current, [id]: fileUrl };
            setImageCache((prev) => {
              const next = { ...prev, [id]: fileUrl };
              // keep ref in sync (redundant but safe)
              imageCacheRef.current = next;
              return next;
            });
          }
        })
        .catch((err) => {
          console.error("خطا در دانلود تصویر پیام:", id, err);
        })
        .finally(() => {
          pendingFetches.current.delete(id);
        });
    });
  }, [ticketInfo]); // only depends on ticketInfo changes

  // ---------- keep imageCacheRef synced whenever state changes from elsewhere ----------
  // (This ensures if other code calls setImageCache directly we keep the ref consistent)
  useEffect(() => {
    imageCacheRef.current = imageCache;
  }, [imageCache]);

  const handleSend = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();

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

      const tempMsgId = Date.now();
      const tempUrl = selectedFile ? URL.createObjectURL(selectedFile) : undefined;

      const newMsg: Message = {
        id: tempMsgId,
        text: newMessage.trim(),
        isUser: true,
        timestamp: new Date().toLocaleString("fa-IR"),
        file: tempUrl,
      };

      setMessages((prev) => [...prev, newMsg]);

      setNewMessage("");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      if (selectedFile) {
        try {
          // بعد از ارسال، یکبار get-info می‌کنیم تا پیام سرور رو بگیریم و توکن فایل واقعی رو استخراج کنیم.
          // از آنجا که ما از incremental loader استفاده کرده‌ایم، وقتی ticketInfo جدید ست شود
          // loader فقط فایل‌های جدید را دانلود خواهد کرد.
          setTimeout(async () => {
            const updated = await apiRequest<TicketInfoResponse>({
              url: `/ticket/${ticket.id}/get-info`,
              method: "GET",
            });

            const lastMsg = updated.ticket_message[updated.ticket_message.length - 1];

            if (lastMsg?.file) {
              // دانلود مستقیم و قرار دادن در cache
              const fileUrl = await fetchFileAsDataUrl(lastMsg.file);
              if (fileUrl) {
                // set both state and ref
                const next = { ...imageCacheRef.current, [tempMsgId]: fileUrl };
                imageCacheRef.current = next;
                setImageCache((prev) => ({ ...prev, [tempMsgId]: fileUrl }));
              }
            }

            // همچنین ticketInfo را به‌روزرسانی می‌کنیم تا نمایش پیام‌ها هماهنگ شود
            setTicketInfo(updated);
            setMessages(
              updated.ticket_message.map((m) => ({
                id: m.id,
                text: m.message,
                isUser: m.author === "user",
                timestamp: m.time,
                file: m.file,
              }))
            );
          }, 1000);
        } catch (err) {
          console.error("خطا در بارگذاری فایل از سرور:", err);
        }
      }
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

  const convertDigitsToPersian = (str: string) => {
    return str.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);
  };

  return (
    <div className="flex-1 w-full h-full">
      <div className=" relative border border-gray21 rounded-[16px] h-[798px] flex flex-col overflow-hidden">
        {ticket && <ChatHeader ticket={ticket} />}

        <div className="relative flex-1 p-4 overflow-y-auto bg-cover bg-center" style={{ backgroundImage: `url(${isDark ? bgchatDark : bgChat})` }}>
          <div className="relative z-10 flex flex-col gap-4">
            {loading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
                    <div dir="rtl" className="shadow rounded-xl px-3 w-[360px] h-[110px] relative flex-col bg-gray40 text-black1 animate-pulse">
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
                    className={`shadow px-3 w-[379px] relative flex-col ${msg.isUser
                      ? "bg-black4 text-black1 rounded-tl-[8px] rounded-tr-[8px] rounded-bl-[8px]"
                      : "bg-gray40 text-black1 rounded-tl-[8px] rounded-tr-[8px] rounded-br-[8px]"
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

                    {msg.text && (
                      <p dir="rtl" className="mt-4">
                        {msg.text}
                      </p>
                    )}

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

                    <span dir="rtl" className=" text-gray-400 block mt-4 text-right mb-4 font-normal  text-[12px]">
                      {convertDigitsToPersian(msg.timestamp)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          {selectedFile && (
            <div dir="rtl" className="mt-4 mb-2 mx-3">
              <div className="flex flex-col rounded-2xl w-64 shadow bg-blue-100 p-3 gap-2">
                <div className="flex relative gap-2 items-center">
                  <div className="w-full text-sm break-all">{selectedFile.name}</div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="flex text-xs bg-red-500 text-white rounded-full w-5 h-5 items-center justify-center hover:bg-red-600"
                    title="حذف فایل"
                  >
                    <span className="w-4 h-4 icon-wrapper">
                      <IconCloseButtun />
                    </span>
                  </button>
                </div>
                {isSending && uploadProgress !== null && (
                  <div className="w-full h-1 bg-gray-300 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                  </div>
                )}
              </div>
            </div>
          )}
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
                setTimeout(() => handleSend(), 0);
              }
            }}
          />
          <input type="file" ref={fileInputRef} accept=".jpg,.jpeg,.png" className="hidden" onChange={handleFileChange} />

          <button className="text-gray39 pl-3" onClick={handleAttachClick}>
            <span className="icon-wrapper w-[22px] hover:text-blue2 h-[22px]">
              <IconAttachFile />
            </span>
          </button>

          <button className="bg-blue15 text-white rounded-xl shadow w-[45px] h-[45px] hover:border-blue2 hover:border  hover:text-blue2" onClick={handleSend} disabled={isSending}>
            {isSending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
            ) : (
              <span className="icon-wrapper w-[22px] h-[22px]">
                <IconSendMessage />
              </span>
            )}
          </button>
        </div>
      </div>

      {fullscreenImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={() => setFullscreenImage(null)}>
          <img src={fullscreenImage} alt="fullscreen" className="max-h-full max-w-full rounded-lg" />
        </div>
      )}
    </div>
  );
};

export default ChatPanel;
















// import React, { useState, useEffect, useRef } from "react";
// import { Ticket } from "./types";
// import bgChat from "../../../assets/images/Ticket/bgchatlight.jpg";
// import bgchatDark from "../../../assets/images/Ticket/bgchatDark.jpg";
// import supportAvatar from "../../../assets/images/Ticket/avator.jpg";

// import IconSendMessage from "../../../assets/icons/ticket/IconSendMessage";
// import IconAttachFile from "../../../assets/icons/ticket/IconAttachFile";
// import IconCloseButtun from "../../../assets/icons/services/IconCloseButtun";
// import { ticketStatusMap } from "../../../utils/statusMap";
// import StatusBadge from "../../UI/Button/StatusBadge";
// import axios, { AxiosProgressEvent } from "axios";
// import { toast } from "react-toastify";

// interface ChatPanelProps {
//   ticket: Ticket | null;
// }

// interface Message {
//   id: number;
//   text?: string;
//   isUser: boolean;
//   timestamp: string;
//   file?: string;
//   senderName?: string;
//   senderRole?: string;
// }

// interface TicketMessageResponse {
//   id: number;
//   message: string;
//   author: "user" | "support";
//   time: string;
//   file?: string;
// }

// interface TicketInfoResponse {
//   ticket: {
//     id: number;
//     title: string;
//     status: keyof typeof ticketStatusMap;
//   };
//   ticket_message: TicketMessageResponse[];
// }

// type TicketInfo = TicketInfoResponse;

// // ---------- Token + API Helpers ----------

// // ---------- getAccessToken with debug ----------
// async function getAccessToken(): Promise<string | null> {
//   let token = localStorage.getItem("accessToken");
//   const expiresAt = Number(localStorage.getItem("expiresAt") || "0");
//   const now = Math.floor(Date.now() / 1000);

//   console.log("[DEBUG] getAccessToken called, token:", token, "expiresAt:", expiresAt, "now:", now);

//   if (!token || now >= expiresAt - 30) {
//     const refreshToken = localStorage.getItem("refreshToken");
//     console.log("[DEBUG] token expired or missing, refreshToken:", refreshToken);
//     if (!refreshToken) return null;

//     try {
//       const res = await axios.post("https://api.payfa24.org/api/v4/auth/refresh-token", { refreshToken });
//       token = res.data.access_token;
//       const newExpiresAt = Math.floor(Date.now() / 1000) + res.data.expires_in;

//       console.log("[DEBUG] refresh token success, new accessToken:", token, "newExpiresAt:", newExpiresAt);

//       if (token) localStorage.setItem("accessToken", token);
//       localStorage.setItem("expiresAt", String(newExpiresAt));
//       localStorage.setItem("refreshToken", res.data.refresh_token);

//       return token;
//     } catch (err) {
//       console.error("[DEBUG] refresh token failed:", err);
//       toast.error("خطا در refresh token. لطفا دوباره وارد شوید.");
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("refreshToken");
//       localStorage.removeItem("expiresAt");
//       window.location.href = "/login";
//       return null;
//     }
//   }

//   console.log("[DEBUG] token valid, returning existing token");
//   return token;
// }

// // ---------- simpleApiRequest with debug ----------
// async function simpleApiRequest<T = any>({
//   url,
//   method = "GET",
//   data,
//   params,
//   headers = {},
//   onUploadProgress,
//   responseType,
// }: {
//   url: string;
//   method?: "GET" | "POST" | "PUT" | "DELETE";
//   data?: any;
//   params?: any;
//   headers?: Record<string, string>;
//   onUploadProgress?: (event?: AxiosProgressEvent) => void;
//   responseType?: any;
// }): Promise<T> {
//   const token = await getAccessToken();
//   if (!token) throw new Error("No valid access token");

//   const config = {
//     url: "https://api.payfa24.org/api/v4" + url,
//     method,
//     data,
//     params,
//     responseType,
//     headers: {
//       Authorization: `Bearer ${token}`,
//       ...headers,
//     },
//     onUploadProgress,
//   };

//   console.log("[DEBUG] simpleApiRequest called:", method, url, "headers:", config.headers);

//   try {
//     const response = await axios.request<T>(config);
//     console.log("[DEBUG] simpleApiRequest success:", response.status, response.data);
//     return response.data;
//   } catch (err: any) {
//     if (err.response) {
//       console.error("[DEBUG] simpleApiRequest error response:", err.response.status, err.response.data);
//     } else {
//       console.error("[DEBUG] simpleApiRequest error:", err.message);
//     }
//     throw err;
//   }
// }


// // ---------- ChatHeader ----------

// const ChatHeader: React.FC<{ ticket: Ticket }> = ({ ticket }) => {
//   const statusText = ticketStatusMap[ticket.status] || "نامشخص";
//   return (
//     <div className="border-b border-b-gray21 bg-gray37 rounded-t-[16px] px-4 py-3">
//       <div className="flex items-center justify-between flex-row-reverse">
//         <div dir="rtl" className="flex flex-col">
//           <span className="text-gray5 text-sm">شماره تیکت: #{ticket.id}</span>
//           <span className="font-medium text-black1 mt-2 text-base">{ticket.title}</span>
//         </div>
//         <div>
//           <StatusBadge text={statusText} />
//         </div>
//       </div>
//     </div>
//   );
// };

// // ---------- ChatPanel ----------
// const ChatPanel: React.FC<ChatPanelProps> = ({ ticket }) => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [uploadProgress, setUploadProgress] = useState<number | null>(null);
//   const [ticketInfo, setTicketInfo] = useState<TicketInfo | null>(null);
//   const [isSending, setIsSending] = useState(false);
//   const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
//   const [isDark, setIsDark] = useState(false);

//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const imageCacheRef = useRef<Record<number, string>>({});
//   const pendingFetches = useRef<Set<number>>(new Set());

//   const convertDigitsToPersian = (str: string) =>
//     str.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);

//   // ---------- theme ----------
//   useEffect(() => {
//     const updateTheme = () => setIsDark(document.documentElement.classList.contains("dark"));
//     updateTheme();
//     const observer = new MutationObserver(updateTheme);
//     observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
//     return () => observer.disconnect();
//   }, []);

//   // ---------- fetch ticket once ----------
//   useEffect(() => {
//     if (!ticket?.id) return;

//     let isMounted = true; // جلوگیری از setState روی unmounted
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const res = await simpleApiRequest<TicketInfoResponse>({ url: `/ticket/${ticket.id}/get-info` });
//         if (isMounted) {
//           setTicketInfo(res);
//           setMessages(res.ticket_message.map((m) => ({
//             id: m.id,
//             text: m.message,
//             isUser: m.author === "user",
//             timestamp: m.time,
//             file: m.file,
//           })));
//         }
//       } catch (err) {
//         console.error(err);
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     };

//     fetchData();
//     return () => { isMounted = false; };
//   }, [ticket?.id]);

//   // ---------- fetch file ----------
//   const fetchFileAsDataUrl = async (fileToken: string) => {
//     try {
//       const blob = await simpleApiRequest<Blob>({
//         url: `/image/${fileToken}`,
//         method: "GET",
//         responseType: "blob" as const,
//       });
//       return URL.createObjectURL(blob);
//     } catch (err) {
//       console.error("خطا در دریافت فایل:", err);
//       return null;
//     }
//   };

//   // ---------- incremental image loader ----------
//   const [imageCache, setImageCache] = useState<Record<number, string>>({});
//   useEffect(() => {
//     if (!ticketInfo) return;
//     ticketInfo.ticket_message.forEach((msg) => {
//       if (!msg.file) return;
//       const id = msg.id;
//       if (imageCacheRef.current[id] || pendingFetches.current.has(id)) return;

//       pendingFetches.current.add(id);
//       fetchFileAsDataUrl(msg.file)
//         .then((url) => {
//           if (url) {
//             imageCacheRef.current = { ...imageCacheRef.current, [id]: url };
//             setImageCache((prev) => ({ ...prev, [id]: url }));
//           }
//         })
//         .finally(() => pendingFetches.current.delete(id));
//     });
//   }, [ticketInfo]);
//   useEffect(() => { imageCacheRef.current = imageCache; }, [imageCache]);

//   // ---------- handle file change ----------
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       setSelectedFile(e.target.files[0]);
//     }
//   };

//   // ---------- handle attach click ----------
//   const handleAttachClick = () => {
//     fileInputRef.current?.click();
//   };

//   // ---------- send message ----------
//  const handleSend = async () => {
//   if ((!newMessage.trim() && !selectedFile) || !ticket || isSending) return;
//   setIsSending(true);
//   setUploadProgress(0);

//   try {
//     const formData = new FormData();
//     formData.append("message", newMessage.trim() || "فایل پیوست شد");
//     if (selectedFile) formData.append("file", selectedFile);

//     await simpleApiRequest({
//       url: `/ticket/${ticket.id}/new`,
//       method: "POST",
//       data: formData,
//       headers: {},
//       onUploadProgress: (event) => {
//         if (event?.loaded && event?.total) setUploadProgress(Math.round((event.loaded * 100) / event.total));
//       },
//     });

//     const tempMsgId = Date.now();
//     let tempUrl: string | undefined;

//     if (selectedFile) {
//       tempUrl = URL.createObjectURL(selectedFile);
//       setImageCache((prev) => ({ ...prev, [tempMsgId]: tempUrl }));
//     }
    

//     const newMsg: Message = {
//       id: tempMsgId,
//       text: newMessage.trim(),
//       isUser: true,
//       timestamp: new Date().toLocaleString("fa-IR"),
//       file: tempUrl,
//     };
//     setMessages((prev) => [...prev, newMsg]);

//     setNewMessage("");
//     setSelectedFile(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   } catch (err) {
//     console.error(err);
//     toast.error("خطا در ارسال پیام");
//   } finally {
//     setIsSending(false);
//     setUploadProgress(null);
//   }
// };


//   return (
//     <div className="flex-1 w-full h-full">
//       <div className="relative border border-gray21 rounded-[16px] h-[798px] flex flex-col overflow-hidden">
//         {ticket && <ChatHeader ticket={ticket} />}

//         <div className="relative flex-1 p-4 overflow-y-auto bg-cover bg-center" style={{ backgroundImage: `url(${isDark ? bgchatDark : bgChat})` }}>
//           <div className="relative z-10 flex flex-col gap-4">
//             {loading ? (
//               [1, 2, 3].map((i) => (
//                 <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
//                   <div dir="rtl" className="shadow rounded-xl px-3 w-[360px] h-[110px] relative flex-col bg-gray40 text-black1 animate-pulse">
//                     <div className="h-4 w-32 skeleton-bg rounded mt-4 mb-2"></div>
//                     <div className="h-4 w-64 skeleton-bg rounded mb-4"></div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               messages.map((msg) => (
//                 <div key={msg.id} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
//                   <div dir="rtl" className={`shadow px-3 w-[379px] relative flex-col ${msg.isUser
//                     ? "bg-black4 text-black1 rounded-tl-[8px] rounded-tr-[8px] rounded-bl-[8px]"
//                     : "bg-gray40 text-black1 rounded-tl-[8px] rounded-tr-[8px] rounded-br-[8px]"}`}>
                    
//                     {!msg.isUser && (
//                       <div dir="rtl" className="flex items-center gap-2 mb-2 mt-4">
//                         <img src={supportAvatar} alt="پشتیبانی" className="w-6 h-6 rounded-full" />
//                         <span className="text-xs text-black1">پشتیبانی (admin)</span>
//                       </div>
//                     )}

//                     {msg.text && <p dir="rtl" className="mt-4">{msg.text}</p>}

//                     {msg.file && (
//                       <div className="rounded-2xl w-fit p-2 mt-2">
//                         {imageCache[msg.id] ? (
//                           <img
//                             src={imageCache[msg.id]}
//                             alt="attachment"
//                             className="rounded-lg border border-gray21 w-[200px] h-[150px] object-cover cursor-pointer"
//                             onClick={() => setFullscreenImage(imageCache[msg.id])}
//                           />
//                         ) : (
//                           <div className="border rounded-lg border-gray21 animate-pulse w-[200px] h-[150px] skeleton-bg"></div>
//                         )}
//                       </div>
//                     )}

//                     <span dir="rtl" className="text-gray-400 block mt-4 text-right mb-4 text-[12px]">{convertDigitsToPersian(msg.timestamp)}</span>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//           {selectedFile && (
//             <div dir="rtl" className="mt-4 mb-2 mx-3">
//               <div className="flex flex-col rounded-2xl w-64 shadow bg-blue-100 p-3 gap-2">
//                 <div className="flex relative gap-2 items-center">
//                   <div className="w-full text-sm break-all">{selectedFile.name}</div>
//                   <button
//                     type="button"
//                     onClick={() => { setSelectedFile(null); if(fileInputRef.current) fileInputRef.current.value=""; }}
//                     className="flex text-xs bg-red-500 text-white rounded-full w-5 h-5 items-center justify-center hover:bg-red-600"
//                     title="حذف فایل"
//                   >
//                     <span className="w-4 h-4 icon-wrapper">
//                       <IconCloseButtun />
//                     </span>
//                   </button>
//                 </div>
//                 {isSending && uploadProgress !== null && (
//                   <div className="w-full h-1 bg-gray-300 rounded-full overflow-hidden">
//                     <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>

//         <div dir="rtl" className="p-3 flex gap-2 bg-white8">
//           <input
//             type="text"
//             placeholder="پیام خود را بنویسید..."
//             className="flex-1 px-3 py-2 focus:outline-none bg-white8 text-black0"
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             onKeyDown={(e) => { if(e.key==="Enter"){ e.preventDefault(); setTimeout(() => handleSend(), 0); } }}
//           />
//           <input type="file" ref={fileInputRef} accept=".jpg,.jpeg,.png" className="hidden" onChange={handleFileChange} />

//           <button className="text-gray39 pl-3" onClick={handleAttachClick}>
//             <span className="icon-wrapper w-[22px] hover:text-blue2 h-[22px]"><IconAttachFile /></span>
//           </button>

//           <button className="bg-blue15 text-white rounded-xl shadow w-[45px] h-[45px] hover:border-blue2 hover:border hover:text-blue2" onClick={handleSend} disabled={isSending}>
//             {isSending ? (
//               <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
//             ) : (
//               <span className="icon-wrapper w-[22px] h-[22px]"><IconSendMessage /></span>
//             )}
//           </button>
//         </div>
//       </div>

//       {fullscreenImage && (
//         <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={() => setFullscreenImage(null)}>
//           <img src={fullscreenImage} alt="fullscreen" className="max-h-full max-w-full rounded-lg" />
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatPanel;

