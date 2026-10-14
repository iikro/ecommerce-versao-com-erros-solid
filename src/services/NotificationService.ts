import { IMailProvider, IMailResponse } from '../providers/IMailProvider';

export interface OrderNotificationItem {
  name: string;
  quantity?: number;
  price?: number;
}

export interface OrderNotificationDTO {
  orderId: number;
  customerEmail: string;
  totalAmount: number;
  items: OrderNotificationItem[];
}

export class NotificationService {
  constructor(private readonly mailProvider: IMailProvider) {}

  async sendOrderConfirmation(data: OrderNotificationDTO): Promise<IMailResponse> {
    const { orderId, customerEmail, totalAmount, items } = data;

    const subject = `Confirmação do Pedido #${orderId}`;
    const text = `Olá, seu pedido #${orderId} no valor de R$ ${totalAmount} foi confirmado.`;
    const html = `
      <h1>Pedido Confirmado!</h1>
      <p>Olá, seu pedido <b>#${orderId}</b> foi processado com sucesso.</p>
      <p>Total: <strong>R$ ${totalAmount}</strong></p>
      <ul>
        ${items.map((item) => `<li>${item.name}</li>`).join('')}
      </ul>
    `;

    return this.mailProvider.sendMail({
      to: customerEmail,
      subject,
      text,
      html,
      from: '"DevStore" <noreply@devstore.com>',
    });
  }
}
