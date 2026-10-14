import { Product } from './IProduct';
import { PhysicalProduct } from './PhysicalProduct';
import { DigitalProduct } from './DigitalProduct';

export interface ProductData {
  id: number;
  name: string;
  price: number;
  type: string;
  weight?: number;
  dimensions?: { height: number; width: number; depth: number };
}

export class ProductFactory {
  static createProduct(data: ProductData): Product {
    if (data.type === 'physical') {
      return new PhysicalProduct(data.id, data.name, data.price, data.weight, data.dimensions);
    } else if (data.type === 'digital') {
      return new DigitalProduct(data.id, data.name, data.price);
    }

    throw new Error(`Tipo de produto não suportado: ${data.type}`);
  }
}
