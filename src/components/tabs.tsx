 

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: "underline" | "pills" | "buttons";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
  tabClassName?: string;
  activeTabClassName?: string;
}

const sizeClasses = {
  sm: {
    tab: "px-3 py-1.5 text-sm",
    icon: "w-4 h-4",
  },
  md: {
    tab: "px-4 py-2 text-sm",
    icon: "w-5 h-5",
  },
  lg: {
    tab: "px-5 py-2.5 text-base",
    icon: "w-5 h-5",
  },
};

const variantClasses = {
  underline: {
    container: "border-b border-gray-200",
    tab: "border-b-2 border-transparent -mb-px",
    active: "border-blue-600 text-blue-600",
    inactive: "text-gray-500 hover:text-gray-700 hover:border-gray-300",
  },
  pills: {
    container: "space-x-2",
    tab: "rounded-lg",
    active: "bg-blue-600 text-white",
    inactive: "text-gray-700 bg-gray-100 hover:bg-gray-200",
  },
  buttons: {
    container: "space-x-2",
    tab: "rounded-lg border border-gray-300",
    active: "bg-blue-600 text-white border-blue-600",
    inactive: "bg-white text-gray-700 hover:bg-gray-50",
  },
};

export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = "underline",
  size = "md",
  fullWidth = false,
  className = "",
  tabClassName = "",
  activeTabClassName = "",
}: TabsProps) {
  const styles = variantClasses[variant];
  const sizes = sizeClasses[size];

  return (
    <div
      className={`flex ${styles.container} ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && onChange(tab.id)}
            disabled={tab.disabled}
            className={`
              ${sizes.tab}
              ${styles.tab}
              ${fullWidth ? "flex-1" : ""}
              ${
                isActive
                  ? `${styles.active} ${activeTabClassName}`
                  : `${styles.inactive} ${tabClassName}`
              }
              ${tab.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              font-medium transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              disabled:hover:bg-transparent
            `}
            role="tab"
            aria-selected={isActive}
            aria-disabled={tab.disabled}
          >
            <span className="flex items-center justify-center space-x-2">
              {Icon && <Icon className={sizes.icon} />}
              <span>{tab.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

// Optional: Vertical Tabs variant
interface VerticalTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  tabClassName?: string;
  activeTabClassName?: string;
}

export function VerticalTabs({
  tabs,
  activeTab,
  onChange,
  className = "",
  tabClassName = "",
  activeTabClassName = "",
}: VerticalTabsProps) {
  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && onChange(tab.id)}
            disabled={tab.disabled}
            className={`
              px-4 py-3 text-left rounded-lg transition-colors duration-200
              ${
                isActive
                  ? `bg-blue-50 text-blue-600 ${activeTabClassName}`
                  : `text-gray-700 hover:bg-gray-50 ${tabClassName}`
              }
              ${tab.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              focus:outline-none focus:ring-2 focus:ring-blue-500
            `}
            role="tab"
            aria-selected={isActive}
          >
            <span className="flex items-center space-x-3">
              {Icon && <Icon className="w-5 h-5" />}
              <span className="font-medium">{tab.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}


