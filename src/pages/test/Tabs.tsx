import { useState } from "react";
import { Tabs, VerticalTabs } from "../../components/tabs";
import {
  BellIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

// Example usage component
export function TabsExample() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: UserIcon },
    { id: "notifications", label: "Notifications", icon: BellIcon },
    { id: "privacy", label: "Privacy", icon: ShieldCheckIcon },
    { id: "billing", label: "Billing", icon: CreditCardIcon, disabled: true },
  ];

  return (
    <div className="space-y-6">
      {/* Underline Tabs (default) */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Pills Variant */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pills"
      />

      {/* Button Variant */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="buttons"
        fullWidth
      />

      {/* Vertical Tabs */}
      <div className="flex space-x-6">
        <VerticalTabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
          className="w-48"
        />
        <div className="flex-1 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold">Content for {activeTab}</h2>
        </div>
      </div>
    </div>
  );
}
