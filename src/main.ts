import "./scss/styles.scss";
import { apiProducts } from "./utils/data";
import { ProductsModel } from "./components/models/ProductsModel";
import { CartModel } from "./components/models/CartModel";
import { BuyerModel } from "./components/models/BuyerModel";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";
import { WebLarekApi } from "./components/WebLarekApi";

const http = new Api(API_URL);
const webLarekApi = new WebLarekApi(http);
const productsModel = new ProductsModel();

//Проверка для каталога

productsModel.setItems(apiProducts.items);

console.log("Каталог — всего:", productsModel.getItems().length);
console.log("Каталог — первый товар:", productsModel.getItems()[0]);

const firstId = productsModel.getItems()[0]?.id;
productsModel.setSelectedProduct(firstId ?? null);
console.log("Выбранный товар:", productsModel.getSelectedProduct());

//Проверка для корзины

const cartModel = new CartModel();

const firstPaidProduct = productsModel
  .getItems()
  .find((p) => typeof p.price === "number");

if (firstPaidProduct) {
  cartModel.add(firstPaidProduct);
}

console.log("Корзина — список:", cartModel.getItems());
console.log("Корзина — кол-во:", cartModel.getCount());
console.log("Корзина — сумма:", cartModel.getTotal());

if (firstPaidProduct) {
  cartModel.remove(firstPaidProduct.id);
}
console.log(
  "Корзина — после удаления:",
  cartModel.getItems(),
  "кол-во:",
  cartModel.getCount()
);

//Проверка для покупателя

const buyer = new BuyerModel();

const logErrors = (label: string, obj: object) =>
  console.log(label, Object.keys(obj).length ? obj : "нет ошибок");

console.log("Buyer — начальные данные:", buyer.get());
logErrors("Step1 (payment,address):", buyer.validateStep1());
logErrors("Step2 (email,phone):", buyer.validateStep2());

buyer.setPayment("card");
console.log("Buyer — после setPayment:", buyer.get());
logErrors("Step1 (address):", buyer.validateStep1());

buyer.setAddress("г. Москва, пр-т Мира, 1");
console.log("Buyer — после setAddress:", buyer.get());
logErrors("Step1 (нет ошибок):", buyer.validateStep1());

logErrors("Step2 (email,phone):", buyer.validateStep2());

buyer.setEmail("user@example.com");
console.log("Buyer — после setEmail:", buyer.get());
logErrors("Step2 (phone):", buyer.validateStep2());

buyer.setPhone("+7 999 000-00-00");
console.log("Buyer — после setPhone:", buyer.get());
logErrors("Step2 (нет ошибок):", buyer.validateStep2());

buyer.setAddress("   ");
logErrors("Step1 (некорректные значения):", buyer.validateStep1());

buyer.clear();
console.log("Buyer — после clear():", buyer.get());
logErrors("Step1 (payment,address):", buyer.validateStep1());
logErrors("Step2 (email,phone):", buyer.validateStep2());

//Проверка свзяи с апи

(async () => {
  try {
    const items = await webLarekApi.getProducts();
    productsModel.setItems(items);
    console.log("Каталог (с сервера):", productsModel.getItems());
    console.log("Всего товаров:", productsModel.getItems().length);
  } catch (error) {
    console.error("Ошибка загрузки каталога:", error);
  }
})();
