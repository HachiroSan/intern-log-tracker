import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useUserContext } from "@/context/UserContext";
import type { WeekendSystem } from "@/types";
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import DateRangePicker from "@/components/dialog/configure/DateRangePicker";
import { useState, useEffect } from "react";
import type { DateRange } from "react-day-picker";
import { useToast } from "@/hooks/use-toast";

const weekendSystems: WeekendSystem[] = ["friday-saturday", "saturday-sunday"];

export default function ConfigureDialog() {
  const {
    weekendSystem,
    setWeekendSystem,
    dateRange,
    setDateRange,
    isInitialSetupComplete,
    setIsInitialSetupComplete,
  } = useUserContext();

  const { toast } = useToast();

  // Local state
  const [localWeekendSystem, setLocalWeekendSystem] = useState(weekendSystem);
  const [localDateRange, setLocalDateRange] = useState(dateRange);

  // Update local state when context changes
  useEffect(() => {
    setLocalWeekendSystem(weekendSystem);
    setLocalDateRange(dateRange);
  }, [weekendSystem, dateRange]);

  const handleApply = () => {
    setWeekendSystem(localWeekendSystem);
    setDateRange(localDateRange);
    if (!isInitialSetupComplete) setIsInitialSetupComplete(true);

    // Show toast notification
    toast({
      title: "Settings Updated",
      description: "Your configuration has been successfully applied.",
      variant: "default",
    });
  };

  const isApplyDisabled =
    !localWeekendSystem || !localDateRange?.from || !localDateRange?.to;

  return (
    <div className="space-y-4">
      <div>
        <Label>Set the start and end dates for your internship.</Label>
        <DateRangePicker
          value={localDateRange}
          onChange={(dateRange: DateRange) => setLocalDateRange(dateRange)}
        />
      </div>

      <div>
        <Label>Weekend System</Label>
        <RadioGroup
          value={localWeekendSystem || ""}
          onValueChange={(value) =>
            setLocalWeekendSystem(value as WeekendSystem)
          }
          className="flex flex-col space-y-1 mt-2"
        >
          {weekendSystems.map((system) => (
            <div key={system} className="flex items-center space-x-2">
              <RadioGroupItem value={system || ""} />
              <Label>
                {(system ?? "")
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join("-")}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button onClick={handleApply} disabled={isApplyDisabled}>
            Apply Changes
          </Button>
        </DialogClose>
      </DialogFooter>
    </div>
  );
}
