"use client";
import Calendar from "@/schemas/Calendar";

interface Props {
  calendar: Calendar;
  onPreview: (event: Calendar) => void;
}

const ItemView = ({ calendar, onPreview }: Props) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Event":
        return "border-purple-400";
      case "Task":
        return "border-orange-400";
      case "Schedule":
        return "border-blue-400";
      default:
        return "border-gray-400";
    }
  };

  return (
    <div
      onClick={() => onPreview(calendar)}
      className={`p-2 mb-2 bg-[#F7FCE0] rounded border-s-4 ${getTypeColor(
        calendar.type
      )} hover:shadow-md transition-shadow cursor-pointer`}
    >
      <div className="flex justify-between items-start mb-1">
        <div className="font-medium text-sm flex-1">{calendar.title}</div>
      </div>

      <div className="text-xs text-gray-600 mb-1">
        {calendar.time && <span className="font-medium">{calendar.time}</span>}
        <span className="ml-1">• {calendar.type}</span>
      </div>
    </div>
  );
};

export default ItemView;
