import { useMemo } from "react";
import useGetGeneralInfo from "../../hooks/useGetGeneralInfo";
import { CryptoDataMap } from "../../types/crypto";

type MergeCryptoDataProps = {
  // هوکی که داده متغیر رو برمی‌گردونه
  useVariableDataHook: () => { data: CryptoDataMap | null; isLoading: boolean };
  children: (mergedData: CryptoDataMap, isLoading: boolean) => JSX.Element;
};

const MergedCryptoData = ({ useVariableDataHook, children }: MergeCryptoDataProps) => {
  const { data: generalData } = useGetGeneralInfo();
  const { data: variableData, isLoading: isVariableLoading } = useVariableDataHook();

  // مپ کردن generalData به object با key = symbol
  const mappedGeneralData: CryptoDataMap = useMemo(() => {
    return generalData?.cryptocurrency?.reduce((acc, item) => {
      acc[item.symbol] = item;
      return acc;
    }, {} as CryptoDataMap) ?? {};
  }, [generalData]);

  // تابع merge
  const mergeCryptoData = (cryptosConstantInfo: CryptoDataMap, cryptosVariableInfo: CryptoDataMap) => {
    const result: CryptoDataMap = {};
    for (const key of Object.keys(cryptosVariableInfo)) {
      if (cryptosConstantInfo[key]) result[key] = { ...cryptosConstantInfo[key], ...cryptosVariableInfo[key] };
    }
    return result;
  };

  const mergedCryptosData = useMemo(() => {
    if (mappedGeneralData && variableData) {
      return mergeCryptoData(mappedGeneralData, variableData);
    }
    return {};
  }, [mappedGeneralData, variableData]);

  return children(mergedCryptosData, isVariableLoading);
};

export default MergedCryptoData;
