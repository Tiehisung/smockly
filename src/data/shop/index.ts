// In src/data/shop/index.ts
import { allProducts } from "../products";

export const getNewArrivals = (limit: number = 8) => {
    return allProducts
        .filter(p => p.newArrival)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);
}; 
export const getBestsellers = (limit: number = 8) => {
    return allProducts
        .filter(p => p.bestseller)
        .sort((a, b) => (b.meta?.purchases || 0) - (a.meta?.purchases || 0))
        .slice(0, limit);
};