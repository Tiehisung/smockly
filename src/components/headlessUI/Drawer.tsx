// src/components/ui/Drawer.tsx
import { Fragment, type ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export type DrawerSize = "sm" | "md" | "lg" | "xl" | "full";
export type DrawerPosition = "right" | "left" | "top" | "bottom";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: DrawerSize;
  position?: DrawerPosition;
  showCloseButton?: boolean;
  closeOnClickOutside?: boolean;
  footer?: ReactNode;
  className?: string;
}

const sizeClasses = {
  right: {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full",
  },
  left: {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full",
  },
  top: {
    sm: "max-h-sm",
    md: "max-h-md",
    lg: "max-h-lg",
    xl: "max-h-xl",
    full: "max-h-full",
  },
  bottom: {
    sm: "max-h-sm",
    md: "max-h-md",
    lg: "max-h-lg",
    xl: "max-h-xl",
    full: "max-h-full",
  },
};

const positionClasses = {
  right: "inset-y-0 right-0",
  left: "inset-y-0 left-0",
  top: "inset-x-0 top-0",
  bottom: "inset-x-0 bottom-0",
};

const enterFromClasses = {
  right: "translate-x-full",
  left: "-translate-x-full",
  top: "-translate-y-full",
  bottom: "translate-y-full",
};

const enterToClasses = {
  right: "translate-x-0",
  left: "translate-x-0",
  top: "translate-y-0",
  bottom: "translate-y-0",
};

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  position = "right",
  showCloseButton = true,
  closeOnClickOutside = true,
  footer,
  className = "",
}: DrawerProps) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={closeOnClickOutside ? onClose : () => {}}
      >
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500/75 transition-opacity" />
        </Transition.Child>

        {/* Drawer Panel */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div
              className={`pointer-events-none fixed flex ${positionClasses[position]}`}
            >
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom={enterFromClasses[position]}
                enterTo={enterToClasses[position]}
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom={enterToClasses[position]}
                leaveTo={enterFromClasses[position]}
              >
                <Dialog.Panel
                  className={`pointer-events-auto w-screen ${sizeClasses[position][size]} ${className}`}
                >
                  <div className="flex h-full flex-col bg-white shadow-xl">
                    {/* Header */}
                    {(title || showCloseButton) && (
                      <div className="flex items-center justify-between px-4 py-6 sm:px-6 border-b border-gray-200">
                        {title && (
                          <Dialog.Title className="text-lg font-medium text-gray-900">
                            {title}
                          </Dialog.Title>
                        )}
                        {showCloseButton && (
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="relative -m-2 p-2 text-gray-400 hover:text-gray-500 rounded-md hover:bg-gray-100 transition-colors"
                              onClick={onClose}
                            >
                              <span className="absolute -inset-0.5" />
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">{children}</div>

                    {/* Footer */}
                    {footer && (
                      <div className="border-t border-gray-200">{footer}</div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
