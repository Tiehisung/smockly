// src/pages/admin/AdminCategories.tsx
import { useState } from "react";
import { Link } from "react-router-dom";

import {
  Plus,
  Edit,
  Trash2,
  ChevronRight,
  ChevronDown,
  EyeOff,
  Star,
  MoveUp,
  MoveDown,
  AlertCircle,
  Package,
} from "lucide-react";

import { LoadingSpinner } from "../../../components/common/LoadingSpinner";
import {
  useGetCategoryTreeQuery,
  useDeleteCategoryMutation,
  useReorderCategoriesMutation,
  // useGetCategoriesQuery,
} from "../../../store/api/categoriesApi";

import { smartToast } from "../../../lib/toast";
import type { ICategory } from "../../../types/category.types";

export function AdminCategories() {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { data: categories, isLoading } = useGetCategoryTreeQuery();
  // const { data: allCats } = useGetCategoriesQuery({});
  // console.log(allCats);
  const [deleteCategory] = useDeleteCategoryMutation();
  const [reorderCategories] = useReorderCategoriesMutation();

  const toggleExpand = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleDelete = async (categoryId: string) => {
    try {
      const response = await deleteCategory(categoryId).unwrap();
      smartToast(response);
      setDeleteConfirm(null);
    } catch (error: any) {
      smartToast({ error });
    }
  };

  const handleMoveUp = async (
    index: number,
    category: ICategory,
    list: ICategory[],
  ) => {
    if (index === 0) return;

    const newOrder = [
      { id: list[index - 1]._id, order: category.displayOrder },
      { id: category._id, order: list[index - 1].displayOrder },
    ];

    try {
      const response = await reorderCategories(newOrder).unwrap();
      smartToast(response);
    } catch (error) {
      smartToast({ error });
    }
  };

  const handleMoveDown = async (
    index: number,
    category: ICategory,
    list: ICategory[],
  ) => {
    if (index === list.length - 1) return;

    const newOrder = [
      { id: category._id, order: list[index + 1].displayOrder },
      { id: list[index + 1]._id, order: category.displayOrder },
    ];

    try {
      const response = await reorderCategories(newOrder).unwrap();
      smartToast(response);
    } catch (error) {
      smartToast({ error });
    }
  };

  const renderCategoryTree = (
    categories: ICategory[] = [],
    level: number = 0,
  ) => {
    return categories.map((category, index) => (
      <div key={category._id} className="space-y-2">
        <div
          className={`flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${
            level > 0 ? "ml-8 border-l-2 border-blue-200" : ""
          }`}
        >
          <div className="flex items-center space-x-4 flex-1">
            {/* Expand/collapse button for categories with children */}
            {category.children && category.children.length > 0 ? (
              <button
                onClick={() => toggleExpand(category._id)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                {expandedCategories.has(category._id) ? (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                )}
              </button>
            ) : (
              <div className="w-7" /> // Spacer for alignment
            )}

            {/* Category image/icon */}
            <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden shrink-0">
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  {category.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Category info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h3 className="font-medium text-gray-900">{category.name}</h3>
                <span className="text-xs text-gray-500">({category.slug})</span>
                {!category.visible && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                    <EyeOff className="w-3 h-3 mr-1" />
                    Hidden
                  </span>
                )}
                {category.featured && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-700">
                    <Star className="w-3 h-3 mr-1 fill-yellow-500" />
                    Featured
                  </span>
                )}
              </div>
              {category.description && (
                <p className="text-sm text-gray-500 line-clamp-1">
                  {category.description}
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{category.stats?.productCount || 0} products</span>
              {category.children && (
                <span>{category.children.length} subcategories</span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleMoveUp(index, category, categories)}
                disabled={index === 0}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                title="Move up"
              >
                <MoveUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleMoveDown(index, category, categories)}
                disabled={index === categories.length - 1}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                title="Move down"
              >
                <MoveDown className="w-4 h-4" />
              </button>
              <Link
                to={`/admin/categories/edit/${category._id}`}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                title="Edit category"
              >
                <Edit className="w-4 h-4" />
              </Link>
              {deleteConfirm === category._id ? (
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setDeleteConfirm(category._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  title="Delete category"
                  disabled={category.children && category.children.length > 0}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Child categories */}
        {expandedCategories.has(category._id) &&
          category.children &&
          category.children.length > 0 && (
            <div className="ml-8 space-y-2">
              {renderCategoryTree(category.children, level + 1)}
            </div>
          )}
      </div>
    ));
  };

  if (isLoading) return <LoadingSpinner page />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 mt-1">
            Manage your product categories and hierarchy
          </p>
        </div>
        <Link
          to="/admin/categories/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Category
        </Link>
      </div>

      {/* Warning for categories with children */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
        <AlertCircle className="w-5 h-5 text-blue-600 mr-3 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700">
          <p className="font-medium mb-1">About Category Deletion</p>
          <p>
            Categories with subcategories cannot be deleted. You must delete or
            move all subcategories first.
          </p>
        </div>
      </div>

      {/* Categories Tree */}
      {categories && (categories?.data?.length || 0) > 0 ? (
        <div className="space-y-2">{renderCategoryTree(categories?.data)}</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No categories yet
          </h3>
          <p className="text-gray-500 mb-6">
            Get started by creating your first category
          </p>
          <Link
            to="/admin/categories/new"
            className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Category
          </Link>
        </div>
      )}
    </div>
  );
}
