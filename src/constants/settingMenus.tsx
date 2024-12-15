import AboutDialog from "@/components/dialog/about/AboutDialog";
import BackupDialog from "@/components/dialog/backup/BackupDialog";
import ConfigureDialog from "@/components/dialog/configure/ConfigureDialog";
import ExportDialog from "@/components/dialog/export/ExportDialog";
import ImportDialog from "@/components/dialog/import/ImportDialog";

export const SETTINGS_MENU_ITEMS = [
  {
    id: "configure",
    label: "Configure",
    description: "Make changes to your internship settings here.",
    component: ConfigureDialog,
  },
  {
    id: "import",
    label: "Import",
    component: ImportDialog,
  },
  {
    id: "backup",
    label: "Backup",
    component: BackupDialog,
  },
  {
    id: "export",
    label: "Export",
    description: "Export your internship data.",
    component: ExportDialog,
  },
  {
    id: "about",
    label: "About",
    component: AboutDialog,
  },
] as const;
