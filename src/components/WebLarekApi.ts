import type { IApi } from "../types";
import type {
  IProductsResponse,
  IProduct,
  IOrderPayload,
  IOrderResult,
} from "../types";

export class WebLarekApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  public async getProducts(): Promise<IProduct[]> {
    const result = await this.api.get<IProductsResponse>("/product/");
    return result.items;
  }

  public async postOrder(payload: IOrderPayload): Promise<IOrderResult> {
    const result = await this.api.post<IOrderResult>(
      "/order/",
      payload,
      "POST"
    );
    return result;
  }
}
