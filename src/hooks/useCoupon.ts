// src/hooks/useCoupon.ts
import { useCallback, useState } from 'react';
import {  useLazyValidateCouponQuery } from '../store/api/couponsApi';
import { useCart } from './useCart';
import toast from 'react-hot-toast';

export const useCoupon = () => {
    const [validating, setValidating] = useState(false);
    const { cart, applyCoupon, removeCoupon } = useCart();
    const [validateCoupon] = useLazyValidateCouponQuery();

    const appliedCoupon = cart?.appliedCoupon;

    const validateAndApply = useCallback(async (code: string) => {
        if (!cart) return;

        setValidating(true);
        try {
            const result = await validateCoupon({
                code,
                subtotal: cart.subtotal.amount,
            }).unwrap();

            if (result.valid && result.coupon) {
                await applyCoupon(code);
                toast.success(`Coupon applied: ${result.coupon.name}`);
                return result.coupon;
            } else {
                toast.error(result.message || 'Invalid coupon code');
                return null;
            }
        } catch (error) {
            toast.error('Failed to validate coupon');
            return null;
        } finally {
            setValidating(false);
        }
    }, [cart, validateCoupon, applyCoupon]);

    const remove = useCallback(async () => {
        await removeCoupon();
        toast.success('Coupon removed');
    }, [removeCoupon]);

    const getDiscountAmount = useCallback((): number => {
        if (!cart || !cart.discount) return 0;
        return cart.discount.amount;
    }, [cart]);

    const getSavingsPercentage = useCallback((): number => {
        if (!cart || !cart.discount || cart.subtotal.amount === 0) return 0;
        return (cart.discount.amount / cart.subtotal.amount) * 100;
    }, [cart]);

    return {
        appliedCoupon,
        validating,
        discountAmount: getDiscountAmount(),
        savingsPercentage: getSavingsPercentage(),
        validateAndApply,
        removeCoupon: remove,
    };
};