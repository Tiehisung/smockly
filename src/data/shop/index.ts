import { allProducts } from "../products";

// In src/data/shop/index.ts
export const getNewArrivals = (limit: number = 8) => {
    return allProducts
        .filter(p => p.newArrival)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);
};