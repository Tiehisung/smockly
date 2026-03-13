import type { ReactNode } from "react";
import type { ISelectOptionLV } from "../types";
import { OverlayLoader } from "./loader/OverlayLoader";
import { useSearchParams } from "react-router-dom";

interface ISELECT {
  options: ISelectOptionLV[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  selectStyles?: string;
  loading?: boolean;
  name?: string;
  paramKey?: string;
  label?: ReactNode;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export default function SELECT({
  options,
  name,
  value,
  error,
  onChange,
  label,
  className,
  paramKey,
  selectStyles,
  loading,
  placeholder = "Select",
  ...props
}: ISELECT) {
  const [sp] = useSearchParams();

  const handleOnChange = (val: string) => {
    if (typeof onChange !== "undefined") {
      onChange(val);
    } else {
      if (paramKey) sp.set((paramKey as string) ?? "filter", val);
    }
  };
  return (
    <div className={`  items-center gap-2 relative ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Gender
        </label>
      )}
      <select
        value={value}
        onChange={(e) => handleOnChange?.(e.target.value)}
        className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${selectStyles}`}
        {...props}
      >
        {placeholder && (
          <option value="" hidden>
            {placeholder}
          </option>
        )}
        {options?.map((op, i) => (
          <option key={i} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>

      {error && (
        <p
          className={`absolute top-full text-red-500 text-left text-sm font-light`}
        >
          {error}
        </p>
      )}
      {loading && <OverlayLoader isLoading />}
    </div>
  );
}
