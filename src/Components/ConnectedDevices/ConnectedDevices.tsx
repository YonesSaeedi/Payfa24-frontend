import React, { useEffect, useState } from "react";
import IconCloseMonitor from "../../assets/icons/connected-devices/IconCloseMonitor";
import IconDanger from "../../assets/icons/connected-devices/IconDanger";
import { apiRequest } from "../../utils/apiClient";


interface Session {
  browser?: string;
  created_at?: string;
  device?: string;
  expires_at?: string;
  id: string;
  is_current: boolean;
  last_ip?: string;
  last_used_at?: string;
  login_at?: string;
  login_ip?: string;
  name?: string;
  os?: string;
}

interface SessionsResponse {
  sessions: Session[];
}

export default function DeviceList() {
  const [activeSessions, setActiveSessions] = React.useState<Session[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [showModal, setShowModal] = useState(false);

  const fetchActiveSessions = async () => {
    setIsLoading(true)
    try {
      const response = await apiRequest<SessionsResponse>({ url: "/api/auth/sessions" });
      setActiveSessions(response.sessions);
    } catch (error) {
      console.error("Error fetching active sessions:", error);
    }
    finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    fetchActiveSessions();
  }, []);

  console.log("activeSessions", activeSessions);


  const handleEndAllSessions = async () => {
    setIsSubmitting(true);
    try {
      await apiRequest({ url: "/api/auth/sessions/revoke-others", method: "POST" });
      fetchActiveSessions();
    } catch (error) {
      console.error("Error ending all sessions:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEndSession = async (token_id: string) => {
    setIsSubmitting(true);
    try {
      await apiRequest({ url: `/api/auth/sessions/revoke`, method: "POST", data: { token_id } });
      fetchActiveSessions();
    } catch (error) {
      console.error("Error ending session:", error);
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
// <<<<<<< HEAD
//     <div>
//       <div dir="rtl" className="flex justify-between items-center mb-6">
//         <h2 className="text-lg font-semibold text-black1 hidden lg:flex">دستگاه‌های متصل</h2>
//         <button
//           onClick={() => setShowModal(true)}
//           className="w-full text-center justify-center lg:w-[187px] h-[40px] px-3 py-1 rounded-md text-sm transition bg-red6 text-red1 flex items-center gap-1"
//         >
//             <span className="w-5 h-5 icon-wrapper mr-2 ml-1">
//             <IconCloseMonitor />
//           </span>
//           پایان تمام نشست‌ها
          
//         </button>
//       </div>


//       <div dir="rtl" className="hidden lg:block overflow-x-auto">
//         <table className="w-full text-right border-collapse">
//           <thead className="rounded-[8px] ">
//             <tr className="bg-gray41 text-sm ">
//               <th className="py-2 px-4 text-gray-500 rounded-tr-lg rounded-bl-lg">نوع دستگاه</th>
//               <th className="py-2 px-4 text-gray-500">مدل دستگاه</th>
//               <th className="py-2 px-4 text-gray-500">آخرین زمان اتصال</th>
//               <th className="py-2 px-4 text-gray-500">IP</th>
//               <th className="py-2 px-4 text-gray-500 rounded-br-lg"></th>
//             </tr>
//           </thead>
//           <tbody>
//             {devices.map((device, idx) => (
//               <tr key={idx} className="border-b border-gray21 text-black1">
//                 <td className="py-6 px-4">{device.type}</td>
//                 <td className="py-6 px-4">{device.model}</td>
//                 <td className="py-6 px-4">{device.lastConnection}</td>
//                 <td className="py-6 px-4">{device.ip}</td>
//                 <td className="py-6 px-4">
//                   {device.status === "active" ? (
//                     <span className="text-blue-500">نشست فعال</span>
//                   ) : (
//                     <span className="text-red-500">پایان نشست</span>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

      
//       <div dir="rtl" className="lg:hidden flex flex-col gap-4">
//         {devices.map((device, idx) => (
//           <div
//             key={idx}
//             className={`p-4 rounded-lg bg-gray27  borde border-gray2 shadow-sm`}
// =======
    <div className="base-style gap-5" dir="rtl">
      <div className="bg-secondary w-full h-full rounded-2xl gap-5 py-7 px-5 flex flex-col">
        {/* Header */}
        <div dir="rtl" className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-black1 hidden lg:flex">دستگاه‌های متصل</h2>
          <button
            onClick={() => setShowModal(true)}
            className="w-full text-center justify-center lg:w-[187px] h-[40px] px-3 py-1 rounded-md text-sm transition bg-red6 text-red1 flex items-center gap-1" >
            <span className="w-5 h-5 icon-wrapper mr-2 ml-1">
              <IconCloseMonitor />
            </span>
            پایان تمام نشست‌ها

          </button>
        </div>

        {/* body */}
        <div className="hidden lg:flex flex-col w-full self-center">
          <div className="w-full py-2 grid grid-cols-5 bg-gray41 text-sm rounded-[10px] ">
            <span className=" font-normal text-center">نوع دستگاه</span>
            <span className=" font-normal text-center">مدل دستگاه</span>
            <span className=" font-normal text-center">آخرین زمان اتصال</span>
            <span className=" font-normal text-center">IP</span>
            <span className=" font-normal text-center">عملیات</span>
          </div>

          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="w-full py-2 grid grid-cols-5 rounded-[10px] my-2">
                <span className="w-12 h-4 mx-auto skeleton-bg" />
                <span className="w-12 h-4 mx-auto skeleton-bg" />
                <span className="w-20 h-4 mx-auto skeleton-bg" />
                <span className="w-16 h-4 mx-auto skeleton-bg" />
                <span className="w-10 h-4 mx-auto skeleton-bg" />
              </div>
            ))
          ) : (
            activeSessions.map((items) => {
              return (
                <div className="flex flex-col gap-1">

                 
                <div
                  key={items.id}
                  className="w-full py-2 grid grid-cols-5 rounded-[10px] items-center text-black1"
                >
                  <span className="text-xs font-normal text-center">{items?.browser}</span>
                  <span className="text-xs font-normal text-center">
                    {items?.os}
                    {items?.device && items.device !== "0" ? `-${items.device}` : ""}
                  </span>
                  <span className="text-xs font-normal text-center">{items?.last_used_at}</span>
                  <span className="text-xs font-normal text-center">{items?.last_ip}</span>
                  <span
                    className={`text-xs font-semibold text-center p-2 rounded-md transition duration-300 ${items.is_current ? "text-blue-500" : "text-rose-500 cursor-pointer hover:bg-rose-500 hover:text-white"
                      }`}
                    onClick={() => {
                      if (!items.is_current) handleEndSession(items.id);
                    }}
                  >
                    {items.is_current ? "نشست فعال" : "پایان نشست"}
                  </span>
                </div>
                 <hr className="bg-gray21"/>
                </div>
              );
            })
          )}
        </div>

        {/* body Mobile*/}
        <div className="flex lg:hidden flex-col w-full self-center">
          {isLoading ? (
            [...Array(2)].map((_, i) => (
              <div
                key={i}
                className="w-full flex flex-col bg-third p-2 rounded-[10px] my-2 gap-2"
              >
                <div className="flex w-full items-center justify-between text-xs font-normal">
                  <span className="w-1/2 h-3 skeleton-bg rounded" />
                  <span className="w-1/2 h-3 skeleton-bg rounded" />
                </div>

                <hr className="border-border" />

                <div className="flex w-full items-center justify-between text-xs font-normal">
                  <span className="w-1/2 h-3 skeleton-bg rounded" />
                  <span className="w-1/2 h-3 skeleton-bg rounded" />
                </div>

                <hr className="border-border" />

                <div className="flex w-full items-center justify-between text-xs font-normal">
                  <span className="w-1/2 h-3 skeleton-bg rounded" />
                  <span className="w-1/2 h-3 skeleton-bg rounded" />
                </div>

                <hr className="border-border" />

                <div className="flex w-full items-center justify-between text-xs font-normal">
                  <span className="w-1/2 h-3 skeleton-bg rounded" />
                  <span className="w-1/2 h-3 skeleton-bg rounded" />
                </div>

                <hr className="border-border" />

                <div className="flex w-full justify-end">
                  <span className="w-24 h-6 skeleton-bg rounded mx-1" />
                </div>
              </div>
            ))
          ) : (
            activeSessions.map((items) => (
              <div
                key={items.id}
                className="w-full flex flex-col p-4 rounded-lg bg-gray27  shadow-sm my-2 gap-2"
              >
                <button className=" text-end">
                  <span
                    className={`text-xs font-semibold text-center ${items.is_current ? "text-blue-500" : "text-red-500 cursor-pointer"
                      }`}
                    onClick={() => {
                      if (!items.is_current) handleEndSession(items.id);
                    }}
                  >
                    {items.is_current ? "نشست فعال" : "پایان نشست"}
                  </span>
                </button>
                <div className="flex w-full items-center justify-between text-xs font-normal">
                  <span>نوع دستگاه</span>
                  <span>{items?.browser}</span>
                </div>



                <div className="flex w-full items-center justify-between text-xs font-normal">
                  <span>مدل دستگاه</span>
                  <span>
                    {items?.os}
                    {items?.device && items.device !== "0" ? `-${items.device}` : ""}
                  </span>
                </div>



                <div className="flex w-full items-center justify-between text-xs font-normal">
                  <span>آخرین زمان اتصال</span>
                  <span>{items?.last_used_at}</span>
                </div>



                <div className="flex w-full items-center justify-between text-xs font-normal">
                  <span>IP</span>
                  <span>{items?.last_ip}</span>
                </div>


              </div>
            ))
          )}
        </div>


      </div>


      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white8 rounded-lg shadow-lg p-6 w-96 text-center py-10">
            <div className="text-3xl text-blue-500 mb-4"><span className="w-12 h-12 icon-wrapper"><IconDanger /></span></div>
            <h3 className="text-lg font-semibold mb-2 text-black1">پایان نشست</h3>
            <p className="text-gray5 mb-6">
              آیا از حذف این نشست مطمئن هستید؟
            </p>
            <div className="flex justify-between gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 rounded-[12px] border border-blue2 text-blue2 hover:bg-gray-100"
              >
                انصراف
              </button>
              <button
                onClick={() => {
                  handleEndAllSessions()
                  setShowModal(false);
                }}
                className="flex-1 py-2 rounded-[12px] bg-blue-500 text-white hover:bg-blue-600"
              >
                پایان نشست
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
