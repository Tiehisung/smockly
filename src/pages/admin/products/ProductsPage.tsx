// src/pages/admin/AdminProducts.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useAdminGetProductsQuery,
  useDeleteProductMutation,
  useBulkDeleteProductsMutation,
} from "../../../store/api/products.adminApi";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Copy,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";
import type { EProductStatus } from "../../../types/product.types";

export function AdminProducts() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null,
  );
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

  const {
    data: productsData,
    isLoading,
    refetch,
  } = useAdminGetProductsQuery({
    page,
    limit: 10,
    search: search || undefined,
    status: (status || undefined) as EProductStatus,
  });

  const [deleteProduct] = useDeleteProductMutation();
  const [bulkDeleteProducts] = useBulkDeleteProductsMutation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    refetch();
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id).unwrap();
      toast.success("Product deleted successfully");
      setShowDeleteConfirm(null);
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const handleBulkDelete = async () => {
    try {
      await bulkDeleteProducts({ ids: selectedProducts }).unwrap();
      toast.success(`${selectedProducts.length} products deleted`);
      setSelectedProducts([]);
      setShowBulkDeleteConfirm(false);
    } catch (error) {
      toast.error("Failed to delete products");
    }
  };

  const handleSelectAll = () => {
    if (
      productsData &&
      selectedProducts.length === productsData?.data?.length
    ) {
      setSelectedProducts([]);
    } else if (productsData) {
      setSelectedProducts(productsData?.data?.map((p) => p._id) as string[]);
    }
  };

  const handleSelectProduct = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
            <Eye className="w-3 h-3 mr-1" /> Published
          </span>
        );
      case "draft":
        return (
          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full flex items-center">
            <EyeOff className="w-3 h-3 mr-1" /> Draft
          </span>
        );
      case "archived":
        return (
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
            Archived
          </span>
        );
      default:
        return null;
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link
          to="/admin/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-wrap gap-4">
          <form onSubmit={handleSearch} className="flex-1 min-w-75">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </form>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          {selectedProducts.length > 0 && (
            <button
              onClick={() => setShowBulkDeleteConfirm(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Selected ({selectedProducts.length})
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    productsData
                      ? selectedProducts.length === productsData?.data?.length
                      : false
                  }
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {productsData?.data?.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product._id)}
                    onChange={() => handleSelectProduct(product._id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 shrink-0">
                      <img
                        src={
                          product.images[0]?.url ||
                          "https://via.placeholder.com/40"
                        }
                        alt={product.name}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.category}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {product.sku}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    ${product.price.amount}
                  </div>
                  {product.compareAtPrice && (
                    <div className="text-xs text-gray-500 line-through">
                      ${product.compareAtPrice.amount}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {product.inventory.quantity}
                  </div>
                  {product.inventory.quantity <=
                    product.inventory.lowStockThreshold && (
                    <div className="text-xs text-orange-600">Low stock</div>
                  )}
                </td>
                <td className="px-6 py-4">{getStatusBadge(product.status)}</td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <div className="relative">
                    <button
                      onClick={() =>
                        setShowDeleteConfirm(
                          showDeleteConfirm === product._id
                            ? null
                            : product._id,
                        )
                      }
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {showDeleteConfirm === product._id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                        <button
                          onClick={() =>
                            navigate(`/admin/products/edit/${product._id}`)
                          }
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            // Handle duplicate
                            setShowDeleteConfirm(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {productsData?.pagination && productsData?.pagination.pages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setPage((p) =>
                    Math.min(productsData?.pagination?.pages || 1, p + 1),
                  )
                }
                disabled={page === productsData.pagination.pages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">{(page - 1) * 10 + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(page * 10, productsData?.pagination?.total)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">
                    {productsData?.pagination?.total}
                  </span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  {Array.from(
                    { length: productsData?.pagination?.pages },
                    (_, i) => i + 1,
                  )
                    .filter((p) => {
                      const distance = Math.abs(p - page);
                      return (
                        distance === 0 ||
                        distance === 1 ||
                        p === 1 ||
                        p === productsData?.pagination?.pages
                      );
                    })
                    .map((p, i, arr) => (
                      <>
                        {i > 0 && arr[i - 1] !== p - 1 && (
                          <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                            ...
                          </span>
                        )}
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === p
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {p}
                        </button>
                      </>
                    ))}
                  <button
                    onClick={() =>
                      setPage((p) => Math.min(productsData?.pagination?.pages||1, p + 1))
                    }
                    disabled={page === productsData?.pagination?.pages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Delete Confirmation Modal */}
      {showBulkDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete {selectedProducts.length} Products?
            </h3>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. The selected products will be
              permanently deleted.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleBulkDelete}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setShowBulkDeleteConfirm(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
