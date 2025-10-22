export  interface TicketFormInputs {
  title: string;
  orderId: string;
  description: string;
  file?: FileList;
}

export  interface TicketNewResponse {
  status?: boolean;
  msg?: string;
  subject: string;
  order: number;
  message: string;
  file: string;
}

export interface Order {
  id: string;
  coin: string;
  type: "خرید" | "فروش" | "برداشت" | "واریز";
  amount: string;
  date: string;
  icon: React.ReactNode;
}

export interface TicketFormInputs {
  title: string;
  orderId: string;
  description: string;
  file: FileList;
}

export interface Order {
  id: string;
  coin: string;
  type: "خرید" | "فروش" | "برداشت" | "واریز";
  amount: string;
  date: string;
  icon: React.ReactNode;
}
