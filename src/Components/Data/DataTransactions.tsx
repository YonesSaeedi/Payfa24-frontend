// src/data/transactions.ts
import React from "react";
import TravelaIcon from "../../assets/icons/Home/CryptoTableIcon/TravelaIcon";
import IconTravella from "../../assets/icons/transaction-history/IconTravella";
import IconIran from "../../assets/icons/transaction-history/IconIran";
import TKOIcon from "../../assets/icons/market/CryptoBox/TKOIcon";
import IconTravellaRed from "../../assets/icons/transaction-history/IconTravellaRed";
import IconUos from "../../assets/icons/transaction-history/IconUos";

export interface Transaction {
  id: string;
  currencyName: string;
  currencySymbol: string;
  currencyIcon: React.ReactElement;
  amount: string;          
  total: string;          
  fee: string;             
  memoTag: string;        
  code: string;            
  type: "واریز" | "برداشت" | "خرید" | "فروش";
  status: "انجام شده" | "درحال بررسی" | "رد شده";
  date: string;
  time: string;
}

export const transactions: Transaction[] = [
  {
    id: "1",
    currencyName: "تراولا",
    currencySymbol: "AVA",
    currencyIcon: <IconTravella />,
    amount: "15 AVA",
    total: "150,000 تومان",
    fee: "0.1 AVA",
    memoTag: "Memo-AVA-15",
    code: "CODE-AVA-001",
    type: "واریز",
    status: "درحال بررسی",
    date: "1404/08/01",
    time: "13:34",
  },
  {
    id: "2",
    currencyName: "تومان",
    currencySymbol: "IRT",
    currencyIcon: <IconIran />,
    amount: "1,000,000 تومان",
    total: "1,000,000 تومان",
    fee: "0 تومان",
    memoTag: "-",
    code: "CODE-IRT-002",
    type: "واریز",
    status: "انجام شده",
    date: "1404/08/01",
    time: "13:34",
  },
  {
    id: "3",
    currencyName: "توکو توکن",
    currencySymbol: "TKO",
    currencyIcon: <TKOIcon />,
    amount: "15 TKO",
    total: "1,500,000 تومان",
    fee: "0.05 TKO",
    memoTag: "Memo-TKO-15",
    code: "CODE-TKO-003",
    type: "خرید",
    status: "رد شده",
    date: "1404/08/01",
    time: "13:34",
  },
  {
    id: "4",
    currencyName: "تومان",
    currencySymbol: "VET",
    currencyIcon: <IconIran />,
    amount: "15 VET",
    total: "300,000 تومان",
    fee: "0.2 VET",
    memoTag: "-",
    code: "CODE-VET-004",
    type: "برداشت",
    status: "انجام شده",
    date: "1404/08/01",
    time: "13:34",
  },
  {
    id: "5",
    currencyName: "تراولا",
    currencySymbol: "AVA",
    currencyIcon: <TravelaIcon />,
    amount: "1,000,000 تومان",
    total: "1,000,000 تومان",
    fee: "2,000 تومان",
    memoTag: "Memo-AVA-1000",
    code: "CODE-AVA-005",
    type: "واریز",
    status: "انجام شده",
    date: "1404/08/01",
    time: "13:34",
  },
  {
    id: "6",
    currencyName: "تراولا",
    currencySymbol: "AVA",
    currencyIcon: <IconTravellaRed />,
    amount: "1,000,000 تومان",
    total: "1,000,000 تومان",
    fee: "1,500 تومان",
    memoTag: "Memo-AVA-1001",
    code: "CODE-AVA-006",
    type: "واریز",
    status: "انجام شده",
    date: "1404/08/01",
    time: "13:34",
  },
  {
    id: "7",
    currencyName: "تومان",
    currencySymbol: "IRT",
    currencyIcon: <IconIran />,
    amount: "1,000,000 تومان",
    total: "1,000,000 تومان",
    fee: "0 تومان",
    memoTag: "-",
    code: "CODE-IRT-007",
    type: "واریز",
    status: "انجام شده",
    date: "1404/08/01",
    time: "13:34",
  },
  {
    id: "8",
    currencyName: "وی چاین",
    currencySymbol: "UOS",
    currencyIcon: <IconUos />,
    amount: "500 UOS",
    total: "50,000 تومان",
    fee: "1 UOS",
    memoTag: "Memo-UOS-500",
    code: "CODE-UOS-008",
    type: "واریز",
    status: "انجام شده",
    date: "1404/08/01",
    time: "13:34",
  },
  {
    id: "9",
    currencyName: "تومان",
    currencySymbol: "IRT",
    currencyIcon: <IconIran />,
    amount: "2,000,000 تومان",
    total: "2,000,000 تومان",
    fee: "5,000 تومان",
    memoTag: "-",
    code: "CODE-IRT-009",
    type: "واریز",
    status: "انجام شده",
    date: "1404/08/01",
    time: "13:34",
  },
  {
    id: "10",
    currencyName: "تراولا",
    currencySymbol: "AVA",
    currencyIcon: <IconTravella />,
    amount: "2,500 AVA",
    total: "2,500 AVA",
    fee: "0.25 AVA",
    memoTag: "Memo-AVA-2500",
    code: "CODE-AVA-010",
    type: "واریز",
    status: "انجام شده",
    date: "1404/08/01",
    time: "13:34",
  },
];
