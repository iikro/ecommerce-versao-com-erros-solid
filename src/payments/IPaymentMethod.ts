export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  message?: string;
}

export interface IPaymentMethod {
  process(amount: number, details?: any): Promise<PaymentResult> | PaymentResult;
}
