"use client";

import { format } from "date-fns";
import { Calendar, Clock, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LogForm from "@/components/logs/LogForm";
import LogBar from "@/components/logs/LogBar";
import { useAuth } from "@/hooks/useAuth";
import { useLogs } from "@/hooks/useLogs";
import { useUserContext } from "@/context/UserContext";
import ConfigureDialog from "@/components/dialog/configure/ConfigureDialog";
import CongratsBanner from "@/components/misc/Congrats-Banner";
import { calculateDaysLeft } from "@/lib/utils";

export function InternshipLogger() {
  const { user, loading: authLoading } = useAuth();
  const { logs, loading: logsLoading } = useLogs(user?.uid ?? null);
  const { weekendSystem, isInitialSetupComplete, dateRange } = useUserContext();

  if (authLoading || logsLoading || isInitialSetupComplete === undefined) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isInitialSetupComplete) {
    return (
      <Dialog defaultOpen={true}>
        <DialogContent
          className="sm:max-w-[425px] [&>button]:hidden animate-in fade-in duration-300 slide-in-from-bottom-4"
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>Let&apos;s get started</DialogTitle>
          </DialogHeader>
          <ConfigureDialog />
        </DialogContent>
      </Dialog>
    );
  }

  const calculateDaysLogged = () => {
    if (!logs || logs.length === 0) {
      return 0;
    }
    const logDates = new Set(
      logs.map((log) => format(new Date(log.date), "yyyy-MM-dd"))
    );
    return logDates.size;
  };

  const getMissingDates = () => {
    if (!logs || !dateRange.from) return [];

    const today = new Date();
    // Set today to start of day to ensure correct comparison
    today.setHours(0, 0, 0, 0);

    const endDate = dateRange.to || today;
    const cutoffDate = endDate < today ? endDate : today;
    const startDate = dateRange.from;
    const logDates = new Set(
      logs.map((log) => format(new Date(log.date), "yyyy-MM-dd"))
    );
    const missingDates = [];

    let currentDate = startDate;
    // Changed <= to < to exclude today
    while (currentDate < cutoffDate) {
      const dateStr = format(currentDate, "yyyy-MM-dd");
      if (!logDates.has(dateStr)) {
        missingDates.push(currentDate);
      }
      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
    }

    return missingDates;
  };

  const daysLeft = calculateDaysLeft(dateRange);
  const daysLogged = calculateDaysLogged();
  const missingDates = getMissingDates();

  return (
    <div className="container mx-auto min-h-screen w-full flex flex-col animate-in fade-in duration-500">
      {daysLeft <= 0 && (
        <div className="animate-in slide-in-from-top duration-500">
          <CongratsBanner />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="overflow-hidden group animate-in slide-in-from-left duration-500 delay-100 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {daysLeft <= 0 ? "Internship Complete" : "Days Remaining"}
            </CardTitle>
            <div className="relative w-12 h-12 md:w-8 md:h-8">
              <Calendar className="absolute inset-0 w-full h-full text-green-400 transition-all duration-300 ease-in-out transform group-hover:scale-110" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{daysLeft}</div>
            <p className="text-xs text-muted-foreground">
              {daysLeft <= 0 ? (
                <>
                  Completed on{" "}
                  {dateRange.to ? format(dateRange.to, "MMM d, yyyy") : "N/A"}
                </>
              ) : (
                <>
                  Until{" "}
                  {dateRange.to ? format(dateRange.to, "MMM d, yyyy") : "N/A"}
                </>
              )}
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden group animate-in slide-in-from-left duration-500 delay-200 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days Logged</CardTitle>
            <div className="relative w-12 h-12 md:w-8 md:h-8">
              <FileText className="absolute inset-0 w-full h-full text-orange-400 transition-all duration-300 ease-in-out transform group-hover:scale-110" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{daysLogged}</div>
            <p className="text-xs text-muted-foreground">Unique days logged</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden group animate-in slide-in-from-left duration-500 delay-300 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Logging Period
            </CardTitle>
            <div className="relative w-12 h-12 md:w-8 md:h-8">
              <Clock className="absolute inset-0 w-full h-full text-blue-400 transition-all duration-300 ease-in-out transform group-hover:scale-110" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {dateRange.from ? format(dateRange.from, "MMM d") : "N/A"} -{" "}
              {dateRange.to ? format(dateRange.to, "MMM d, yyyy") : "N/A"}
            </div>
          </CardContent>
        </Card>

        {missingDates.length > 0 && (
          <Card className="col-span-1 md:col-span-3 bg-yellow-50 border-yellow-200 animate-in slide-in-from-left duration-500 delay-400">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-800">
                Missing Activity Logs
              </CardTitle>
              <div className="relative w-12 h-12 md:w-8 md:h-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute inset-0 w-full h-full text-yellow-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-yellow-800">
                You have missing logs for the following dates:
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {missingDates.map((date) => (
                  <span
                    key={date.toISOString()}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                  >
                    {format(date, "MMM d, yyyy")}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="flex-grow mb-6 animate-in fade-in slide-in-from-bottom duration-500 delay-500 hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle>Log Today&apos;s Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {user && (
            <LogForm
              userId={user.uid}
              weekendSystem={weekendSystem}
              dateRange={dateRange}
            />
          )}
        </CardContent>
      </Card>

      <Card className="flex-grow animate-in fade-in slide-in-from-bottom duration-500 delay-700 hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <LogBar
            logs={logs}
            weekendSystem={weekendSystem}
            dateRange={dateRange}
          />
        </CardContent>
      </Card>
    </div>
  );
}
