import { IPaymentMethod, PaymentResult } from './IPaymentMethod';
import logger from '../lib/logger';

export interface DebitCardDetails {
  cardNumber?: string;
  pin?: string;
}

export class DebitCardPayment implements IPaymentMethod {
  constructor(private readonly defaultDetails?: DebitCardDetails) {}

  async process(amount: number, details?: DebitCardDetails): Promise<PaymentResult> {
    logger.info(`Processando débito no valor de R$ ${amount}...`);

    return {
      success: true,
      message: 'Pagamento aprovado via cartão de débito',
    };
  }
}
