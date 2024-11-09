import { format, differenceInDays } from "date-fns";
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
import ConfigureForm from "@/components/navigation-bar/settings/ConfigureForm";

export function InternshipLogger() {
  const { user, loading: authLoading } = useAuth();
  const { logs, loading: logsLoading } = useLogs(user?.uid ?? null);
  const { weekendSystem, isInitialSetupComplete, dateRange } = useUserContext();

  // Check if loading is still true or if `isInitialSetupComplete` is undefined
  if (authLoading || logsLoading || isInitialSetupComplete === undefined) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Prompt for initial setup configuration if not complete
  if (!isInitialSetupComplete) {
    return (
      <Dialog defaultOpen={true}>
        <DialogContent
          className="sm:max-w-[425px] [&>button]:hidden"
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>Let&apos;s get started</DialogTitle>
          </DialogHeader>
          <ConfigureForm />
        </DialogContent>
      </Dialog>
    );
  }

  const calculateDaysLogged = () => {
    if (!logs || logs.length === 0) {
      return 0;
    }

    // Get unique dates from the logs
    const logDates = new Set(
      logs.map((log) => format(new Date(log.date), "yyyy-MM-dd"))
    );

    return logDates.size;
  };

  const daysLeft = dateRange.to
    ? differenceInDays(dateRange.to, new Date())
    : 0;
  const daysLogged = calculateDaysLogged();

  return (
    <div className="container mx-auto min-h-screen w-full flex flex-col">
      <h1 className="text-3xl font-bold mb-6">Internship Log Tracker</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Days Remaining
            </CardTitle>
            <div className="relative w-12 h-12 md:w-8 md:h-8">
              <Calendar className="absolute inset-0 w-full h-full text-green-400 transition-all duration-300 ease-in-out transform hover:scale-110 hover:rotate-12" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{daysLeft}</div>
            <p className="text-xs text-muted-foreground">
              Until {dateRange.to ? format(dateRange.to, "MMM d, yyyy") : "N/A"}
            </p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days Logged</CardTitle>
            <div className="relative w-12 h-12 md:w-8 md:h-8">
              <FileText className="absolute inset-0 w-full h-full text-orange-400 transition-all duration-300 ease-in-out transform hover:scale-110" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{daysLogged}</div>
            <p className="text-xs text-muted-foreground">Unique days logged</p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Logging Period
            </CardTitle>
            <div className="relative w-12 h-12 md:w-8 md:h-8">
              <Clock className="absolute inset-0 w-full h-full text-blue-400 transition-all duration-300 ease-in-out transform hover:scale-110 hover:rotate-45" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {dateRange.from ? format(dateRange.from, "MMM d") : "N/A"} -{" "}
              {dateRange.to ? format(dateRange.to, "MMM d, yyyy") : "N/A"}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="flex-grow mb-6">
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
      <Card className="flex-grow">
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
