import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase-config";
import { writeBatch, doc, collection, Timestamp } from "firebase/firestore";
import { useState } from "react";
import { useUserContext } from "@/context/UserContext";

export default function ImportDialog() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isImporting, setIsImporting] = useState(false);
  const { dateRange } = useUserContext();

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setIsImporting(true);
    try {
      // Read and parse JSON file
      const fileContent = await file.text();
      const logs = JSON.parse(fileContent);

      if (!Array.isArray(logs)) {
        throw new Error("Invalid file format");
      }

      // Create batch write
      const batch = writeBatch(db);

      logs.forEach((log) => {
        const logDate = new Date(log.date);

        // Skip logs outside date range
        if (dateRange.from && logDate < dateRange.from) return;
        if (dateRange.to && logDate > dateRange.to) return;

        // Create new document reference with auto-generated ID
        const docRef = doc(collection(db, "logs"));

        // Convert date strings/timestamps
        const createdAt = new Date();

        // Write to logs collection with new ID
        batch.set(docRef, {
          ...log,
          id: docRef.id, // Use the auto-generated ID
          userId: user.uid,
          createdAt: Timestamp.fromDate(createdAt),
          updatedAt: Timestamp.fromDate(createdAt),
        });
      });

      await batch.commit();

      toast({
        title: "Import Successful",
        description: `Imported ${logs.length} logs successfully.`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description:
          error instanceof Error ? error.message : "Failed to import logs",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      if (event.target) event.target.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Import your logs from a previously exported JSON file.
      </p>
      <div className="flex items-center justify-center w-full">
        <label htmlFor="file-upload" className="w-full">
          <Button
            disabled={isImporting}
            className="w-full"
            variant="outline"
            asChild
          >
            <div>
              <Upload className="mr-2 h-4 w-4" />
              {isImporting ? "Importing..." : "Select File"}
            </div>
          </Button>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept=".json"
            onChange={handleFileSelect}
            disabled={isImporting}
          />
        </label>
      </div>
    </div>
  );
}
