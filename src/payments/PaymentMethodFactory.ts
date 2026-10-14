import { IPaymentMethod } from './IPaymentMethod';
import { CreditCardPayment } from './CreditCardPayment';
import { DebitCardPayment } from './DebitCardPayment';
import { PixPayment } from './PixPayment';

type PaymentCreator = (details?: any) => IPaymentMethod;

export class PaymentMethodFactory {
  private static readonly paymentMap: Record<string, PaymentCreator> = {
    credit_card: (details) => new CreditCardPayment(details),
    debit_card: (details) => new DebitCardPayment(details),
    pix: () => new PixPayment(),
  };

  static create(method: string, details?: any): IPaymentMethod {
    const creator = this.paymentMap[method];

    if (!creator) {
      throw new Error(`Método de pagamento não suportado: ${method}`);
    }

    return creator(details);
  }

  static register(method: string, creator: PaymentCreator): void {
    this.paymentMap[method] = creator;
  }
}
