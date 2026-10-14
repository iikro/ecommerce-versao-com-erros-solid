import { Request, Response } from 'express';
import { OrderService } from '../services/OrderService';
import { PrismaProductRepository } from '../repositories/PrismaProductRepository';
import { PrismaOrderRepository } from '../repositories/PrismaOrderRepository';
import { NotificationService } from '../services/NotificationService';
import { EtherealMailProvider } from '../providers/EtherealMailProvider';
import logger from '../lib/logger';

export class OrderController {
  private orderService: OrderService;

  constructor(orderService?: OrderService) {
    this.orderService =
      orderService ||
      new OrderService(
        new PrismaProductRepository(),
        new PrismaOrderRepository(),
        new NotificationService(new EtherealMailProvider())
      );
  }

  processOrder = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { customer, items, paymentMethod, paymentDetails } = req.body;

      const result = await this.orderService.execute({
        customer,
        items,
        paymentMethod,
        paymentDetails,
      });

      return res.json(result);
    } catch (error: any) {
      logger.error(`Erro ao processar pedido: ${error.message}`);

      if (
        error.message === 'Carrinho vazio' ||
        error.message.includes('não encontrado') ||
        error.message.includes('não suportado') ||
        error.message.includes('Dados do cartão') ||
        error.message === 'Cartão recusado'
      ) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: 'Erro interno' });
    }
  };
}