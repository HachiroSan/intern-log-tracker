import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { SETTINGS_MENU_ITEMS } from "@/constants/settingMenus";

type MenuItem = {
  id: string;
  label?: string;
  description?: string;
  component: React.ComponentType;
};

const MenuItemWithDialog = ({ item }: { item: MenuItem }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            setIsOpen(true);
          }}
        >
          {item.label}
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[505px]"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          {item.label && <DialogTitle>{item.label}</DialogTitle>}
          {item.description && (
            <DialogDescription>{item.description}</DialogDescription>
          )}
        </DialogHeader>
        <item.component />
      </DialogContent>
    </Dialog>
  );
};

export default function SettingsDropdown() {
  return (
    <>
      {SETTINGS_MENU_ITEMS.map((item) => (
        <MenuItemWithDialog key={item.id} item={item} />
      ))}
    </>
  );
}
