"use client";

import { User, Settings, Download } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase-config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ConfigureForm from "@/components/navigation-bar/settings/ConfigureForm";
import AboutDialog from "@/components/navigation-bar/AboutDialog";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import { useState } from "react";

export default function NavigationMenuBar() {
  const { user: authUser } = useAuth();
  const { user } = useUser(authUser?.uid ?? null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [excludeOptions, setExcludeOptions] = useState({
    excludePublicHolidays: true,
    excludeMC: false,
    excludeAnnualLeave: false,
    excludeEmergencyLeave: false,
  });
  const [exportFormat, setExportFormat] = useState("pdf");
  const [exportTemplate, setExportTemplate] = useState("umpsa-psm-2024");

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log("Error signing out: ", error);
    }
  };

  const handleExport = () => {
    // Implement the export logic here
    console.log("Exporting with options:", {
      ...excludeOptions,
      exportFormat,
      exportTemplate,
    });
    setExportDialogOpen(false);
  };

  return (
    <div className="w-full border-b">
      <div className="flex items-center justify-end gap-5 p-6 max-w-7xl mx-auto">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Dialog>
                <DialogTrigger asChild>
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle()}
                    style={{ cursor: "pointer" }}
                  >
                    About
                  </NavigationMenuLink>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <AboutDialog />
                </DialogContent>
              </Dialog>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center gap-4">
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DialogTrigger asChild>
                  <DropdownMenuItem>Configure</DropdownMenuItem>
                </DialogTrigger>
                <DropdownMenuItem>Backup</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setExportDialogOpen(true)}>
                  Export
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent className="sm:max-w-[505px]">
              <DialogHeader>
                <DialogTitle>Configure internship</DialogTitle>
                <DialogDescription>
                  Make changes to your internship settings here.
                </DialogDescription>
              </DialogHeader>
              <ConfigureForm />
            </DialogContent>
          </Dialog>
          <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Export Options</DialogTitle>
                <DialogDescription>
                  Choose your export preferences
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="excludePublicHolidays"
                    checked={excludeOptions.excludePublicHolidays}
                    onCheckedChange={(checked) =>
                      setExcludeOptions((prev) => ({
                        ...prev,
                        excludePublicHolidays: checked === true,
                      }))
                    }
                  />
                  <label
                    htmlFor="excludePublicHolidays"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Exclude Public Holidays
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="excludeMC"
                    checked={excludeOptions.excludeMC}
                    onCheckedChange={(checked) =>
                      setExcludeOptions((prev) => ({
                        ...prev,
                        excludeMC: checked === true,
                      }))
                    }
                  />
                  <label
                    htmlFor="excludeMC"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Exclude MC
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="excludeAnnualLeave"
                    checked={excludeOptions.excludeAnnualLeave}
                    onCheckedChange={(checked) =>
                      setExcludeOptions((prev) => ({
                        ...prev,
                        excludeAnnualLeave: checked === true,
                      }))
                    }
                  />
                  <label
                    htmlFor="excludeAnnualLeave"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Exclude Annual Leave
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="excludeEmergencyLeave"
                    checked={excludeOptions.excludeEmergencyLeave}
                    onCheckedChange={(checked) =>
                      setExcludeOptions((prev) => ({
                        ...prev,
                        excludeEmergencyLeave: checked === true,
                      }))
                    }
                  />
                  <label
                    htmlFor="excludeAnnualLeave"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Exclude Emergency Leave
                  </label>
                </div>
                <div className="space-y-2">
                  <Label>Export Format</Label>
                  <RadioGroup
                    defaultValue="pdf"
                    onValueChange={setExportFormat}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pdf" id="pdf" />
                      <Label htmlFor="pdf">PDF</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="docx" id="docx" />
                      <Label htmlFor="docx">Word (DOCX)</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-select">Export Template</Label>
                  <Select
                    defaultValue={exportTemplate}
                    onValueChange={setExportTemplate}
                  >
                    <SelectTrigger id="template-select">
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="umpsa-psm-2024">
                        UMPSA - PSM 2024
                      </SelectItem>
                      {/* Add more templates here as needed */}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleExport} className="w-full">
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
            </DialogContent>
          </Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <div className="px-2 py-2 border-b mb-2">
                <p className="text-sm font-medium">
                  {user?.name ?? "Loading..."}
                </p>
                <p className="text-sm text-gray-500">
                  {user?.email ?? "Loading..."}
                </p>
              </div>
              <DropdownMenuItem onClick={handleSignOut}>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
