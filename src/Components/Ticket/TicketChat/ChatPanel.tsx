import React, { useState } from "react";
import { Ticket } from "./types";
import bgChat from "../../../assets/images/Ticket/bgchat.jpg";
import supportAvatar from "../../../assets/images/Ticket/avator.jpg";
import { Paperclip, FileText, RefreshCw, CheckCircle, Clock, XCircle } from "lucide-react";
import IconSendMessage from "../../../assets/icons/ticket/IconSendMessage";
import IconAttachFile from "../../../assets/icons/ticket/IconAttachFile";

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
    type: "pdf";
    name: string;
    size: string;
  };
  system?: boolean;
}

const ChatHeader: React.FC<{ ticket: Ticket }> = ({ ticket }) => {
  const renderStatus = (status: Ticket["status"]) => {
    switch (status) {
      case "answered":
        return (
          <div className="flex items-center justify-center h-full w-full">
            <span className="flex items-center justify-center gap-1 bg-green8 text-green2 w-[140px] h-[33px] rounded-[4px]">
              پاسخ داده شده
              <CheckCircle size={16}/> 
            </span>
          </div>
        );
      case "pending":
        return (
        <div className="flex items-center justify-center h-full w-full">
          <span className="flex items-center justify-center gap-1 bg-orange4 text-orange-500 w-[140px] h-[33px] rounded-[4px]">
            در حال بررسی
            <Clock size={16}/> 
          </span>
        </div>
        );
      case "closed":
        return (
       <div className="flex items-center justify-center h-full w-full">
         <span className="flex items-center justify-center gap-1 bg-red6 text-red-500 w-[126px] h-[33px] rounded-[4px]">
          بسته شده
           <XCircle size={16}/> 
         </span>
       </div>
        );
    }
  };

  return (
    <div className="border-b border-b-gray21 bg-gray37  rounded-t-[16px] px-4 py-3">
    
      <div className="flex items-center justify-between flex-row-reverse">
        <div dir="rtl" className="flex flex-col">
          <span className="text-gray5 text-sm">شماره تیکت: #{ticket.id}</span>
          <span className="font-medium text-black1 mt-2 text-base">{ticket.title}</span>
        </div>
        <div>{renderStatus(ticket.status)}</div>
      </div>

      
    </div>
  );
};


// const ChatPanel: React.FC<ChatPanelProps> = ({ ticket }) => {
//   const [newMessage, setNewMessage] = useState("");
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: 1,
//       text: "چرا بعضی از خرید هایی که میخواهم انجام بدهم به مشکلات مختلفی از جمله خرید و فروش اشتباه میشود؟",
//       isUser: true,
//       timestamp: "12:03 | 12 اردیبهشت 1404",
//     },
//     {
//       id: 2,
//       text: "چرا بعضی از خرید هایی که میخواهم انجام بدهم به مشکلات مختلفی از جمله خرید و فروش اشتباه میشود؟",
//       isUser: false,
//       senderName: "محمد رضوی",
//       senderRole: "پشتیبانی",
//       timestamp: "12:03 | 12 اردیبهشت 1404",
//     },
//     {
//       id: 3,
//       text: "تیکت شما بروز رسانی شد",
//       isUser: false,
//       timestamp: "12:04 | 12 اردیبهشت 1404",
//       system: true,
//     },
//     {
//       id: 4,
//       isUser: false,
//       senderName: "محمد رضوی",
//       senderRole: "پشتیبانی",
//       timestamp: "12:05 | 12 اردیبهشت 1404",
//       attachment: {
//         type: "pdf",
//         name: "پیش فاکتور",
//         size: "2MB",
//       },
//     },
//   ]);

//   const handleSend = () => {
//     if (!newMessage.trim()) return;

//     const message: Message = {
//       id: Date.now(),
//       text: newMessage,
//       isUser: true,
//       timestamp: new Date().toLocaleString("fa-IR", {
//         hour: "2-digit",
//         minute: "2-digit",
//         year: "numeric",
//         month: "2-digit",
//         day: "2-digit",
//       }),
//     };

//     setMessages([...messages, message]);
//     setNewMessage("");
//   };

//   return (
//     <div className="flex-1 ">
//       {ticket ? (
//         <div className="border border-gray21  rounded-[16px] h-[798px]  flex flex-col  overflow-hidden">
   
//           <ChatHeader ticket={ticket} />

       
//           <div className="relative flex-1 p-4 overflow-y-auto">
//             <div
//               className="absolute inset-0 bg-cover bg-center"
//               style={{ backgroundImage: `url(${bgChat})`, opacity: 0.1 }}
//             />
          
