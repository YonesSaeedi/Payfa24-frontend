import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { apiRequest } from "../../utils/apiClient";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

type PieDataItem = {
  name: string;
  value: number;
  color?: string;
};

type PieChartResponse = {
  sum_balance_internal: number;
  sum_balance_dollar: number;
  balance_pie_chart: PieDataItem[];
  balance_wallet_internal: number;
};

export default function WalletPieChart() {
  const [data, setData] = useState<PieDataItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showItems, setShowItems] = useState(false);

  useEffect(() => {
    const fetchPieChart = async () => {
      try {
        setIsLoading(true);
        const response = await apiRequest<PieChartResponse>({
          url: "/wallets/crypto/portfolio/pie-chart",
        });

        const filteredData = response.balance_pie_chart.filter(item => item.value > 0);
        setData(filteredData);
      } catch (err) {
        toast.error(
          (err as AxiosError<{ msg: string }>)?.response?.data?.msg ||
            "دریافت اطلاعات نمودار با مشکل مواجه شد."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPieChart();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      setShowItems(true);
    }
  }, [data]);

  const generateBlueGradient = (num: number) => {
    const colors = [];
    for (let i = 0; i < num; i++) {
      const lightness = 80 - (i * 50) / (num - 1);
      colors.push(`hsl(210, 100%, ${lightness}%)`);
    }
    return colors;
  };

  const gradientColors = generateBlueGradient(data.length);

  const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="bg-white shadow-md p-2 rounded-md border"
        style={{
          position: "absolute",
          right: "-150px",   
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 1000,
        }}
      >
        <p className="font-bold">{payload[0].name}</p>
        <p>{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};
if (!isLoading && data.length === 0) {
  return null;
}
const ChartSkeleton = () => (
  <div className="w-[400px] h-[350px] flex items-center justify-center">
    <div className="w-48 h-48 rounded-full bg-gray-200 animate-pulse"></div>
  </div>
);
const ListSkeleton = () => (
  <div className="mt-4 lg:mt-0 lg:w-1/2 grid grid-cols-2 lg:grid-cols-1 gap-x-6 gap-y-3">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex  justify-center w-full gap-2">
        <div className="w-6 h-6 rounded-full bg-gray-300 animate-pulse flex-shrink-0"></div>
        <div className="h-3 w-48 bg-gray-300 rounded animate-pulse"></div>

      </div>
    ))}
  </div>
);



  return (
    <div className="mt-6 flex flex-col items-center  border border-gray21 rounded-xl shadow p-4 overflow-hidden">
      <h3 className="text-sm lg:text-lg lg:font-bold font-bold mb-4 text-right w-full m-2 lg:px-8 ">ترکیب دارایی‌ها</h3>
      <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-1 ">
        {isLoading ? (
          <ChartSkeleton />
        ) : (
          <PieChart width={400} height={350}>
           <Pie
  data={data}
  dataKey="value"
  nameKey="name"
  cx="50%"
  cy="50%"
  outerRadius={130}
  paddingAngle={3}
  label={({ percent }) =>
    percent && percent > 0.01 
      ? `${(percent * 100).toFixed(0)}%`
      : ""
  }
>
  {data.map((_, index) => (
    <Cell
      key={index}
      fill={gradientColors[index]}
      stroke="#fff"
      strokeWidth={2}
    />
  ))}
</Pie>

           <Tooltip content={<CustomTooltip />} />

          </PieChart>
        )}

        <div
          className={`
            mt-4 lg:mt-0 lg:w-1/2
            grid grid-cols-2 lg:grid-cols-1 gap-x-1  justify-items-start  gap-y-3
            overflow-hidden
          `}
        >
          {isLoading
            ?  (
                 <ListSkeleton />
              )
            : data.map((item, index) => (
                <div
                  key={item.name}
                  className={`
                    flex items-center gap-2 transform transition-all duration-500 min-w-0 
                    ${showItems ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
                  `}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <span
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: gradientColors[index] }}
                  ></span>
                  <span className="text-gray-700 font-medium truncate break-words">{item.name}</span>
                  <span className="text-gray-500 ml-1 flex-shrink-0">({item.value.toLocaleString()})</span>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}

