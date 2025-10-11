import { useMemo } from "react";
import useGetGeneralInfo from "./useGetGeneralInfo";
import useGetCryptoData from "./useGetCryptoData";
import { CryptoItem } from "../types/crypto";

const useMergedCryptoList = () => {
  const {
    data: generalInfo,
    isLoading: isGeneralLoading,
    error: generalError,
  } = useGetGeneralInfo();

  const {
    data: cryptoData,
    isLoading: isCryptoLoading,
    error: cryptoError,
  } = useGetCryptoData();

  const mergedData = useMemo(() => {
    if (!cryptoData) return [];

    const generalList = generalInfo?.cryptocurrency ?? [];

    return Object.values(cryptoData).map((cryptoItem) => {
      const match = generalList.find(
        (g) => g.symbol === cryptoItem.symbol
      );

      return {
        ...cryptoItem, // مبنای اصلی
        ...match,      // در صورت وجود در generalInfo، با آن مرج می‌شود
      } as CryptoItem;
    });
  }, [cryptoData, generalInfo]);

  const isLoading = isGeneralLoading || isCryptoLoading;
  const error = generalError || cryptoError;

  return { data: mergedData, isLoading, error };
};

export default useMergedCryptoList;
