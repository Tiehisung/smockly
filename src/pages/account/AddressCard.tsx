// src/components/address/AddressCard.tsx
import {
  PencilIcon,
  TrashIcon,
  HomeIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";

interface AddressCardProps {
  address: any;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
  showActions?: boolean;
}

export function AddressCard({
  address,
  onEdit,
  onDelete,
  isDeleting = false,
  showActions = true,
}: AddressCardProps) {
  const getCountryName = (code: string) => {
    const countries: Record<string, string> = {
      GH: "Ghana",
      NG: "Nigeria",
      US: "United States",
      UK: "United Kingdom",
      CA: "Canada",
      ZA: "South Africa",
      KE: "Kenya",
      EG: "Egypt",
    };
    return countries[code] || code;
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-6 border-2 ${
        address.isDefault ? "border-blue-500" : "border-transparent"
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          {address.type === "shipping" ? (
            <HomeIcon className="w-5 h-5 text-gray-500" />
          ) : (
            <BuildingOfficeIcon className="w-5 h-5 text-gray-500" />
          )}
          <span className="font-medium text-gray-900 capitalize">
            {address.type} Address
          </span>
          {address.isDefault && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Default
            </span>
          )}
        </div>
        {showActions && (
          <div className="flex items-center space-x-2">
            <button
              onClick={onEdit}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
              title="Edit address"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            {!address.isDefault && (
              <button
                onClick={onDelete}
                disabled={isDeleting}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                title="Delete address"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="space-y-1 text-sm text-gray-600">
        <p className="font-medium text-gray-900">
          {address.firstName} {address.lastName}
        </p>
        <p>{address.addressLine1}</p>
        {address.addressLine2 && <p>{address.addressLine2}</p>}
        <p>
          {address.city}, {address.state} {address.postalCode}
        </p>
        <p>{getCountryName(address.country)}</p>
        <p className="mt-2">{address.phone}</p>
      </div>
    </div>
  );
}
