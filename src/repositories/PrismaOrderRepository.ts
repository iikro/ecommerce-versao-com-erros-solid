import { PrismaClient } from '@prisma/client';
import { IOrderRepository, CreateOrderDTO, Order } from './IOrderRepository';

export class PrismaOrderRepository implements IOrderRepository {
  constructor(private readonly prisma: PrismaClient = new PrismaClient()) {}

  async create(data: CreateOrderDTO): Promise<Order> {
    const itemsSerialized =
      typeof data.items === 'string'
        ? data.items
        : JSON.stringify(data.items);

    const order = await this.prisma.order.create({
      data: {
        customer: data.customer,
        items: itemsSerialized,
        total: data.total,
        status: data.status,
      },
    });

    return order;
  }

  async findById(id: number): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id },
    });
  }
}
