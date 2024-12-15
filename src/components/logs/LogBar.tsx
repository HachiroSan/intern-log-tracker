import { CardFooter } from "@/components/ui/card";
import { calculateWorkingDays } from "@/lib/utils";
import { Log, WeekendSystem } from "@/types";
import { DateRange } from "react-day-picker";

export default function LogBar({
  logs,
  weekendSystem,
  dateRange,
}: {
  logs: Log[];
  weekendSystem: WeekendSystem;
  dateRange: DateRange;
}) {
  const totalWorkingDays =
    weekendSystem && dateRange
      ? calculateWorkingDays(weekendSystem, dateRange)
      : 0;
  return (
    <CardFooter>
      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 200% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
      <div className="w-full space-y-2">
        {dateRange.from || dateRange.to ? (
          <>
            <p className="text-sm text-muted-foreground">
              Total logged days: {logs?.length || 0} / {totalWorkingDays}{" "}
              (excluding weekends)
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="h-2.5 rounded-full"
                style={{
                  width: `${Math.min(
                    ((logs?.length || 0) / totalWorkingDays) * 100,
                    100
                  )}%`,
                  background:
                    "linear-gradient(90deg, #4ade80, #0ea5e9, #4ade80)",
                  backgroundSize: "200% 100%",
                  animation: "gradient 3s linear infinite",
                }}
              />
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Set your internship date range!
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="h-2.5 rounded-full"
                style={{
                  width: "0%",
                  background:
                    "linear-gradient(90deg, #4ade80, #0ea5e9, #4ade80)",
                  backgroundSize: "200% 100%",
                }}
              />
            </div>
          </>
        )}
      </div>
    </CardFooter>
  );
}
