import type { IProduct } from "../../types";
import type { IEvents } from "../base/Events";
import { EVENTS } from "../base/eventNames";

export class ProductsModel {
  private items: IProduct[] = [];
  private selectedId: string | null = null;

  constructor(private events?: IEvents) {}

  public setItems(items: IProduct[]) {
    //сохр массив товаров
    this.items = [...items];
    this.events?.emit(EVENTS.CATALOG_CHANGED, {});
  }

  public getItems(): IProduct[] {
    //получить копию массива товаров
    return [...this.items];
  }

  //найти товар по айди
  public getItemById(id: string): IProduct | undefined {
    return this.items.find((p) => p.id === id);
  }

  public setSelectedProduct(id: string | null) {
    //сохранить айди товара
    this.selectedId = id;
    this.events?.emit(EVENTS.SELECT_CHANGED, {});
  }

  public getSelectedProduct(): IProduct | null {
    if (!this.selectedId) return null;
    return this.getItemById(this.selectedId) ?? null;
  }
}
