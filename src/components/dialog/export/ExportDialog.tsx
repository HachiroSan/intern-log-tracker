import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TEMPLATE_SETTINGS } from "@/constants/template";
import {
  ExcludeOptions,
  ExportFormat,
  ExportTemplate,
  Log,
} from "@/types/index";
import { RequiredFieldsForm } from "./RequiredFieldsForm";
import { ExclusionsSection } from "@/components/dialog/export/Exclusions";
import { ExportSettings } from "@/components/dialog/export/ExportSettings";
import { GenerateDocuments } from "@/components/dialog/export/handleExport";
import { useAuth } from "@/hooks/useAuth";
import { useLogs } from "@/hooks/useLogs";
import { useUserContext } from "@/context/UserContext";

export default function ExportDialog() {
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("options");
  const [formState, setFormState] = useState({
    excludeOptions: {
      excludePublicHolidays: false,
      excludeMC: false,
      excludeAnnualLeave: false,
      excludeEmergencyLeave: false,
    },
    exportFormat: "docx" as ExportFormat,
    exportTemplate: "basic" as ExportTemplate,
    requiredFields: TEMPLATE_SETTINGS["basic"].requiredFields,
    fieldValues: {} as Record<string, string>,
    url: TEMPLATE_SETTINGS["basic"].url,
  });

  const { user } = useAuth();
  const { logs } = useLogs(user?.uid ?? null);
  const { dateRange } = useUserContext();

  const hasLogs = logs && Object.keys(logs).length > 0;

  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      requiredFields:
        TEMPLATE_SETTINGS[formState.exportTemplate].requiredFields,
      fieldValues: {},
      url: TEMPLATE_SETTINGS[formState.exportTemplate].url,
    }));
  }, [formState.exportTemplate]);

  const updateExcludeOption = useCallback(
    (key: keyof ExcludeOptions, value: boolean) => {
      setFormState((prev) => ({
        ...prev,
        excludeOptions: {
          ...prev.excludeOptions,
          [key]: value,
        },
      }));
    },
    []
  );

  const updateFieldValue = useCallback((key: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      fieldValues: {
        ...prev.fieldValues,
        [key]: value,
      },
    }));
  }, []);

  const handleNext = () => {
    if (!hasLogs) {
      toast({
        title: "No Logs Available",
        description:
          "Please record some activities before attempting to export.",
        variant: "destructive",
      });
      return;
    }

    if (activeTab === "options") {
      setActiveTab("details");
    }
  };

  const handleExport = useCallback(async () => {
    if (!hasLogs) {
      toast({
        title: "No Logs Available",
        description:
          "Please record some activities before attempting to export.",
        variant: "destructive",
      });
      return;
    }

    const requiredFieldKeys = Object.keys(formState.requiredFields);
    const allFieldsFilled = requiredFieldKeys.every((key) =>
      formState.fieldValues[key]?.trim()
    );

    if (allFieldsFilled) {
      try {
        // Convert logs array to Record<string, Log>
        const logsRecord = logs.reduce((acc, log) => {
          acc[log.id] = log;
          return acc;
        }, {} as Record<string, Log>);

        await GenerateDocuments(formState, logsRecord, dateRange);
        toast({
          title: "Export Successful",
          description: "Your logs have been successfully exported.",
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Export Failed",
          description:
            error instanceof Error
              ? error.message
              : "Failed to generate documents",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields before exporting.",
        variant: "destructive",
      });
      const firstEmptyField = document.querySelector(
        "input[required]:invalid"
      ) as HTMLElement;
      firstEmptyField?.focus();
    }
  }, [formState, logs, dateRange, hasLogs, toast]);

  const activeExclusions = Object.entries(formState.excludeOptions).filter(
    ([, value]) => value
  ).length;

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="options">Export Options</TabsTrigger>
          <TabsTrigger value="details" disabled={!hasLogs}>
            Required Details
          </TabsTrigger>
        </TabsList>

        <TabsContent value="options">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Export Options
                {activeExclusions > 0 && (
                  <Badge variant="secondary">
                    {activeExclusions} exclusion
                    {activeExclusions !== 1 ? "s" : ""}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Configure your export settings and exclusions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ExclusionsSection
                excludeOptions={formState.excludeOptions}
                onExcludeOptionChange={updateExcludeOption}
              />

              <ExportSettings
                exportFormat={formState.exportFormat}
                exportTemplate={formState.exportTemplate}
                onFormatChange={(value) => {
                  setFormState((prev) => ({ ...prev, exportFormat: value }));
                  toast({
                    title: "Format Updated",
                    description: `Export format changed to ${value.toUpperCase()}`,
                    variant: "default",
                  });
                }}
                onTemplateChange={(value) => {
                  setFormState((prev) => ({ ...prev, exportTemplate: value }));
                  toast({
                    title: "Template Updated",
                    description: `Export template changed to ${value}`,
                    variant: "default",
                  });
                }}
              />
            </CardContent>
          </Card>
          <Button onClick={handleNext} className="w-full mt-6" size="lg">
            Next Step
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Required Information</CardTitle>
              <CardDescription>
                Rest assured, this information is solely for export purposes and
                is not stored.
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-96">
              <RequiredFieldsForm
                requiredFields={formState.requiredFields}
                fieldValues={formState.fieldValues}
                onFieldChange={updateFieldValue}
              />
            </CardContent>
          </Card>
          <Button onClick={handleExport} className="w-full mt-6" size="lg">
            <Download className="mr-2 h-4 w-4" />
            Export Log
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
