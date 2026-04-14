"use client";

interface CalendarDayCellProps {
  date: Date;
  tasks?: { name: string; type: "fertilizer" | "weed-pest" | "mechanical" }[];
  isToday?: boolean;
  isOverseedingWindow?: boolean;
  onClick?: () => void;
}

const taskColor: Record<string, string> = {
  fertilizer: "bg-lime",
  "weed-pest": "bg-orange",
  mechanical: "bg-[#4A90D9]",
};

export default function CalendarDayCell({
  date,
  tasks,
  isToday,
  isOverseedingWindow,
  onClick,
}: CalendarDayCellProps) {
  const day = date.getDate();

  return (
    <button
      onClick={onClick}
      className={`relative flex h-12 w-full flex-col items-center justify-start rounded-lg p-1 text-xs transition-colors hover:bg-lime-light/50 ${
        isOverseedingWindow ? "bg-lime-light" : "bg-white"
      } ${isToday ? "ring-2 ring-forest" : ""}`}
    >
      <span
        className={`font-mono text-[11px] ${
          isToday ? "font-bold text-forest" : "text-charcoal"
        }`}
      >
        {day}
      </span>
      {tasks && tasks.length > 0 && (
        <div className="flex gap-0.5 mt-0.5">
          {tasks.slice(0, 3).map((task, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${taskColor[task.type]}`}
              title={task.name}
            />
          ))}
        </div>
      )}
    </button>
  );
}
