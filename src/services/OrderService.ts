import { IProductRepository } from '../repositories/IProductRepository';
import { IOrderRepository } from '../repositories/IOrderRepository';
import { NotificationService } from './NotificationService';
import { ProductFactory } from '../domain/ProductFactory';
import { PaymentMethodFactory } from '../payments/PaymentMethodFactory';
import logger from '../lib/logger';

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface ProcessOrderDTO {
  customer: string;
  items: OrderItemRequest[];
  paymentMethod: string;
  paymentDetails?: any;
}

export interface ProcessedOrderResult {
  orderId: number;
  message: string;
  total: number;
  emailPreview?: string | false;
}

export class OrderService {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly orderRepository: IOrderRepository,
    private readonly notificationService: NotificationService
  ) {}

  async execute(dto: ProcessOrderDTO): Promise<ProcessedOrderResult> {
    const { customer, items, paymentMethod, paymentDetails } = dto;

    // 1. VALIDAÇÃO
    if (!items || items.length === 0) {
      logger.error('Tentativa de pedido sem itens');
      throw new Error('Carrinho vazio');
    }

    // 2. CÁLCULO DE PREÇO E FRETE (LSP + Factory)
    let totalAmount = 0;
    const productsDetails = [];

    for (const item of items) {
      const productData = await this.productRepository.findById(item.productId);

      if (!productData) {
        throw new Error(`Produto ${item.productId} não encontrado`);
      }

      const product = ProductFactory.createProduct(productData);
      const itemSubtotal = product.price * item.quantity;
      const freight = product.calculateFreight();

      totalAmount += itemSubtotal + freight;

      productsDetails.push({
        id: product.id,
        name: product.name,
        type: product.type,
        price: product.price,
        quantity: item.quantity,
      });
    }

    // 3. PROCESSAMENTO DE PAGAMENTO (OCP)
    const payment = PaymentMethodFactory.create(paymentMethod, paymentDetails);
    await payment.process(totalAmount, paymentDetails);

    // 4. PERSISTÊNCIA (SRP + DIP)
    const order = await this.orderRepository.create({
      customer,
      items: productsDetails,
      total: totalAmount,
      status: 'confirmed',
    });

    // 5. NOTIFICAÇÃO (SRP + DIP)
    const mailResponse = await this.notificationService.sendOrderConfirmation({
      orderId: order.id,
      customerEmail: customer,
      totalAmount,
      items: productsDetails,
    });

    return {
      orderId: order.id,
      message: 'Pedido processado com sucesso',
      total: totalAmount,
      emailPreview: mailResponse.previewUrl,
    };
  }
}
