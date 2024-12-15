import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RequiredField {
  label: string;
  placeholder?: string;
  description?: string;
}

export const RequiredFieldsForm = ({
  requiredFields,
  fieldValues,
  onFieldChange,
}: {
  requiredFields: Record<string, RequiredField>;
  fieldValues: Record<string, string>;
  onFieldChange: (key: string, value: string) => void;
}) => {
  if (!requiredFields || Object.keys(requiredFields).length === 0) return null;

  return (
    <div className="space-y-4">
      {/* <h3 className="font-semibold">Required Fields</h3> */}
      <div className="space-y-4">
        {Object.entries(requiredFields).map(([key, field]) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{field.label}</Label>
            <Input
              id={key}
              required
              placeholder={
                field.placeholder || `Enter ${field.label.toLowerCase()}`
              }
              value={fieldValues[key] || ""}
              onChange={(e) => onFieldChange(key, e.target.value)}
            />
            {field.description && (
              <p className="text-sm text-gray-500">{field.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
