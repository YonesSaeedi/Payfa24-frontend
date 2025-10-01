import React, { useState } from "react";
import IconCloseMonitor from "../../assets/icons/connected-devices/IconCloseMonitor";
import IconDanger from "../../assets/icons/connected-devices/IconDanger";

interface Device {
  type: string;
  model: string;
  lastConnection: string;
  ip: string;
  status: "active" | "ended";
}

const devices: Device[] = [
  {
    type: "دسکتاپ",
    model: "Windows 10.0, Chrome",
    lastConnection: "11 مرداد 1404 | 23:33",
    ip: "198.00.938.11",
    status: "active",
  },
  {
    type: "موبایل",
    model: "Windows 10.0, Chrome",
    lastConnection: "11 مرداد 1404 | 23:33",
    ip: "198.00.938.11",
    status: "ended",
  },
  {
    type: "دسکتاپ",
    model: "Windows 10.0, Chrome",
    lastConnection: "11 مرداد 1404 | 23:33",
    ip: "198.00.938.11",
    status: "ended",
  },
];

const DeviceList: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <div dir="rtl" className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-black1 hidden lg:flex">دستگاه‌های متصل</h2>
        <button
          onClick={() => setShowModal(true)}
          className="w-full text-center justify-center lg:w-[187px] h-[40px] px-3 py-1 rounded-md text-sm transition bg-red6 text-red1 flex items-center gap-1"
        >
            <span className="w-5 h-5 icon-wrapper mr-2 ml-1">
            <IconCloseMonitor />
          </span>
          پایان تمام نشست‌ها
          
        </button>
      </div>


      <div dir="rtl" className="hidden lg:block overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead className="rounded-[8px] ">
            <tr className="bg-gray41 text-sm ">
              <th className="py-2 px-4 text-gray-500 rounded-tr-lg rounded-bl-lg">نوع دستگاه</th>
              <th className="py-2 px-4 text-gray-500">مدل دستگاه</th>
              <th className="py-2 px-4 text-gray-500">آخرین زمان اتصال</th>
              <th className="py-2 px-4 text-gray-500">IP</th>
              <th className="py-2 px-4 text-gray-500 rounded-br-lg"></th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device, idx) => (
              <tr key={idx} className="border-b border-gray21 text-black1">
                <td className="py-6 px-4">{device.type}</td>
                <td className="py-6 px-4">{device.model}</td>
                <td className="py-6 px-4">{device.lastConnection}</td>
                <td className="py-6 px-4">{device.ip}</td>
                <td className="py-6 px-4">
                  {device.status === "active" ? (
                    <span className="text-blue-500">نشست فعال</span>
                  ) : (
                    <span className="text-red-500">پایان نشست</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
      <div dir="rtl" className="lg:hidden flex flex-col gap-4">
        {devices.map((device, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-lg bg-gray27  borde border-gray2 shadow-sm`}
          >
            <div className="flex justify-end items-center mb-2 text-black1">
           
              {device.status === "active" ? (
                <span className="text-blue-500 text-sm">نشست فعال</span>
              ) : (
                <span className="text-red-500 text-sm">پایان نشست</span>
              )}
            </div>
            <div className="flex justify-between items-center pt-2 ">
               <div className="text-sm text-black1">{device.type}</div>
                  <div className="text-sm text-black1">{device.model}</div>
            </div>
            <div className="flex justify-between items-center pt-4">
              <div className="text-sm text-black1">{device.lastConnection}</div>
            <div className="text-sm text-black1">{device.ip}</div>
            </div>
            
          </div>
        ))}
      </div>


      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white8 rounded-lg shadow-lg p-6 w-96 text-center py-10">
            <div className="text-3xl text-blue-500 mb-4"><span className="w-12 h-12 icon-wrapper"><IconDanger/></span></div>
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
};

export default DeviceList;
