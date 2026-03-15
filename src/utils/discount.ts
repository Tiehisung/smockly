/**
 * Calculate discount percentage
 * @param originalPrice - Original price amount
 * @param discountedPrice - Discounted price amount
 * @returns Discount percentage (rounded)
 */
export const calcDiscountPercent = (
    originalPrice: number,
    discountedPrice: number
): number => {
    if (originalPrice <= 0) return 0;
    const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
    return Math.round(discount);
};

/**
 * Format discount percentage
 * @param originalPrice - Original price amount
 * @param discountedPrice - Discounted price amount
 * @returns Formatted discount string (e.g., "-20%")
 */
export const formatDiscount = (
    originalPrice: number,
    discountedPrice: number
): string => {
    const percentage = calcDiscountPercent(originalPrice, discountedPrice);
    return percentage > 0 ? `-${percentage}%` : '';
};