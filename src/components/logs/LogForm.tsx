import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase-config";
import { isWeekendDay } from "@/lib/utils";
import { useState, useEffect, useMemo, useCallback } from "react";
import type { Log } from "@/types";
import { LEAVE_TYPES } from "@/constants/leaveTypes";
import LogList from "@/components/logs/LogList";
import LogButton from "@/components/logs/LogButton";
import { WeekendSystem } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { DateRange } from "react-day-picker";

const STORAGE_KEY = "logFormData";

const logSchema = z.object({
  date: z.string().nonempty("Date is required"),
  activity: z
    .string()
    .min(10, "Activity description must be at least 10 characters")
    .transform((value) => value.replace(/\r\n/g, "\n")), // Normalize line endings
  leaveType: z.enum(Object.keys(LEAVE_TYPES) as [string, ...string[]]),
});

type LogFormProps = {
  userId: string;
  weekendSystem: WeekendSystem;
  dateRange: DateRange;
};

const ErrorMessage = ({ message }: { message?: string | null }) =>
  message ? <p className="text-red-500 text-sm mt-1">{message}</p> : null;

const loadFormData = () => {
  if (typeof window === "undefined") return null;
  const savedData = localStorage.getItem(STORAGE_KEY);
  return savedData ? JSON.parse(savedData) : null;
};

const saveFormData = (data: Partial<z.infer<typeof logSchema>>) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const LogForm = ({ userId, weekendSystem, dateRange }: LogFormProps) => {
  const [weekendError, setWeekendError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const isEditing = Boolean(selectedLog);
  const { toast } = useToast();

  const leaveTypes = useMemo(() => LEAVE_TYPES, []);

  const savedData = useMemo(() => loadFormData(), []);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof logSchema>>({
    resolver: zodResolver(logSchema),
    defaultValues: {
      leaveType: savedData?.leaveType || "activity",
      activity: savedData?.activity || "",
      date: savedData?.date || "",
    },
  });

  const selectedLeaveType = watch("leaveType");
  const activity = watch("activity");
  const date = watch("date");

  // Save form data when values change
  useEffect(() => {
    if (!isEditing) {
      saveFormData({
        leaveType: selectedLeaveType,
        activity,
        date,
      });
    }
  }, [selectedLeaveType, activity, date, isEditing]);

  const handleDelete = useCallback(async () => {
    if (selectedLog) {
      try {
        await deleteDoc(doc(db, "logs", selectedLog.id));
        setSelectedLog(null);
        toast({
          title: "Log Deleted",
          description: "The log was successfully deleted.",
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while deleting the log.",
          variant: "destructive",
        });
        console.error("Error deleting log:", error);
      }
    }
  }, [selectedLog, toast]);

  const handleCancelEdit = useCallback(() => {
    setSelectedLog(null);
    const savedData = loadFormData();
    reset({
      leaveType: savedData?.leaveType || "activity",
      activity: savedData?.activity || "",
      date: savedData?.date || "",
    });
  }, [reset]);

  const clearStoredData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const onSubmit = useCallback(
    async (data: z.infer<typeof logSchema>) => {
      setWeekendError(null);
      setDateError(null);

      if (!data.date) {
        return;
      }

      const selectedDate = new Date(data.date);

      if (
        !dateRange.from ||
        !dateRange.to ||
        selectedDate < dateRange.from ||
        selectedDate > dateRange.to
      ) {
        setDateError("Date must be within the internship period.");
        return;
      }

      const isDuplicateDate = logs.some(
        (log) => log.date === data.date && log.id !== selectedLog?.id
      );
      if (isDuplicateDate) {
        setDateError("A log for this date already exists");
        return;
      }

      if (weekendSystem && isWeekendDay(data.date, weekendSystem)) {
        setWeekendError("Weekends are not allowed for logging activities.");
        return;
      }

      try {
        if (isEditing && selectedLog?.id) {
          await updateDoc(doc(db, "logs", selectedLog.id), {
            ...data,
            updatedAt: new Date(),
          });
          toast({
            title: "Log Updated",
            description: "Your activity has been updated successfully.",
            variant: "default",
          });
        } else {
          await addDoc(collection(db, "logs"), {
            userId,
            ...data,
            createdAt: new Date(),
          });
          toast({
            title: "Log Added",
            description: "Your activity has been logged successfully.",
            variant: "default",
          });
        }

        clearStoredData();
        reset({
          leaveType: "activity",
          activity: "",
          date: "",
        });
        setSelectedLog(null);
      } catch (error) {
        console.error("Error saving log:", error);
      }
    },
    [
      isEditing,
      logs,
      reset,
      selectedLog?.id,
      toast,
      userId,
      weekendSystem,
      dateRange,
      clearStoredData,
    ]
  );

  useEffect(() => {
    const logsQuery = query(
      collection(db, "logs"),
      where("userId", "==", userId),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(logsQuery, (snapshot) => {
      const logsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Log[];
      setLogs(logsData);
    });

    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    if (selectedLog) {
      reset({
        leaveType: selectedLog.leaveType,
        activity: selectedLog.activity,
        date: selectedLog.date,
      });
    }
  }, [selectedLog, reset]);

  useEffect(() => {
    if (selectedLeaveType !== "activity" && !selectedLog) {
      setValue(
        "activity",
        leaveTypes[selectedLeaveType as keyof typeof LEAVE_TYPES].defaultText ??
          ""
      );
    }
  }, [selectedLeaveType, setValue, leaveTypes, selectedLog]);

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="log-type">Log Type</Label>
          <Select
            onValueChange={(value) => setValue("leaveType", value)}
            value={selectedLeaveType}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select log type" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(leaveTypes).map(([value, { label }]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" {...register("leaveType")} />
        </div>

        <div>
          <Label htmlFor="log-date">Date</Label>
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              id="log-date"
              type="date"
              className="pl-10"
              {...register("date")}
            />
          </div>
          <ErrorMessage message={errors.date?.message} />
          <ErrorMessage message={weekendError} />
          <ErrorMessage message={dateError} />
        </div>

        <div>
          <Label htmlFor="log-activity">Activity</Label>
          <Textarea
            id="log-activity"
            placeholder={leaveTypes.activity.placeholder}
            className="h-32 whitespace-pre-wrap"
            {...register("activity")}
          />
          <ErrorMessage message={errors.activity?.message} />
        </div>
        <div className="flex justify-between mt-4">
          <LogButton
            isEditing={isEditing}
            handleCancelEdit={handleCancelEdit}
            handleDelete={handleDelete}
          />
          <a
            href="https://eportfolio.utm.my/user/zikri-arif-bin-azmi-rais/internship-logbook-daily-report"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-500 hover:underline"
          >
            Follow example
          </a>
        </div>
      </form>

      <LogList
        logs={logs}
        selectedLog={selectedLog}
        setSelectedLog={setSelectedLog}
      />
    </div>
  );
};

export default LogForm;
