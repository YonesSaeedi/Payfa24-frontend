// export interface TicketFormInputs {
//   title: string;
//   orderId: string;
//   description: string;
//   file: FileList;
// }

// export interface Order {
//   id: string;
//   coin: string;
//   type: "خرید" | "فروش" | "برداشت";
//   amount: string;
//   date: string;
//   icon:React.ReactNode
// }
export interface Ticket {
  id: string;
  title: string;
  description: string;
  date: string;
  status: "pending" | "answered" | "closed";
}
