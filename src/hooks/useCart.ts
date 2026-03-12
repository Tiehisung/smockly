// src/hooks/useCart.ts
import { useCallback, useMemo } from 'react';
import {
    useGetCartQuery,
    useAddToCartMutation,
    useUpdateCartItemMutation,
    useRemoveFromCartMutation,
    useClearCartMutation,
    useApplyCouponMutation,
    useRemoveCouponMutation,
} from '../store/api/cartApi';
 
import toast from 'react-hot-toast';
import type { IAddToCartPayload } from '../types/cart.types';

export const useCart = () => {
    const { data: cart, isLoading, refetch } = useGetCartQuery();
    const [addToCartMutation] = useAddToCartMutation();
    const [updateCartItemMutation] = useUpdateCartItemMutation();
    const [removeFromCartMutation] = useRemoveFromCartMutation();
    const [clearCartMutation] = useClearCartMutation();
    const [applyCouponMutation] = useApplyCouponMutation();
    const [removeCouponMutation] = useRemoveCouponMutation();

    const addToCart = useCallback(async (payload: IAddToCartPayload) => {
        try {
            await addToCartMutation(payload).unwrap();
            toast.success('Added to cart');
        } catch (error) {
            toast.error('Failed to add to cart');
        }
    }, [addToCartMutation]);

    const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
        try {
            await updateCartItemMutation({ itemId, quantity }).unwrap();
        } catch (error) {
            toast.error('Failed to update cart');
        }
    }, [updateCartItemMutation]);

    const removeItem = useCallback(async (itemId: string) => {
        try {
            await removeFromCartMutation(itemId).unwrap();
            toast.success('Removed from cart');
        } catch (error) {
            toast.error('Failed to remove item');
        }
    }, [removeFromCartMutation]);

    const clearCart = useCallback(async () => {
        try {
            await clearCartMutation().unwrap();
            toast.success('Cart cleared');
        } catch (error) {
            toast.error('Failed to clear cart');
        }
    }, [clearCartMutation]);

    const applyCoupon = useCallback(async (code: string) => {
        try {
            await applyCouponMutation(code).unwrap();
            toast.success('Coupon applied');
        } catch (error) {
            toast.error('Invalid coupon code');
        }
    }, [applyCouponMutation]);

    const removeCoupon = useCallback(async () => {
        try {
            await removeCouponMutation().unwrap();
            toast.success('Coupon removed');
        } catch (error) {
            toast.error('Failed to remove coupon');
        }
    }, [removeCouponMutation]);

    const itemCount = useMemo(() => cart?.itemCount || 0, [cart]);
    const subtotal = useMemo(() => cart?.subtotal?.amount || 0, [cart]);
    const total = useMemo(() => cart?.total?.amount || 0, [cart]);

    return {
        cart,
        isLoading,
        itemCount,
        subtotal,
        total,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        applyCoupon,
        removeCoupon,
        refetch,
    };
};