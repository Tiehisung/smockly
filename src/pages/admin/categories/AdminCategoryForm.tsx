// src/pages/admin/AdminCategoryForm.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, X, Upload } from "lucide-react";

import { LoadingSpinner } from "../../../components/common/LoadingSpinner";
import {
  useGetCategoryTreeQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useGetCategoryBySlugQuery,
} from "../../../store/api/categoriesApi";
import { smartToast } from "../../../lib/toast";
import { INPUT } from "../../../components/input/Input";
import { CHECKBOX } from "../../../components/input/Checkbox";
import { SELECT } from "../../../components/input/Select";
import { TEXTAREA } from "../../../components/input/TextArea";
import type { IApiResponse } from "../../../types";
import { layoutOptions, sortOptions } from "../../../data/options";

const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().optional(),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  parent: z.string().optional(),
  displayOrder: z.number().default(0),
  featured: z.boolean().default(false),
  visible: z.boolean().default(true),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      keywords: z.string().optional(),
    })
    .optional(),
  settings: z
    .object({
      showProducts: z.boolean().default(true),
      showSubCategories: z.boolean().default(true),
      layout: z.enum(["grid", "list", "compact"]).default("grid"),
      productsPerPage: z.number().default(12),
      defaultSort: z.string().default("newest"),
      filterable: z.boolean().default(true),
    })
    .optional(),
});
type CategoryFormData = z.infer<typeof categorySchema>;

