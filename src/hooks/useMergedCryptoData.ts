import { useMemo } from "react";
import useGetCryptoData from "./useGetCryptoData";
import useGetGeneralInfo from "./useGetGeneralInfo";
import { CryptoItem } from "../types/crypto";


export type MergedCrypto = CryptoItem;

const useMergedCryptoData = () => {
 
  const { data: cryptoData, isLoading: isCryptoLoading, error: cryptoError } = useGetCryptoData();
  const { data: generalInfo, isLoading: isGeneralLoading, error: generalError } = useGetGeneralInfo();
  const mergedData = useMemo(() => {
    if (!cryptoData || !generalInfo) return {};

   
    const generalMap = generalInfo.cryptocurrency?.reduce((acc, item) => {
      acc[item.symbol] = item;
      return acc;
    }, {} as Record<string, CryptoItem>);

   
    const result: Record<string, MergedCrypto> = {};
    for (const symbol of Object.keys(cryptoData)) {
      const base = cryptoData[symbol]; 
      const extra = generalMap?.[symbol]; 
      result[symbol] = extra ? { ...base, ...extra } : base;
    }

    return result;
  }, [cryptoData, generalInfo]);

 
  return {
    data: mergedData,                       
    isLoading: isCryptoLoading || isGeneralLoading, 
    error: cryptoError || generalError,   
  };
};

export default useMergedCryptoData;
