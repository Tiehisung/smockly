
export interface IPaymentDetails {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  savePayment: boolean;
}
// src/types/payment.types.ts
export interface IPaymentVerificationPayload {
  reference: string;           // Paystack transaction reference
  trxref?: string;             // Optional transaction reference (sometimes Paystack returns both)
  amount?: number;             // Amount paid
  status?: 'success' | 'failed' | 'pending'; // Payment status
  metadata?: {
    orderId?: string;
    customerId?: string;
    items?: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
  };
}

export interface IPaystackInitializePayload {
  email: string;
  amount: number;
  currency?: 'GHS' | 'NGN' | 'USD' | 'ZAR';
  metadata?: {
    orderId?: string;
    customerId?: string;
    items?: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    cancel_action?: string;
  };
}

export interface IPaystackInitializeResponse {
  authorization_url: string;
  reference: string;
  access_code: string;
}

export interface IPaystackVerificationResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    status: 'success' | 'failed' | 'abandoned';
    reference: string;
    amount: number;
    paid_at: string;
    created_at: string;
    channel: 'card' | 'bank' | 'ussd' | 'qr' | 'mobile_money' | 'bank_transfer';
    currency: 'GHS' | 'NGN' | 'USD' | 'ZAR';
    authorization: {
      authorization_code: string;
      card_type: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      bin: string;
      bank: string;
      channel: string;
      signature: string;
      reusable: boolean;
      country_code: string;
    };
    customer: {
      id: number;
      email: string;
      customer_code: string;
    };
    metadata: {
      orderId?: string;
      customerId?: string;
      items?: Array<{
        name: string;
        quantity: number;
        price: number;
      }>;
    };
  };
}

export interface IProcessPaymentResponse {
  success: boolean;
  orderId: string;
  message: string;
}