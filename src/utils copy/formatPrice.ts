import type { IPrice } from "../types/base.types";
// Currency symbols mapping
export const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  GHS: "₵",
  NGN: "₦",
  ZAR: "R",
  KES: "KSh",
  UGX: "USh",
  TZS: "TSh",
  XOF: "CFA",
  XAF: "FCFA",
};

const CURRENCY_LOCALES: Record<IPrice['currency'], string> = {
    USD: 'en-US',
    EUR: 'en-EU',
    GBP: 'en-GB',
    GHS: 'en-GH',
    NGN: 'en-NG',
};

export function formatPrice(price?: IPrice): string {
    const locale = CURRENCY_LOCALES[price?.currency || 'GHS'];

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: price?.currency || 'GHS',
    }).format(price?.amount ?? 0);
}

// import { NumericFormat } from "react-number-format";

// <NumericFormat
//   value={ price }
// thousandSeparator
// prefix = "$"
// displayType = "text"
//     />