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
import type { IAddToCartPayload } from '../types/cart.types';
import { smartToast } from '../lib/toast';

export const useCart = () => {
    const { data: cart, isLoading, refetch } = useGetCartQuery();
    const cartData = cart?.data

    const [addToCartMutation] = useAddToCartMutation();
    const [updateCartItemMutation] = useUpdateCartItemMutation();
    const [removeFromCartMutation] = useRemoveFromCartMutation();
    const [clearCartMutation] = useClearCartMutation();
    const [applyCouponMutation] = useApplyCouponMutation();
    const [removeCouponMutation] = useRemoveCouponMutation();

    const addToCart = useCallback(async (payload: IAddToCartPayload) => {
        try {
            const added = await addToCartMutation(payload).unwrap();
            smartToast(added)
        } catch (error) {

            smartToast({ error: 'Failed to add to cart' })
        }
    }, [addToCartMutation]);

    const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
        try {
            const response = await updateCartItemMutation({ itemId, quantity }).unwrap();
            smartToast(response)
        } catch (error) {
            smartToast({ error: 'Failed to update cart' })
        }
    }, [updateCartItemMutation]);

    const removeItem = useCallback(async (itemId: string) => {
        try {
            const response = await removeFromCartMutation(itemId).unwrap();
            smartToast(response)
        } catch (error) {

            smartToast({ error: 'Failed to remove item' })
        }
    }, [removeFromCartMutation]);

    const clearCart = useCallback(async () => {
        try {
            const response = await clearCartMutation().unwrap();
            smartToast(response)
        } catch (error) {

            smartToast({ error: 'Failed to clear cart' })
        }
    }, [clearCartMutation]);

    const applyCoupon = useCallback(async (code: string) => {
        try {
            const response = await applyCouponMutation(code).unwrap();
            smartToast(response)
        } catch (error) {
            smartToast({ error: 'Invalid coupon code' })

        }
    }, [applyCouponMutation]);

    const removeCoupon = useCallback(async () => {
        try {
            const response = await removeCouponMutation().unwrap();
            smartToast(response)
        } catch (error) {

            smartToast({ error: 'Failed to remove coupon' })
        }
    }, [removeCouponMutation]);

    const itemCount = useMemo(() => cartData?.itemCount || 0, [cart]);
    const subtotal = useMemo(() => cartData?.subtotal?.amount || 0, [cart]);
    const total = useMemo(() => cartData?.total?.amount || 0, [cart]);

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