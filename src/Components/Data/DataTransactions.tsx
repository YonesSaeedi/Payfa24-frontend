// src/data/transactions.ts
import React from "react";
import TravelaIcon from "../../assets/icons/Home/CryptoTableIcon/TravelaIcon";
import IconTravella from "../../assets/icons/transaction-history/IconTravella";
import IconIran from "../../assets/icons/transaction-history/IconIran";
import TKOIcon from "../../assets/icons/market/CryptoBox/TKOIcon";
import IconTravellaRed from "../../assets/icons/transaction-history/IconTravellaRed";
import IconUos from "../../assets/icons/transaction-history/IconUos";

export interface Transaction {
  id: number;
  currencyName: string;
  currencySymbol: string;
  currencyIcon: React.ReactElement;
  amount: string;
  type: "واریز" | "برداشت" | "خرید" | "فروش";
  status: "در حال بررسی" | "انجام شده" | "رد شده";
  date: string;
  time: string;
}

export const transactions: Transaction[] = [
  {
    id: 1,
    currencyName: "تراولا",
    currencySymbol: "AVA",
    currencyIcon: <IconTravella />,
    amount: "15 AVA",
    type: "واریز",
    status: "در حال بررسی",
    date: "1404/08/01",
    time: "13:34",
  },
  {
    id: 2,
    currencyName: "تومان",
    currencySymbol: "IRT",
    currencyIcon: <IconIran />,
    amount: "1,000,000 تومان",
    type: "واریز",
    status: "انجام شده",
    date: "1404/08/01",
    time: "13:34",
  },
  {
    id: 3,
    currencyName: "توکو توکن",
    currencySymbol: "TKO",
    currencyIcon: <TKOIcon />,
    amount: "15 TKO",
    type: "خرید",
    status: "رد شده",
    date: "1404/08/01",
    time: "13:34",
  },
  {
    id: 4,
    currencyName: "تومان",
    currencySymbol: "VET",
    currencyIcon: <IconIran />,
    amount: "15 VET",
    type: "برداشت",
    status: "انجام شده",
    date: "1404/08/01",
    time: "13:34",
  },
  {
    id: 5,
    currencyName: "تراولا",
    currencySymbol: "AVA",
    currencyIcon: <TravelaIcon />,
    amount: "1,000,000 تومان",
    type: "واریز",
    status: "انجام شده",
    date: "1404/08/01",
    time: "13:34",
  },
  {
    id: 6,
    currencyName: "تراولا",
    currencySymbol: "AVA",
    currencyIcon: <IconTravellaRed />,
    amount: "1,000,000 تومان",
    type: "واریز",
    status: "انجام شده",
    date: "1404/08/01",
    time: "13:34",
  },
  {
    id: 7,
    currencyName: "تومان",
    currencySymbol: "IRT",
    currencyIcon: <IconIran />,
    amount: "1,000,000 تومان",
    type: "واریز",
    status: "انجام شده",
    date: "1404/08/01",
    time: "13:34",
  },
  {
    id: 8,
    currencyName: "وی چاین",
    currencySymbol: "UOS",
    currencyIcon: <IconUos />,
    amount: "1,000,000 تومان",
    type: "واریز",
    status: "انجام شده",
    date: "1404/08/01",
    time: "13:34",
  },
  {
    id: 9,
    currencyName: "تومان",
    currencySymbol: "IRT",
    currencyIcon: <IconIran />,
    amount: "1,000,000 تومان",
    type: "واریز",
    status: "انجام شده",
    date: "1404/08/01",
    time: "13:34",
  },
  {
    id: 10,
    currencyName: "تراولا",
    currencySymbol: "AVA",
    currencyIcon: <IconTravella />,
    amount: "1,000,000 تومان",
    type: "واریز",
    status: "انجام شده",
    date: "1404/08/01",
    time: "13:34",
  },
];
