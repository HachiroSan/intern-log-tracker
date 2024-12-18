import { Timestamp } from "firebase/firestore";
import { TEMPLATE_SETTINGS } from "@/constants/template";

export type WeekendSystem = "friday-saturday" | "saturday-sunday" | undefined;

type DateRange = Date | Timestamp | undefined;

export type User = {
  id: string;
  name: string;
  email: string;
  weekendSystem?: WeekendSystem;
  startDate?: DateRange;
  endDate?: DateRange;
  isInitialSetupComplete?: boolean;
  createdAt: DateRange;
  updatedAt: DateRange;
};

export type Log = {
  id: string;
  userId: string;
  date: string;
  activity: string;
  leaveType: string;
  createdAt: Date;
  updatedAt?: Date;
};

export type LogFormData = {
  date: string;
  activity: string;
  leaveType: string;
};

export type LeaveType = {
  label: string;
  placeholder?: string;
  defaultText?: string;
};

export type LeaveTypes = {
  [key: string]: LeaveType;
};

export type ValidationResult = {
  isValid: boolean;
  error?: string;
};

export type ExcludeOptions = {
  excludePublicHolidays: boolean;
  excludeMC: boolean;
  excludeAnnualLeave: boolean;
  excludeEmergencyLeave: boolean;
};

export type ExportFormat = "pdf" | "docx";

export type ExportTemplate = keyof typeof TEMPLATE_SETTINGS;
