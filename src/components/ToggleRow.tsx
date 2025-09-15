import { FC } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ToggleRowProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const ToggleRow: FC<ToggleRowProps> = ({ label, description, checked, onChange }) => {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="space-y-0.5">
        <Label>{label}</Label>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
};
