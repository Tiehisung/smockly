// src/utils/formatPrice.ts

import type { IPrice } from "../types/base.types";
import { CURRENCY_LOCALES, defaultCurrency, ECurrencySymbols } from "./currency";

/**
 * Format a price with currency symbol
 * @param amount - The numeric amount
 * @param currency - The currency code (default: 'GHS')
 * @param options - Additional formatting options
 * @returns Formatted price string with symbol
 */
export const formatAmount = (
    amount?: number,
    currency: string = defaultCurrency.text,
    options?: {
        showSymbol?: boolean;
        showCode?: boolean;
        decimalPlaces?: number;
    }
): string => {
    const {
        showSymbol = true,
        showCode = false,
        decimalPlaces = 2
    } = options || {};

    const symbol = ECurrencySymbols[currency as keyof typeof ECurrencySymbols] || defaultCurrency.symbol;
    const formattedAmount = amount?.toFixed(decimalPlaces);

    if (showCode) {
        return `${formattedAmount} ${currency}`;
    }

    if (showSymbol) {
        return `${symbol}${formattedAmount}`;
    }

    return formattedAmount || '';
};

export function formatAmount2(amount?: number, currency?: IPrice['currency']): string {
    const locale = CURRENCY_LOCALES[currency || 'GHS'];

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency || 'GHS',
    }).format(amount ?? 0);
}

/**
 * Format an IPrice object
 * @param price - The IPrice object containing amount and currency
 * @param options - Additional formatting options
 * @returns Formatted price string
 */
export const formatIPrice = (
    price?: IPrice | null,
    options?: {
        showSymbol?: boolean;
        showCode?: boolean;
        decimalPlaces?: number;
    }
): string => {
    if (!price) {
        return formatAmount(0, defaultCurrency.text, options);
    }

    // If formatted string exists and we don't need custom formatting, use it
    if (price.formatted && !options) {
        return price.formatted;
    }

    return formatAmount(price.amount, price.currency, options);
};

/**
 * Format price range (min - max)
 * @param minAmnt - Minimum price IPrice object
 * @param maxAmnt - Maximum price IPrice object
 * @returns Formatted price range string
 */
export const formatAmountRange = (
    minAmnt?: IPrice | number,
    maxAmnt?: IPrice | number,
    currency?: ECurrencySymbols
): string => {
    if (!minAmnt || !maxAmnt) return '';


    const min = typeof minAmnt == 'number' ? formatAmount(minAmnt) : formatIPrice(minAmnt, { showCode: true });
    const max = typeof maxAmnt == 'number' ? formatAmount(maxAmnt) : formatIPrice(maxAmnt, { showCode: true });

    const curr = typeof minAmnt == 'number' ? (currency || defaultCurrency.symbol) : ''

    return curr ? `${curr}${min} - ${curr + max}` : `${min} - ${max}`;
};


// import { NumericFormat } from "react-number-format";

// <NumericFormat
//   value={ price }
// thousandSeparator
// prefix = "$"
// displayType = "text"
//     />