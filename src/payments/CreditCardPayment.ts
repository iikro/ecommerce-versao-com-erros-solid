import { IPaymentMethod, PaymentResult } from './IPaymentMethod';
import logger from '../lib/logger';

export interface CreditCardDetails {
  cardNumber: string;
  cvv: string;
  holderName?: string;
  expiryDate?: string;
}

export class CreditCardPayment implements IPaymentMethod {
  constructor(private readonly defaultDetails?: CreditCardDetails) {}

  async process(amount: number, details?: CreditCardDetails): Promise<PaymentResult> {
    const card = details || this.defaultDetails;

    if (!card || !card.cardNumber || !card.cvv) {
      throw new Error('Dados do cartão de crédito incompletos');
    }

    logger.info(`Processando cartão final ${card.cardNumber.slice(-4)} no valor de R$ ${amount}`);

    // Simulação de gateway
    if (card.cvv === '000') {
      throw new Error('Cartão recusado');
    }

    return {
      success: true,
      message: 'Pagamento aprovado via cartão de crédito',
    };
  }
}
