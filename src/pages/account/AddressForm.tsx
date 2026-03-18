// src/components/forms/AddressForm.tsx
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  MapPinIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { INPUT } from "../../components/input/Input";
import { Button } from "../../components/buttons/Button";
import {
  useAddAddressMutation,
  useUpdateAddressMutation,
} from "../../store/api/user.api";
import { smartToast } from "../../lib/toast";
import { CHECKBOX } from "../../components/input/Checkbox";

const addressSchema = z.object({
  type: z.enum(["shipping", "billing"]),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State/Region is required"),
  postalCode: z.string().min(3, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
  phone: z.string().min(8, "Phone number is required"),
  isDefault: z.boolean().default(false),
});

export type AddressFormData = z.infer<typeof addressSchema>;

interface AddressFormProps {
  initialData?: Partial<AddressFormData> & { _id?: string };
  onCancel?: () => void;
  onSuccess?: () => void;
}

// Common countries list
const countries = [
  { value: "GH", label: "Ghana" },
  { value: "NG", label: "Nigeria" },
  { value: "US", label: "United States" },
  { value: "UK", label: "United Kingdom" },
  { value: "CA", label: "Canada" },
  { value: "ZA", label: "South Africa" },
  { value: "KE", label: "Kenya" },
  { value: "EG", label: "Egypt" },
  { value: "MA", label: "Morocco" },
  { value: "SN", label: "Senegal" },
  { value: "CI", label: "Côte d'Ivoire" },
  { value: "CM", label: "Cameroon" },
];

export function AddressForm({
  initialData,
  onCancel,
  onSuccess,
}: AddressFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema as any),
    defaultValues: {
      type: "shipping",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "GH",
      phone: "",
      isDefault: false,
      ...initialData,
    },
  });
  const [addAddress, { isLoading: isAdding }] = useAddAddressMutation();
  const [updateAddress, { isLoading: isEditing }] = useUpdateAddressMutation();

  const handleAdd = async (data: any) => {
    try {
      if (initialData?._id) {
        const result = await updateAddress({
          addressId: initialData._id,
          data,
        }).unwrap();
        smartToast(result);
      } else {
        const result = await addAddress(data).unwrap();
        smartToast(result);
      }
      onSuccess?.();
      onCancel?.();
    } catch (error: any) {
      smartToast(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleAdd)} className="space-y-6">
      {/* Address Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Address Type
        </label>
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <>
                <button
                  type="button"
                  onClick={() => field.onChange("shipping")}
                  className={`p-4 border rounded-lg text-center transition-colors ${
                    field.value === "shipping"
                      ? "border-blue-600 bg-blue-50 text-blue-600"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <HomeIcon className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Shipping</span>
                </button>
                <button
                  type="button"
                  onClick={() => field.onChange("billing")}
                  className={`p-4 border rounded-lg text-center transition-colors ${
                    field.value === "billing"
                      ? "border-blue-600 bg-blue-50 text-blue-600"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <BuildingOfficeIcon className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Billing</span>
                </button>
              </>
            )}
          />
        </div>
        {errors.type && (
          <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
        )}
      </div>

      {/* Address Line 1 */}
      <Controller
        name="addressLine1"
        control={control}
        render={({ field }) => (
          <INPUT
            {...field}
            label="Street Address"
            placeholder="123 Main St"
            error={errors.addressLine1?.message}
            leftIcon={<MapPinIcon className="w-5 h-5 text-gray-400" />}
          />
        )}
      />

      {/* Address Line 2 (Optional) */}
      <Controller
        name="addressLine2"
        control={control}
        render={({ field }) => (
          <INPUT
            {...field}
            label="Apartment, Suite, etc. (Optional)"
            placeholder="Apt 4B"
            error={errors.addressLine2?.message}
          />
        )}
      />

      {/* City, State, Postal Code */}
      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="city"
          control={control}
          render={({ field }) => (
            <INPUT
              {...field}
              label="City"
              placeholder="Accra"
              error={errors.city?.message}
            />
          )}
        />

        <Controller
          name="state"
          control={control}
          render={({ field }) => (
            <INPUT
              {...field}
              label="State / Region"
              placeholder="Greater Accra"
              error={errors.state?.message}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Postal Code */}
        <Controller
          name="postalCode"
          control={control}
          render={({ field }) => (
            <INPUT
              {...field}
              label="Postal Code"
              placeholder="00233"
              error={errors.postalCode?.message}
            />
          )}
        />

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {countries.map((country) => (
                  <option key={country.value} value={country.value}>
                    {country.label}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.country && (
            <p className="mt-1 text-sm text-red-600">
              {errors.country.message}
            </p>
          )}
        </div>
      </div>

      {/* Phone Number */}
      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <INPUT
            {...field}
            label="Phone Number"
            placeholder="+233 XX XXX XXXX"
            error={errors.phone?.message}
            leftIcon={<PhoneIcon className="w-5 h-5 text-gray-400" />}
          />
        )}
      />

      {/* Default Address Checkbox */}
      <Controller
        name="isDefault"
        control={control}
        render={({ field }) => (
          <CHECKBOX
            checked={field.value}
            onChange={field.onChange}
            label="Set as default address"
          />
        )}
      />

      {/* Form Actions */}
      <div className="flex space-x-3 pt-4">
        <Button
          type="submit"
          isLoading={isAdding || isEditing}
          className="flex-1"
        >
          {initialData?._id ? "Update Address" : "Save Address"}
        </Button>

        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