//             <div className="relative z-10 flex flex-col gap-4">
//               {messages.map((msg) =>
//                 msg.system ? (
//                   <div
//                     key={msg.id}
//                     className="text-blue-600 text-sm flex items-center gap-1 justify-center"
//                   >
//                     <RefreshCw size={14} /> {msg.text}
//                   </div>
//                 ) : (
//                   <div 
//                     key={msg.id}
//                     className={`flex ${
//                       msg.isUser ? "justify-end" : "justify-start"
//                     }`}
//                   >
               
//                     <div dir=" rtl"
//                       className={`shadow rounded-xl px-3 w-[379px] relative flex-col justify-end ${
//                         msg.isUser
//                           ? "bg-black4 text-black1"
//                           : "bg-gray40 text-black1"
//                       }`}
//                     >
                    
//                       {!msg.isUser && (
//                         <div dir="rtl" className="flex items-center gap-2 mb-2 mt-4">
//                           <img
//                             src={supportAvatar}
//                             alt="پشتیبانی"
//                             className="w-6 h-6 rounded-full"
//                           />
//                           <span className="text-xs text-black1">
//                             {msg.senderName} ({msg.senderRole})
//                           </span>
//                         </div>
//                       )}

//                       {msg.text && <p dir="rtl" className="mt-4">{msg.text}</p>}
//                       {msg.attachment && (
//                         <div className="flex items-center gap-2 border rounded-lg p-2 mt-1 bg-white">
//                           <FileText size={20} className="text-blue-600" />
//                           <div className="flex flex-col text-xs">
//                             <span>{msg.attachment.name}.PDF</span>
//                             <span className="text-gray-400">
//                               {msg.attachment.size}
//                             </span>
//                           </div>
//                         </div>
//                       )}

//                       <span dir="rtl" className="text-[10px] text-gray-400 block mt-4 text-right mb-4">
//                         {msg.timestamp}
//                       </span>
//                     </div>
//                   </div>
//                 )
//               )}
//             </div>
//           </div>

//           {/* ورودی پیام */}
//           <div  dir="rtl" className="p-3  flex gap-2 bg-white8">
//             <input 
//               type="text"
//               placeholder="پیام خود را بنویسید..."
//               className="flex-1  px-3 py-2 focus:outline-none bg-white8"
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && handleSend()}
//             />
//             <button className=" text-gray39 pl-3"> 
//               <span className="icon-wrapper w-[22px] text-blue2 h-[22px]">
//                 <IconAttachFile/>
//               </span>
              
//             </button>
//             <button
//               className="bg-blue15 text-white  rounded-xl shadow w-[45px] h-[45px]"
//               onClick={handleSend}
//             >
//               <span className="icon-wrapper w-[22px] text-blue2 h-[22px]">
//    <IconSendMessage/>
//               </span>
         
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="flex-1 flex items-center justify-center text-gray-400 text-center h-[798px]">
//           لطفا یک تیکت انتخاب کنید
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatPanel;
 const ChatPanel: React.FC<ChatPanelProps> = ({ ticket }) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "چرا بعضی از خرید هایی که میخواهم انجام بدهم به مشکلات مختلفی از جمله خرید و فروش اشتباه میشود؟",
      isUser: true,
      timestamp: "12:03 | 12 اردیبهشت 1404",
    },
    {
      id: 2,
      text: "چرا بعضی از خرید هایی که میخواهم انجام بدهم به مشکلات مختلفی از جمله خرید و فروش اشتباه میشود؟",
      isUser: false,
      senderName: "محمد رضوی",
      senderRole: "پشتیبانی",
      timestamp: "12:03 | 12 اردیبهشت 1404",
    },
    {
      id: 3,
      text: "تیکت شما بروز رسانی شد",
      isUser: false,
      timestamp: "12:04 | 12 اردیبهشت 1404",
      system: true,
    },
    {
      id: 4,
      isUser: false,
      senderName: "محمد رضوی",
      senderRole: "پشتیبانی",
      timestamp: "12:05 | 12 اردیبهشت 1404",
      attachment: {
        type: "pdf",
        name: "پیش فاکتور",
        size: "2MB",
      },
    },
  ]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

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
  };

  // تغییر مهم: همیشه یک تیکت فرضی بسازیم اگر ticket null باشد
  // تغییر مهم: همیشه یک تیکت فرضی بسازیم اگر ticket null باشد
const currentTicket: Ticket = ticket || {
  id: 0,
  title: "تیکت پیش‌فرض",
  status: "pending",
  date: new Date().toISOString(), // اضافه کردن فیلد date
};


  return (
    <div className="flex-1">
      <div className="border border-gray21 rounded-[16px] h-[798px] flex flex-col overflow-hidden">
        <ChatHeader ticket={currentTicket} />

        <div className="relative flex-1 p-4 overflow-y-auto">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgChat})`, opacity: 0.1 }}
          />

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
                          {msg.senderName} ({msg.senderRole})
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