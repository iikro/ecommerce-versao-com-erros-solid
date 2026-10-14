export abstract class Product {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly price: number,
    public readonly type: string
  ) {}

  abstract calculateFreight(): number;
}
