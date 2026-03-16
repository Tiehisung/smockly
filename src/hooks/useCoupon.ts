// src/hooks/useCoupon.ts
import { useCallback, useState } from 'react';
import { useLazyValidateCouponQuery } from '../store/api/couponsApi';
import { useCart } from './useCart';
import toast from 'react-hot-toast';

export const useCoupon = () => {
    const [validating, setValidating] = useState(false);
    const { cart, applyCoupon, removeCoupon } = useCart();

    const cartData = cart?.data

    const [validateCoupon] = useLazyValidateCouponQuery();

    const appliedCoupon = cartData?.appliedCoupon;

    const validateAndApply = useCallback(async (code: string) => {
        if (!cartData) return;

        setValidating(true);
        try {
            const result = await validateCoupon({
                code,
                subtotal: cartData.subtotal,
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
    }, [removeCoupon]);

    const getDiscountAmount = useCallback((): number => {
        if (!cartData || !cartData?.discount) return 0;
        return cartData?.discount;
    }, [cart]);

    const getSavingsPercentage = useCallback((): number => {
        if (!cartData || !cartData.discount || cartData.subtotal === 0) return 0;
        return (cartData.discount / cartData.subtotal) * 100;
    }, [cartData]);

    return {
        appliedCoupon,
        validating,
        discountAmount: getDiscountAmount(),
        savingsPercentage: getSavingsPercentage(),
        validateAndApply,
        removeCoupon: remove,
    };
};