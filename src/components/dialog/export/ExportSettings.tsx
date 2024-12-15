import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TEMPLATE_SETTINGS } from "@/constants/template";
import { ExportFormat, ExportTemplate } from "@/types/index";
import { FileType, BookDashed } from "lucide-react";

// Export Settings Component
export const ExportSettings = ({
  exportFormat,
  exportTemplate,
  onFormatChange,
  onTemplateChange,
}: {
  exportFormat: ExportFormat;
  exportTemplate: ExportTemplate;
  onFormatChange: (value: ExportFormat) => void;
  onTemplateChange: (value: ExportTemplate) => void;
}) => (
  <div className="grid grid-cols-2 gap-4">
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <FileType className="h-4 w-4" />
        <Label>Format</Label>
      </div>
      <Select value={exportFormat} onValueChange={onFormatChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select format" />
        </SelectTrigger>
        <SelectContent>
          {/* <SelectItem value="pdf">PDF Document</SelectItem> */}
          <SelectItem value="docx">Word Document</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <BookDashed className="h-4 w-4" />
        <Label>Template</Label>
      </div>
      <Select value={exportTemplate} onValueChange={onTemplateChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select template" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(TEMPLATE_SETTINGS).map(([key, template]) => (
            <SelectItem value={key} key={key}>
              {template.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>
);
