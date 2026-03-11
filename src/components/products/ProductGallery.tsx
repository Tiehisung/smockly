// src/components/products/ProductGallery.tsx
import { useState } from "react";
import type { IImage } from "../../types/base.types";
 

interface ProductGalleryProps {
  images: IImage[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  // If no images, use placeholder
  const displayImages =
    images.length > 0
      ? images
      : [{ url: "https://via.placeholder.com/600", alt: name }];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
        <img
          src={displayImages[selectedImage].url}
          alt={displayImages[selectedImage].alt || name}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Thumbnail Grid */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`aspect-square overflow-hidden rounded-lg bg-gray-100 border-2 ${
                selectedImage === index
                  ? "border-blue-600"
                  : "border-transparent"
              }`}
            >
              <img
                src={image.url}
                alt={image.alt || `${name} - view ${index + 1}`}
                className="w-full h-full object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
