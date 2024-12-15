import type { Log } from "@/types";
import { formatDate } from "@/lib/utils";

interface LogListProps {
  logs: Log[];
  selectedLog: Log | null;
  setSelectedLog: (log: Log | null) => void;
}

export default function LogList({
  logs,
  selectedLog,
  setSelectedLog,
}: LogListProps) {
  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-4">Recent Logs</h2>
      {logs.length === 0 ? (
        <p className="text-muted-foreground">No activities logged yet.</p>
      ) : (
        <ul className="space-y-2">
          {logs.map((log) => (
            <li
              key={log.id}
              className="border-b pb-2 hover:bg-gray-100 p-2 rounded cursor-pointer transition-colors"
              onClick={() => setSelectedLog(log)}
            >
              <div className="flex gap-2">
                <strong className="shrink-0">{formatDate(log.date)}:</strong>
                <span className="truncate max-w-full inline-block align-middle">
                  {log.activity}
                </span>
                {selectedLog?.id === log.id && (
                  <span className="ml-2 text-sm text-blue-500">(editing)</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
