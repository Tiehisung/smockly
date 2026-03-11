import type { IPrice } from "../types/base.types";

const CURRENCY_LOCALES: Record<IPrice['currency'], string> = {
    USD: 'en-US',
    EUR: 'en-EU',
    GBP: 'en-GB',
    GHS: 'en-GH',
    NGN: 'en-NG',
};

export function formatPrice(price: IPrice): string {
    const locale = CURRENCY_LOCALES[price.currency];

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: price.currency,
    }).format(price.amount);
}