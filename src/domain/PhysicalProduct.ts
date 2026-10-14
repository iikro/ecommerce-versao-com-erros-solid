import { Product } from './IProduct';

export class PhysicalProduct extends Product {
  constructor(
    id: number,
    name: string,
    price: number,
    public readonly weight?: number,
    public readonly dimensions?: { height: number; width: number; depth: number }
  ) {
    super(id, name, price, 'physical');
  }

  calculateFreight(): number {
    return 10.0;
  }
}
