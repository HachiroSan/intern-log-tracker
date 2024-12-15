import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLogs } from "@/hooks/useLogs";
import { useToast } from "@/hooks/use-toast";
import { Log } from "@/types";

export default function BackupDialog() {
  const { user } = useAuth();
  const { logs } = useLogs(user?.uid ?? null);
  const { toast } = useToast();

  const removeIdsFromLogs = (logs: Log[]) => {
    return logs.map(({ id, ...rest }) => rest);
  };

  const handleExport = () => {
    if (!logs || logs.length === 0) {
      toast({
        title: "No Data",
        description: "There are no logs to export.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create a JSON blob with IDs removed
      const sanitizedLogs = removeIdsFromLogs(logs);
      const jsonData = JSON.stringify(sanitizedLogs, null, 2);
      const blob = new Blob([jsonData], { type: "application/json" });

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `internship-logs-${
        new Date().toISOString().split("T")[0]
      }.json`;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Backup Successful",
        description: "Your logs have been exported to JSON successfully.",
        variant: "default",
      });
    } catch {
      toast({
        title: "Backup Failed",
        description: "Failed to export logs. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Export your logs as a JSON file for backup purposes.
      </p>
      <Button onClick={handleExport} className="w-full">
        <Download className="mr-2 h-4 w-4" />
        Download Backup
      </Button>
    </div>
  );
}
