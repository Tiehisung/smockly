import type { IPrice } from "../types/base.types";
// Currency symbols mapping
export enum ECurrencySymbols {
    USD = "$",
    EUR = "€",
    GBP = "£",
    GHS = "₵",
    NGN = "₦",
    ZAR = "R",
    KES = "KSh",
    UGX = "USh",
    TZS = "TSh",
    XOF = "CFA",
    XAF = "FCFA",
};

export const defaultCurrency = {
    symbol: '₵', text: 'GHS'
}

export const CURRENCY_LOCALES: Record<IPrice['currency'], string> = {
    USD: 'en-US',
    EUR: 'en-EU',
    GBP: 'en-GB',
    GHS: 'en-GH',
    NGN: 'en-NG',
};

 


