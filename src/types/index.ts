export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods
  ): Promise<T>;
}

export type TPayment = "card" | "cash" | "";

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export interface IOrderPayload {
  items: string[];
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  total: number;
}

export interface IOrderResult {
  id: string;
  total: number;
  success: boolean;
}

export interface IProductsResponse {
  total: number;
  items: IProduct[];
}
