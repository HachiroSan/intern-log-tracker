import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface LogButtonProps {
  isEditing: boolean;
  handleCancelEdit: () => void;
  handleDelete: () => void;
}

export default function LogButton({
  isEditing,
  handleCancelEdit,
  handleDelete,
}: LogButtonProps) {
  // Prevent form submission when clicking the button.
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    handleDelete();
  };
  return (
    <div className="flex">
      <div className="flex gap-2">
        {" "}
        <Button type="submit">
          {isEditing ? "Save Changes" : "Log Activity"}
        </Button>
        {isEditing && (
          <Button type="button" variant="outline" onClick={handleCancelEdit}>
            Cancel
          </Button>
        )}
        {isEditing && (
          <Button variant="ghost" size="icon" onClick={handleDeleteClick}>
            <p className="text-red-500">
              <Trash2 />
            </p>
          </Button>
        )}
      </div>
    </div>
  );
}
