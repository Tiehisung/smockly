// src/pages/admin/AdminProductForm.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, X, Trash2, ChevronDown, ChevronUp, Star } from "lucide-react";
import toast from "react-hot-toast";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";
import {
  useAdminGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
} from "../../../store/api/products.adminApi";
import { useGetCategoriesQuery } from "../../../store/api/categoriesApi";
import ListInput from "../../../components/input/List";
import { genderOptions } from "../../../data/options";
import { INPUT } from "../../../components/input/Input";
import { SELECT } from "../../../components/input/Select";
import { TEXTAREA } from "../../../components/input/TextArea";
import { CHECKBOX } from "../../../components/input/Checkbox";
import { smartToast } from "../../../lib/toast";
import FileInput from "../../../components/input/File";

// Form validation schema
const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  shortDescription: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().optional(),
  price: z.object({
    amount: z.number().min(0, "Price must be positive"),
    currency: z.string().default("GHS"),
  }),
  compareAtPrice: z
    .object({
      amount: z.number().min(0).optional(),
      currency: z.string().default("GHS"),
    })
    .optional(),
  sku: z.string().min(1, "SKU is required"),
  inventory: z.object({
    quantity: z.number().min(0, "Quantity must be positive"),
    lowStockThreshold: z.number().min(1, "Threshold must be at least 1"),
    trackQuantity: z.boolean().default(true),
    allowBackorder: z.boolean().default(false),
  }),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        alt: z.string().optional(),
        isPrimary: z.boolean().default(false),
      }),
    )
    .min(1, "At least one image is required"),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  featured: z.boolean().default(false),
  bestseller: z.boolean().default(false),
  newArrival: z.boolean().default(false),
  onSale: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  attributes: z
    .object({
      sizes: z.array(z.string()).optional(),
      colors: z
        .array(
          z.object({
            name: z.string(),
            code: z.string(),
          }),
        )
        .optional(),
      materials: z.array(z.string()).optional(),
      styles: z.array(z.string()).optional(),
      occasion: z.array(z.string()).optional(),
      gender: z.string().optional(),
      handmade: z.boolean().optional(),
    })
    .optional(),
  hasVariants: z.boolean().default(false),
  variants: z
    .array(
      z.object({
        sku: z.string(),
        name: z.string(),
        options: z.array(
          z.object({
            name: z.string(),
            value: z.string(),
          }),
        ),
        price: z.number().optional(),
        inventory: z.object({
          quantity: z.number().min(0),
          lowStockThreshold: z.number().min(1),
        }),
        isDefault: z.boolean().default(false),
      }),
    )
    .optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export function AdminProductForm() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const isEditing = !!productId;

  const { data: categories, isLoading: categoriesLoading } =
    useGetCategoriesQuery({});
  const { data: product, isLoading: productLoading } =
    useAdminGetProductByIdQuery(productId!, {
      skip: !isEditing,
    });

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  console.log({ imagePreviews });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema as any),
    defaultValues: {
      price: { amount: 0, currency: "GHS" },
      inventory: {
        quantity: 0,
        lowStockThreshold: 5,
        trackQuantity: true,
        allowBackorder: false,
      },
      images: [],
      tags: [],
      status: "draft",
      featured: false,
      bestseller: false,
      newArrival: false,
      onSale: false,
      hasVariants: false,
      attributes: {},
    },
  });

  // Load product data when editing
  useEffect(() => {
    if (product) {
      reset(product?.data as any);

      // If there are existing images, set previews
      if (product?.data?.images && product?.data.images.length > 0) {
        setImagePreviews(product?.data.images.map((img: any) => img.url));
      }
    }
  }, [product, reset]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles((prev) => [...prev, ...files]);

    // Create previews
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);

    // Add to form images
    const currentImages = watch("images") || [];
    const newImages = files.map((file, index) => ({
      url: newPreviews[index],
      alt: file.name,
      isPrimary: currentImages.length === 0 && index === 0,
    }));
    setValue("images", [...currentImages, ...newImages]);
  };

  const removeImage = (index: number) => {
    if (index < imageFiles.length) {
      // Remove from files if it's a new upload
      setImageFiles((prev) => prev.filter((_, i) => i !== index));
    }

    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });

    const currentImages = watch("images");
    setValue(
      "images",
      currentImages.filter((_, i) => i !== index),
    );
  };

  const setPrimaryImage = (index: number) => {
    const currentImages = watch("images");
    const updated = currentImages.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    setValue("images", updated);
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      const formData = new FormData();

      // Files
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      // Append existing image metadata if editing
      let _data: any = data;
      if (isEditing && data.images) {
        const existingImages = data.images.filter(
          (img) => !img.url.startsWith("blob:"),
        );
        if (existingImages.length > 0) {
          _data.existingImages = existingImages;
        }
      }

      formData.append("data", JSON.stringify(_data));

      if (isEditing) {
        const response = await updateProduct({
          _id: productId!,
          data: formData,
        }).unwrap();
        smartToast(response);
      } else {
        const response = await createProduct(formData).unwrap();
        smartToast(response);
      }
      navigate("/admin/products");
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast.error(
        error?.data?.message ||
          `Failed to ${isEditing ? "update" : "create"} product`,
      );
    }
  };

  if ((isEditing && productLoading) || categoriesLoading) {
    return <LoadingSpinner page />;
  }

  // Prepare category options for Select component
 
  const categoryOptions = [
    { value: "", label: "Select category" },
    ...(categories?.data?.map((cat) => ({
      value: cat.slug,
      label: cat.name,
    })) || []),
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? "Edit Product" : "Add New Product"}
        </h1>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isCreating || isUpdating}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {isCreating || isUpdating ? "Saving..." : "Save Product"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

            <div className="space-y-4">
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <INPUT
                    {...field}
                    label="Product Name *"
                    placeholder="e.g., Classic Northern Smock"
                    error={fieldState.error?.message}
                  />
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="sku"
                  control={control}
                  render={({ field, fieldState }) => (
                    <INPUT
                      {...field}
                      label="SKU *"
                      placeholder="SMK-001"
                      error={fieldState.error?.message}
                    />
                  )}
                />

                <Controller
                  name="category"
                  control={control}
                  render={({ field, fieldState }) => (
                    <SELECT
                      {...field}
                      label="Category *"
                      options={categoryOptions}
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </div>

              <Controller
                name="shortDescription"
                control={control}
                render={({ field }) => (
                  <TEXTAREA
                    {...field}
                    label="Short Description"
                    placeholder="Brief description for product cards"
                    rows={2}
                  />
                )}
              />

              <Controller
                name="description"
                control={control}
                render={({ field, fieldState }) => (
                  <TEXTAREA
                    {...field}
                    label="Full Description *"
                    placeholder="Detailed product description"
                    rows={5}
                    error={fieldState.error?.message}
                  />
                )}
              />
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Pricing & Inventory</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="price.amount"
                  control={control}
                  render={({ field, fieldState }) => (
                    <INPUT
                      {...field}
                      type="number"
                      step="0.01"
                      label="Price *"
                      leftIcon={<span className="text-gray-500">₵</span>}
                      placeholder="0.00"
                      error={fieldState.error?.message}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  )}
                />

                <Controller
                  name="compareAtPrice.amount"
                  control={control}
                  render={({ field }) => (
                    <INPUT
                      {...field}
                      type="number"
                      step="0.01"
                      label="Compare at Price"
                      leftIcon={<span className="text-gray-500">₵</span>}
                      placeholder="0.00"
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            ? parseFloat(e.target.value)
                            : undefined,
                        )
                      }
                    />
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="inventory.quantity"
                  control={control}
                  render={({ field }) => (
                    <INPUT
                      {...field}
                      type="number"
                      min="0"
                      label="Quantity *"
                      placeholder="0"
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  )}
                />

                <Controller
                  name="inventory.lowStockThreshold"
                  control={control}
                  render={({ field }) => (
                    <INPUT
                      {...field}
                      type="number"
                      min="1"
                      label="Low Stock Threshold"
                      placeholder="5"
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  )}
                />
              </div>

              <div className="flex space-x-6">
                <Controller
                  name="inventory.trackQuantity"
                  control={control}
                  render={({ field }) => (
                    <CHECKBOX
                      checked={field.value}
                      onChange={field.onChange}
                      label="Track Quantity"
                    />
                  )}
                />
                <Controller
                  name="inventory.allowBackorder"
                  control={control}
                  render={({ field }) => (
                    <CHECKBOX
                      checked={field.value}
                      onChange={field.onChange}
                      label="Allow Backorders"
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Product Images</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                {watch("images")?.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.url}
                      alt={image.alt || `Product ${index + 1}`}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    {image.isPrimary && (
                      <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        Primary
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                      {!image.isPrimary && (
                        <button
                          type="button"
                          onClick={() => setPrimaryImage(index)}
                          className="p-1 bg-white rounded-full hover:bg-gray-100"
                          title="Set as primary"
                        >
                          <Star className="w-4 h-4 text-yellow-500" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-1 bg-white rounded-full hover:bg-gray-100"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}

                <FileInput onChange={handleImageUpload} />
              </div>
              {errors.images && (
                <p className="text-sm text-red-600">{errors.images.message}</p>
              )}
            </div>
          </div>

          {/* Tags */}
          <ListInput
            defaultValues={watch("tags")}
            onChange={(vals) => setValue("tags", vals)}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Status</h2>

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <SELECT
                  {...field}
                  options={[
                    { value: "draft", label: "Draft" },
                    { value: "published", label: "Published" },
                    { value: "archived", label: "Archived" },
                  ]}
                />
              )}
            />
          </div>

          {/* Product Badges */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Product Badges</h2>

            <div className="space-y-3">
              <Controller
                name="featured"
                control={control}
                render={({ field }) => (
                  <CHECKBOX
                    checked={field.value}
                    onChange={field.onChange}
                    label="Featured Product"
                  />
                )}
              />
              <Controller
                name="bestseller"
                control={control}
                render={({ field }) => (
                  <CHECKBOX
                    checked={field.value}
                    onChange={field.onChange}
                    label="Bestseller"
                  />
                )}
              />
              <Controller
                name="newArrival"
                control={control}
                render={({ field }) => (
                  <CHECKBOX
                    checked={field.value}
                    onChange={field.onChange}
                    label="New Arrival"
                  />
                )}
              />
              <Controller
                name="onSale"
                control={control}
                render={({ field }) => (
                  <CHECKBOX
                    checked={field.value}
                    onChange={field.onChange}
                    label="On Sale"
                  />
                )}
              />
            </div>
          </div>

          {/* Advanced Options Toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full bg-white rounded-lg shadow-sm p-4 flex items-center justify-between text-gray-700 hover:bg-gray-50"
          >
            <span className="font-medium">Advanced Options</span>
            {showAdvanced ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>

          {/* Advanced Options */}
          {showAdvanced && (
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
              <Controller
                name="attributes.sizes"
                control={control}
                render={({ field }) => (
                  <INPUT
                    label="Sizes (comma-separated)"
                    placeholder="S, M, L, XL"
                    value={field.value?.join(", ") || ""}
                    onChange={(e) => {
                      const sizes = e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean);
                      field.onChange(sizes);
                    }}
                    suggestions={["S", "M", "L", "XL"]}
                  />
                )}
              />

              <Controller
                name="attributes.materials"
                control={control}
                render={({ field }) => (
                  <INPUT
                    label="Materials (comma-separated)"
                    placeholder="Cotton, Polyester, Linen"
                    value={field.value?.join(", ") || ""}
                    onChange={(e) => {
                      const materials = e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean);
                      field.onChange(materials);
                    }}
                    suggestions={["Cotton", "Polyester", "Linen"]}
                  />
                )}
              />

              <Controller
                name="attributes.styles"
                control={control}
                render={({ field }) => (
                  <INPUT
                    label="Styles (comma-separated)"
                    placeholder="Traditional, Modern, Classic"
                    value={field.value?.join(", ") || ""}
                    onChange={(e) => {
                      const styles = e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean);
                      field.onChange(styles);
                    }}
                    suggestions={["Traditional", "Modern", "Classic"]}
                  />
                )}
              />

              <Controller
                name="attributes.occasion"
                control={control}
                render={({ field }) => (
                  <INPUT
                    label="Occasion (comma-separated)"
                    placeholder="Wedding, Festival, Casual"
                    value={field.value?.join(", ") || ""}
                    onChange={(e) => {
                      const occasions = e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean);
                      field.onChange(occasions);
                    }}
                    suggestions={["Wedding", "Festival", "Casual"]}
                  />
                )}
              />

              <Controller
                name="attributes.gender"
                control={control}
                render={({ field }) => (
                  <SELECT {...field} label="Gender" options={genderOptions} />
                )}
              />

              <Controller
                name="attributes.handmade"
                control={control}
                render={({ field }) => (
                  <CHECKBOX
                    checked={field.value}
                    onChange={field.onChange}
                    label="Handmade"
                  />
                )}
              />
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
