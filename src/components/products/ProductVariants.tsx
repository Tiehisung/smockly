// src/components/products/ProductVariants.tsx

import type { IProductVariant } from "../../types/product.types";

 

interface ProductVariantsProps {
  variants?: IProductVariant[];
  selectedVariant: string | null;
  onSelectVariant: (variantId: string) => void;
}

export function ProductVariants({
  variants,
  selectedVariant,
  onSelectVariant,
}: ProductVariantsProps) {
  if (!variants || variants.length === 0) return null;

  // Group variants by option type (size, color, etc.)
  const options = variants.reduce(
    (acc, variant) => {
      variant.options.forEach((option) => {
        if (!acc[option.name]) {
          acc[option.name] = new Set();
        }
        acc[option.name].add(option.value);
      });
      return acc;
    },
    {} as Record<string, Set<string>>,
  );

  return (
    <div className="space-y-4">
      {Object.entries(options).map(([optionName, values]) => (
        <div key={optionName}>
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            {optionName.charAt(0).toUpperCase() + optionName.slice(1)}
          </h3>
          <div className="flex flex-wrap gap-2">
            {Array.from(values).map((value) => {
              const isSelected = selectedVariant?.includes(value);
              return (
                <button
                  key={value}
                  onClick={() => {
                    // Find variant that matches this option
                    const variant = variants.find((v) =>
                      v.options.some(
                        (opt) => opt.name === optionName && opt.value === value,
                      ),
                    );
                    if (variant) {
                      onSelectVariant(variant._id!);
                    }
                  }}
                  className={`px-4 py-2 border rounded-md text-sm font-medium ${
                    isSelected
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
