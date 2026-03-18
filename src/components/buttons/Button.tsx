import type { CSSProperties, MouseEventHandler } from "react";

import {
  type TButtonSize,
  type TButtonVariant,
  Button as Btn,
} from "../ui/button";
import { Loader2 } from "lucide-react";

interface ButtonProps {
  text?: string;
  isLoading?: boolean;
  loadingText?: string;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  type?: "submit" | "button" | "reset";
  styles?: CSSProperties;
  variant?: TButtonVariant;
  size?: TButtonSize;
  id?: string;
}

interface ClickButtonProps extends ButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  title?: string;
}

export function Button({
  text,
  isLoading = false,
  loadingText = "Processing...",
  className = "",
  disabled = false,
  type = "button",
  onClick,
  children,
  title = "",
  styles = {},
  variant,
  size,
  id,
}: ClickButtonProps) {
  return (
    <Btn
      disabled={isLoading || disabled}
      className={`flex items-center gap-2 font-semibold disabled:pointer-events-none disabled:hover:bg-transparent disabled:opacity-60 active:scale-[99%] overflow-hidden ${className} ${
        isLoading ? "cursor-wait" : "cursor-pointer"
      }  `}
      variant={variant}
      size={size}
      type={type}
      onClick={onClick}
      title={title}
      style={styles}
      id={id}
    >
      {isLoading ? (
        <span
          className={`flex items-center gap-2 w-fit min-w-max justify-between whitespace-nowrap transition-all`}
        >
          <Loader2 className={` animate-spin `} />
          {loadingText}
        </span>
      ) : (
        <>
          {children}
          <span hidden={!text}>{text}</span>
        </>
      )}
    </Btn>
  );
}
