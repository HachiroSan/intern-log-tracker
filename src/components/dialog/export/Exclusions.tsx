import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FilterX } from "lucide-react";
import { ExcludeOptions } from "@/types/index";

export const ExcludeCheckbox = ({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
}) => (
  <div className="flex items-start space-x-3 py-2">
    <Checkbox checked={checked} onCheckedChange={onChange} className="mt-1" />
    <div>
      <Label className="font-medium">{label}</Label>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
  </div>
);

// Exclusions Section Component
export const ExclusionsSection = ({
  excludeOptions,
  onExcludeOptionChange,
}: {
  excludeOptions: ExcludeOptions;
  onExcludeOptionChange: (key: keyof ExcludeOptions, value: boolean) => void;
}) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      <FilterX className="h-4 w-4" />
      <h3 className="font-semibold">Exclusions</h3>
    </div>
    <div className="space-y-1 pl-6">
      <ExcludeCheckbox
        checked={excludeOptions.excludePublicHolidays}
        onChange={(value) =>
          onExcludeOptionChange("excludePublicHolidays", value)
        }
        label="Public Holidays"
        description="Exclude all public holidays from the export"
      />
      <ExcludeCheckbox
        checked={excludeOptions.excludeMC}
        onChange={(value) => onExcludeOptionChange("excludeMC", value)}
        label="Medical Leave"
        description="Exclude medical certificates and sick leave"
      />
      <ExcludeCheckbox
        checked={excludeOptions.excludeAnnualLeave}
        onChange={(value) => onExcludeOptionChange("excludeAnnualLeave", value)}
        label="Annual Leave"
        description="Exclude planned annual leave days"
      />
      <ExcludeCheckbox
        checked={excludeOptions.excludeEmergencyLeave}
        onChange={(value) =>
          onExcludeOptionChange("excludeEmergencyLeave", value)
        }
        label="Emergency Leave"
        description="Exclude emergency and unplanned leave"
      />
    </div>
  </div>
);
