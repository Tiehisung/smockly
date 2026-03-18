import { X } from "lucide-react";
import { useUpdateSearchParams } from "../../hooks/params";
import type { TButtonSize, TButtonVariant } from "../ui/button";
import { Button } from "./Button";

export const ClearBtn = ({
  className = "",
  label = "",
  size = "sm",
  variant = "ghost",
  onClick,
}: {
  className?: string;
  label?: string;
  variant?: TButtonVariant;
  size?: TButtonSize;
  onClick?: () => void;
}) => {
  const { clearParams } = useUpdateSearchParams();

  return (
    <Button
      variant={variant}
      size={size}
      title="Clear filters"
      onClick={() => {
        if (typeof onClick !== "undefined") onClick();
        else clearParams();
      }}
      className={className}
    >
      <X className="h-4 w-4 " /> {label}
    </Button>
  );
};
