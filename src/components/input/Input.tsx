// src/components/ui/Input.tsx
import React from "react";
import { cn } from "../../utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  suggestions?: string[];
}

export const INPUT = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, ...props }, ref) => {

    const listId = `sugg-${props.name || label || props.suggestions?.[0]}`;
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm outline-none transition-colors",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error ? "border-red-500" : "border-gray-300",
              className,
            )}
            {...props}
            list={listId}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

        {props.suggestions && (
          <datalist id={listId}>
            {props.suggestions?.map((item, i) => (
              <option key={item + i} value={item} />
            ))}
          </datalist>
        )}
      </div>
    );
  },
);

INPUT.displayName = "Input";
