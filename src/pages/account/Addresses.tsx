// src/pages/account/Addresses.tsx
import { useState } from "react";

import { LoadingSpinner } from "../../components/common/LoadingSpinner";

import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  HomeIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { Drawer } from "../../components/headlessUI/Drawer";
import {
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} from "../../store/api/user.api";
import { Button } from "../../components/Button";
import { AddressForm } from "./AddressForm";
import { AddressCard } from "./AddressCard";

export function Addresses() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { data: addresses, isLoading } = useGetAddressesQuery();
  const [addAddress] = useAddAddressMutation();
  const [updateAddress] = useUpdateAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  const handleAddAddress = () => {
    setEditingAddress(null);
    setDrawerOpen(true);
  };

  const handleEditAddress = (address: any) => {
    setEditingAddress(address);
    setDrawerOpen(true);
  };

  const [deletingId, setDeletingId] = useState("");
  const handleDeleteAddress = async (addressId: string) => {
    try {
      setDeletingId(addressId);
      await deleteAddress(addressId).unwrap();
      toast.success("Address deleted successfully");
      setDeleteConfirm(null);
    } catch (error) {
      toast.error("Failed to delete address");
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingAddress) {
        await updateAddress({ addressId: editingAddress._id, data }).unwrap();
        toast.success("Address updated successfully");
      } else {
        await addAddress(data).unwrap();
        toast.success("Address added successfully");
      }
      setDrawerOpen(false);
    } catch (error) {
      toast.error(
        editingAddress ? "Failed to update address" : "Failed to add address",
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Addresses</h1>
          <p className="text-gray-500 mt-1">
            Manage your shipping and billing addresses
          </p>
        </div>
        <Button onClick={handleAddAddress}>
          <PlusIcon className="w-5 h-5" /> Add New Address
        </Button>
      </div>
      {/* Addresses Grid */}
      {addresses && addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address: any) => (
            <div
              key={address._id}
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
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditAddress(address)}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  {!address.isDefault &&
                    (deleteConfirm === address._id ? (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleDeleteAddress(address._id)}
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          ✗
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(address._id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    ))}
                </div>
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
                <p>{address.country}</p>
                <p className="mt-2">{address.phone}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <HomeIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No addresses yet
          </h3>
          <p className="text-gray-500 mb-6">
            Add your first address to make checkout faster
          </p>
          <Button onClick={handleAddAddress}>
            <PlusIcon className="w-5 h-5" />
            Add Address
          </Button>
        </div>
      )}
      {/* Address Form Drawer */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editingAddress ? "Edit Address" : "Add New Address"}
        size="md"
        position="right"
      >
        <div className="p-6">
          <AddressForm
            initialData={editingAddress}
            onSubmit={handleSubmit}
            onCancel={() => setDrawerOpen(false)}
          />
        </div>
      </Drawer>
      {/* For displaying addresses: */}
      {addresses?.map((address) => (
        <AddressCard
          key={address._id}
          address={address}
          onEdit={() => handleEditAddress(address)}
          onDelete={() => handleDeleteAddress(address?._id as string)}
          isDeleting={deletingId === address._id}
        />
      ))}
    </div>
  );
}
