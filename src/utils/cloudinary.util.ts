// src/utils/cloudinary.ts
/**
 * Get optimized Cloudinary image URL with transformations
 * @param url - Original Cloudinary URL
 * @param options - Transformation options
 * @returns Transformed URL
 */
export const getOptimizedImageUrl = (
    url: string,
    options: {
        width?: number;
        height?: number;
        quality?: number;
        crop?: 'fill' | 'scale' | 'fit';
        format?: 'auto' | 'webp' | 'jpg' | 'png';
    } = {}
): string => {
    if (!url.includes('cloudinary.com')) return url;

    const transformations = [];

    if (options.width) transformations.push(`w_${options.width}`);
    if (options.height) transformations.push(`h_${options.height}`);
    if (options.crop) transformations.push(`c_${options.crop}`);
    if (options.quality) transformations.push(`q_${options.quality}`);
    if (options.format) transformations.push(`f_${options.format}`);

    transformations.push('q_auto', 'f_auto'); // Always optimize

    const transformationString = transformations.join(',');

    // Insert transformations into URL
    return url.replace('/upload/', `/upload/${transformationString}/`);
};

// Usage examples:
// const thumbnail = getOptimizedImageUrl(product.images[0].url, { width: 300, height: 300, crop: 'fill' });
// const productImage = getOptimizedImageUrl(product.images[0].url, { width: 800 });