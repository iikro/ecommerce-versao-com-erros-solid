import { IPaymentMethod, PaymentResult } from './IPaymentMethod';
import logger from '../lib/logger';

export class PixPayment implements IPaymentMethod {
  async process(amount: number): Promise<PaymentResult> {
    logger.info(`Processando pagamento via Pix no valor de R$ ${amount}`);

    const transactionId = `pix_${Date.now()}`;

    return {
      success: true,
      transactionId,
      message: 'Pagamento via Pix confirmado com sucesso',
    };
  }
}
