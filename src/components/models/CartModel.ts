import type { IProduct } from "../../types";

export class CartModel {
  private items: Map<string, IProduct> = new Map();

  public getItems(): IProduct[] {
    //получить товары из корзины
    return Array.from(this.items.values());
  }

  public add(product: IProduct) {
    if (!product?.id) return;
    if (product.price === null) return;
    this.items.set(product.id, product);
  }

  public remove(productOrId: IProduct | string) {
    const id = typeof productOrId === "string" ? productOrId : productOrId?.id;
    if (id) this.items.delete(id);
  }

  public clear() {
    this.items.clear();
  }

  public getCount(): number {
    return this.items.size;
  }

  public has(id: string): boolean {
    return this.items.has(id);
  }

  public getTotal(): number {
    return Array.from(this.items.values()).reduce((sum, p) => {
      return sum + (typeof p.price === "number" ? p.price : 0);
    }, 0);
  }
}
