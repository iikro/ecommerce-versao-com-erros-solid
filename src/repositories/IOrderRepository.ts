export interface CreateOrderDTO {
  customer: string;
  items: unknown[] | string;
  total: number;
  status: string;
}

export interface Order {
  id: number;
  customer: string;
  items: string;
  total: number;
  status: string;
  createdAt: Date;
}

export interface IOrderRepository {
  create(data: CreateOrderDTO): Promise<Order>;
  findById(id: number): Promise<Order | null>;
}
