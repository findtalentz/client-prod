import CalendarView from "@/components/calendar/calendar-view";
import ApiResponse from "@/schemas/ApiRespose";
import Calendar from "@/schemas/Calendar";
import apiClient from "@/services/api-client";
import { AxiosError } from "axios";

const CalendarPage = async () => {
  try {
    const { data } = await apiClient.get<ApiResponse<Calendar[]>>("/calendars");
    return <CalendarView events={data.data} />;
  } catch (error) {
    if (error instanceof AxiosError) {
      <div>{error.message}</div>;
    }
  }
};

export default CalendarPage;
