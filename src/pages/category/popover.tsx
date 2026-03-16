// src/components/layout/CategoryPopover.tsx
import { Link } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Popover } from "../../components/headlessUI/Popover";

export function CategoryPopover() {
  const categories = [
    {
      name: "Men's Smocks",
      href: "/category/mens-smocks",
      subcategories: ["Classic", "Modern", "Premium", "Wedding"],
    },
    {
      name: "Women's Smocks",
      href: "/category/womens-smocks",
      subcategories: ["Classic", "Modern", "Festival", "Bridal"],
    },
    {
      name: "Accessories",
      href: "/category/accessories",
      subcategories: ["Hats", "Bags", "Jewelry", "Belts"],
    },
  ];

  return (
    <Popover
      trigger={
        <button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900">
          <span>Categories</span>
          <ChevronDownIcon className="w-4 h-4" />
        </button>
      }
      width="lg"
      position="left"
      className="w-fit"
    >
      <div className="grid grid-cols-2 gap-4">
        {categories.map((category) => (
          <div key={category.name}>
            <Link
              to={category.href}
              className="font-medium text-gray-900 hover:text-blue-600"
            >
              {category.name}
            </Link>
            <ul className="mt-2 space-y-1">
              {category.subcategories.map((sub) => (
                <li key={sub}>
                  <Link
                    to={`${category.href}/${sub.toLowerCase()}`}
                    className="text-sm text-gray-500 hover:text-blue-600"
                  >
                    {sub}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Popover>
  );
}