export function AdminCategoryForm() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const isEditing = !!categoryId;

  const { data: category, isLoading: categoryLoading } =
    useGetCategoryBySlugQuery(categoryId!, {
      skip: !isEditing,
    });

  console.log({ category });
  const { data: catTrees } = useGetCategoryTreeQuery();
  const categoryTrees = catTrees?.data;

  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const {
    control,
    handleSubmit,

    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema as any),
    defaultValues: {
      name: "",
      description: "",
      shortDescription: "",
      displayOrder: 0,
      featured: false,
      visible: true,
      seo: {
        title: "",
        description: "",
        keywords: "",
      },
      settings: {
        showProducts: true,
        showSubCategories: true,
        layout: "grid",
        productsPerPage: 12,
        defaultSort: "newest",
        filterable: true,
      },
    },
  });

  useEffect(() => {
    if (category?.data) {
      const _data = category?.data;
      reset({
        ..._data,
        parent: _data.parent?.toString(),
        seo: { ..._data.seo, keywords: _data.seo?.keywords.toString() || "" },
      });
      if (_data.image) {
        setImagePreview(_data.image);
      }
    }
  }, [category, reset]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    }
  };

  // Prepare parent category options
  const parentOptions = [
    { value: "", label: "None (Top Level)" },
    ...(categoryTrees?.map((cat) => ({
      value: cat._id,
      label: cat.name,
    })) || []),
  ];

  const onSubmit = async (data: CategoryFormData) => {
    try {
      const formData = new FormData();

      // Append image if uploaded
      if (imageFile) {
        formData.append("image", imageFile);
      }

      formData.append("data", JSON.stringify(data));

      let response: IApiResponse;

      if (isEditing) {
        console.log("updating", formData);
        response = await updateCategory({
          _id: categoryId!,
          formData: formData,
        }).unwrap();

        smartToast(response);
      } else {
        response = await createCategory(formData).unwrap();
        smartToast(response);
      }
      if (response.success) navigate("/admin/categories");
    } catch (error: any) {
      smartToast({ error });
    }
  };

  if (isEditing && categoryLoading) {
    return <LoadingSpinner page />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? "Edit Category" : "Create New Category"}
        </h1>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => navigate("/admin/categories")}
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
            {isCreating || isUpdating ? "Saving..." : "Save Category"}
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
                    label="Category Name *"
                    placeholder="e.g., Smocks"
                    error={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name="slug"
                control={control}
                render={({ field, fieldState }) => (
                  <INPUT
                    {...field}
                    label="Slug (leave blank to auto-generate)"
                    placeholder="smocks"
                    error={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name="parent"
                control={control}
                render={({ field, fieldState }) => (
                  <SELECT
                    {...field}
                    label="Parent Category"
                    options={parentOptions}
                    error={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name="shortDescription"
                control={control}
                render={({ field, fieldState }) => (
                  <INPUT
                    {...field}
                    label="Short Description"
                    placeholder="Brief description for category cards"
                    error={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name="description"
                control={control}
                render={({ field, fieldState }) => (
                  <TEXTAREA
                    {...field}
                    label="Full Description"
                    placeholder="Detailed category description"
                    rows={4}
                    error={fieldState.error?.message}
                  />
                )}
              />
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">SEO Settings</h2>

            <div className="space-y-4">
              <Controller
                name="seo.title"
                control={control}
                render={({ field, fieldState }) => (
                  <INPUT
                    {...field}
                    label="SEO Title"
                    placeholder="Title for search engines"
                    error={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name="seo.description"
                control={control}
                render={({ field, fieldState }) => (
                  <TEXTAREA
                    {...field}
                    label="SEO Description"
                    placeholder="Meta description for search engines"
                    rows={3}
                    error={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name="seo.keywords"
                control={control}
                render={({ field, fieldState }) => (
                  <INPUT
                    {...field}
                    label="Keywords (comma-separated)"
                    placeholder="smocks, traditional wear, african fashion"
                    error={fieldState.error?.message}
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Category Image */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Category Image</h2>

            <div className="space-y-4">
              {imagePreview && (
                <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Category preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <label className="block">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">
                    {imagePreview ? "Change image" : "Upload image"}
                  </span>
                  <INPUT
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </label>
            </div>
          </div>

          {/* Display Settings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Display Settings</h2>

            <div className="space-y-4">
              <Controller
                name="displayOrder"
                control={control}
                render={({ field, fieldState }) => (
                  <INPUT
                    {...field}
                    type="number"
                    label="Display Order"
                    min="0"
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    error={fieldState.error?.message}
                  />
                )}
              />

              <div className="space-y-2">
                <Controller
                  name="featured"
                  control={control}
                  render={({ field, fieldState }) => (
                    <CHECKBOX
                      checked={field.value}
                      onChange={field.onChange}
                      label="Featured category (show on homepage)"
                      error={fieldState.error?.message}
                    />
                  )}
                />

                <Controller
                  name="visible"
                  control={control}
                  render={({ field, fieldState }) => (
                    <CHECKBOX
                      checked={field.value}
                      onChange={field.onChange}
                      label="Visible on storefront"
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Category Settings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Category Settings</h2>

            <div className="space-y-4">
              <Controller
                name="settings.showProducts"
                control={control}
                render={({ field, fieldState }) => (
                  <CHECKBOX
                    checked={field.value}
                    onChange={field.onChange}
                    label="Show products in this category"
                    error={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name="settings.showSubCategories"
                control={control}
                render={({ field, fieldState }) => (
                  <CHECKBOX
                    checked={field.value}
                    onChange={field.onChange}
                    label="Show subcategories"
                    error={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name="settings.filterable"
                control={control}
                render={({ field, fieldState }) => (
                  <CHECKBOX
                    checked={field.value}
                    onChange={field.onChange}
                    label="Allow filtering"
                    error={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name="settings.layout"
                control={control}
                render={({ field, fieldState }) => (
                  <SELECT
                    {...field}
                    label="Default Layout"
                    options={layoutOptions}
                    error={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name="settings.productsPerPage"
                control={control}
                render={({ field, fieldState }) => (
                  <INPUT
                    {...field}
                    type="number"
                    label="Products Per Page"
                    min="1"
                    max="100"
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    error={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name="settings.defaultSort"
                control={control}
                render={({ field, fieldState }) => (
                  <SELECT
                    {...field}
                    label="Default Sort Order"
                    options={sortOptions}
                    error={fieldState.error?.message}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
