import { Product } from './IProduct';

export class DigitalProduct extends Product {
  constructor(id: number, name: string, price: number) {
    super(id, name, price, 'digital');
  }

  calculateFreight(): number {
    return 0.0;
  }
}
