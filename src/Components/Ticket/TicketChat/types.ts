export interface Ticket {
  id: number;
  title: string;
  status: "answered" | "pending" | "closed";
  date: string;
}
