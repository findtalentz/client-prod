export default interface Calendar {
  _id: string;
  title: string;
  type: "Task" | "Event" | "Schedule";
  date: Date;
  time: string;
  duration: number;
  description: string;
  location: string;
  isAllDay: boolean;
  status: "Pending" | "In Progress" | "Completed" | "Cancelled";
  note: string;
  createdBy: string;
  attendees: string[];
}
