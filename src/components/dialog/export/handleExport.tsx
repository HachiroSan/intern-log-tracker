"use client";

import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from "file-saver";
import { getWeekNumber } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { ExcludeOptions } from "@/types/index";

// Types
interface ActivityRow {
  date: string;
  activities: string;
}

interface DocumentData {
  [key: string]: string | ActivityRow[];
  activity_row: ActivityRow[];
}

interface Log {
  id: string;
  date: string;
  activity: string;
  type?: string; // Added to handle different log types
}

interface FormData {
  fieldValues: Record<string, string>;
  url: string;
  excludeOptions: ExcludeOptions;
}

// Utils
const loadFileAsync = async (url: string): Promise<string> => {
  const PizZipUtils = (await import("pizzip/utils/index.js")).default;
  return new Promise((resolve, reject) => {
    PizZipUtils.getBinaryContent(
      url,
      (error: Error | null, content?: string) => {
        if (error) reject(error);
        if (content) resolve(content);
      }
    );
  });
};

const generateDocument = (content: string, data: DocumentData) => {
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
    linebreaks: true,
    paragraphLoop: true,
  });

  doc.render(data);
  return doc.getZip().generate({
    type: "uint8array",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
};

const shouldExcludeLog = (
  log: Log,
  excludeOptions: ExcludeOptions
): boolean => {
  const activityLower = log.activity.toLowerCase();
  const type = log.type?.toLowerCase();

  if (
    excludeOptions.excludePublicHolidays &&
    (activityLower.includes("holiday") || type === "holiday")
  ) {
    return true;
  }

  if (
    excludeOptions.excludeMC &&
    (activityLower.includes("mc") || type === "mc")
  ) {
    return true;
  }

  if (
    excludeOptions.excludeAnnualLeave &&
    (activityLower.includes("annual") || type === "annual")
  ) {
    return true;
  }

  if (
    excludeOptions.excludeEmergencyLeave &&
    (activityLower.includes("emergency") || type === "emergency")
  ) {
    return true;
  }

  return false;
};

const prepareDocumentsData = (
  formData: FormData,
  logs: Record<string, Log>,
  dateRange: DateRange
): DocumentData[] => {
  return Object.values(
    Object.values(logs)
      .filter((log) => !shouldExcludeLog(log, formData.excludeOptions))
      .reduce((acc, log) => {
        const weekNum = getWeekNumber(dateRange, new Date(log.date));

        if (!acc[weekNum]) {
          acc[weekNum] = {
            ...formData.fieldValues,
            week: weekNum.toString(),
            activity_row: [],
          };
        }

        acc[weekNum].activity_row.push({
          date: log.date,
          activities: log.activity,
        });

        return acc;
      }, {} as Record<string, DocumentData>)
  );
};

export async function GenerateDocuments(
  formData: FormData,
  logs: Record<string, Log>,
  dateRange: DateRange
) {
  try {
    // Group logs by week, excluding filtered logs
    const documentsData = prepareDocumentsData(formData, logs, dateRange);

    // If no logs remain after filtering, throw an error
    if (documentsData.length === 0) {
      throw new Error("No logs remaining after applying exclusions");
    }

    // Load template
    const content = await loadFileAsync(formData.url);
    const zipContainer = new PizZip();

    // Generate documents
    documentsData.forEach((data) => {
      const docBlob = generateDocument(content, data);
      zipContainer.file(
        `logbook_${data.student_id}_week${data.week}.docx`,
        docBlob
      );
    });

    // Generate and save zip
    const zipBlob = zipContainer.generate({
      type: "blob",
      mimeType: "application/zip",
    });

    saveAs(zipBlob, "documents.zip");
  } catch (error) {
    console.error("Document generation failed:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to generate documents"
    );
  }
}
