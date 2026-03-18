// src/components/ui/DeleteConfirmButton.tsx
import { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

interface DeleteConfirmButtonProps {
  onDelete: () => void | Promise<void>;
  className?: string;
  iconSize?: number;
  confirmButtonText?: string;
  cancelButtonText?: string;
  disabled?: boolean;
  showIcon?: boolean;
  children?: React.ReactNode;
}

export function DeleteConfirmButton({
  onDelete,
  className = "",
  iconSize = 5,
  confirmButtonText = "Delete",
  cancelButtonText = "Cancel",
  disabled = false,
  showIcon = true,
  children,
}: DeleteConfirmButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsConfirming(true);
  };

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDeleting(true);
    try {
      await onDelete();
      setIsConfirming(false);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsConfirming(false);
  };

  if (isConfirming) {
    return (
      <div className="flex items-center space-x-1">
        <button
          onClick={handleConfirm}
          disabled={isDeleting || disabled}
          className="p-1 text-red-600 hover:text-red-800 disabled:opacity-50"
          title={confirmButtonText}
        >
          {isDeleting ? (
            <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <span className="text-lg font-semibold">✓</span>
          )}
        </button>
        <button
          onClick={handleCancel}
          disabled={isDeleting}
          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
          title={cancelButtonText}
        >
          ✗
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleDeleteClick}
      disabled={disabled}
      className={`p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      title="Delete"
    >
      {children ||
        (showIcon && <TrashIcon className={`w-${iconSize} h-${iconSize}`} />)}
    </button>
  );
}
