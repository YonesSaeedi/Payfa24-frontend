
export interface Ticket {
  id: string;
  title: string;
  description: string;
  date: string;
  status: "pending" | "answered" | "closed";
}
