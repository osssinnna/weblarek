import "./scss/styles.scss";

import { cloneTemplate, ensureElement } from "./utils/utils";
import { API_URL } from "./utils/constants";

import { WebLarekApi } from "./components/WebLarekApi";

import { EventEmitter, IEvents } from "./components/base/Events";
import { EVENTS } from "./components/base/eventNames";

import { ProductsModel } from "./components/models/ProductsModel";
import { CartModel } from "./components/models/CartModel";
import { BuyerModel } from "./components/models/BuyerModel";
import { Header } from "./components/views/Header";
import { Gallery } from "./components/views/Gallery";
import { CardCatalog } from "./components/views/CardCatalog";
import { CardPreview } from "./components/views/CardPreview";
import { CardInCart } from "./components/views/CardInCart";
import { BasketView } from "./components/views/BasketView";
import { Modal } from "./components/views/Modal";
import { OrderAddressPaymentForm } from "./components/views/forms/OrderAddressPaymentForm";
import { OrderEmailPhoneForm } from "./components/views/forms/OrderEmailPhoneForm";
import { OrderSuccess } from "./components/views/OrderSuccess";

import type { IProduct, IOrderPayload } from "./types";

const events: IEvents = new EventEmitter();
const api = new WebLarekApi(API_URL);
const products = new ProductsModel(events);
const cart = new CartModel(events);
const buyer = new BuyerModel(events);

const header = new Header(events, ensureElement<HTMLElement>(".header"));
const gallery = new Gallery(ensureElement<HTMLElement>("main.gallery"));
const modal = new Modal(ensureElement<HTMLElement>(".modal"));

const tplCardCatalog = ensureElement<HTMLTemplateElement>("#card-catalog");
const tplCardPreview = ensureElement<HTMLTemplateElement>("#card-preview");
const tplBasket = ensureElement<HTMLTemplateElement>("#basket");
const tplBasketItem = ensureElement<HTMLTemplateElement>("#card-basket");
const tplOrderAddressPayment = ensureElement<HTMLTemplateElement>("#order");
const tplOrderEmailPhone = ensureElement<HTMLTemplateElement>("#contacts");
const tplSuccess = ensureElement<HTMLTemplateElement>("#success");

function updateAddressPaymentValidity() {
  orderAddressPaymentForm.render({
    valid: isAddressPaymentValid(),
    errors: buyer.validateAddressPayment(),
  });
}

function updateEmailPhoneValidity() {
  orderEmailPhoneForm.render({
    valid: isEmailPhoneValid(),
    errors: buyer.validateEmailPhone(),
  });
}

const basketView = new BasketView(cloneTemplate(tplBasket), () =>
  events.emit(EVENTS.BASKET_CHECKOUT)
);

const orderAddressPaymentForm = new OrderAddressPaymentForm(
  cloneTemplate(tplOrderAddressPayment),
  () => events.emit(EVENTS.ORDER_ADDRESS_PAYMENT_NEXT),
  (data) => {
    if ("address" in data) buyer.setAddress(data.address || "");
    if ("payment" in data) buyer.setPayment((data.payment || "") as any);
    updateAddressPaymentValidity();
  }
);

const orderEmailPhoneForm = new OrderEmailPhoneForm(
  cloneTemplate(tplOrderEmailPhone),
  () => events.emit(EVENTS.ORDER_EMAIL_PHONE_PAY),
  (data) => {
    if ("email" in data) buyer.setEmail(data.email || "");
    if ("phone" in data) buyer.setPhone(data.phone || "");
    updateEmailPhoneValidity();
  }
);

const orderSuccessView = new OrderSuccess(cloneTemplate(tplSuccess), () =>
  modal.close()
);

let basketRowsCache: HTMLElement[] = [];
let basketTotalCache = 0;

const rerenderHeader = () => header.render({ counter: cart.getCount() });

const rerenderCatalog = () => {
  const items: HTMLElement[] = products.getItems().map((item: IProduct) => {
    const card = new CardCatalog(cloneTemplate(tplCardCatalog), {
      onClick: () => events.emit(EVENTS.CARD_SELECT, { id: item.id }),
    });
    return card.render({
      title: item.title,
      price: item.price,
      image: item.image,
      category: item.category,
    });
  });

  gallery.render({ catalog: items });
};

function openPreview() {
  const item = products.getSelectedProduct();
  if (!item) return;

  const view = new CardPreview(cloneTemplate(tplCardPreview), {
    onBuy: () => events.emit(EVENTS.CARD_BUY, { id: item.id }),
    onRemove: () =>
      events.emit(EVENTS.CARD_REMOVE, {
        id: item.id,
        from: "preview" as const,
      }),
  });

  modal.open(
    view.render({
      title: item.title,
      price: item.price,
      image: item.image,
      description: item.description,
      inCart: cart.has(item.id),
    })
  );
}

function openBasket() {
  modal.open(
    basketView.render({
      items: basketRowsCache,
      total: basketTotalCache,
      empty: basketRowsCache.length === 0,
    })
  );
}

function openOrderAddressPayment() {
  orderAddressPaymentForm.render({
    address: buyer.getAddress() || "",
    payment: (buyer.getPayment() || "") as any,
    valid: isAddressPaymentValid(),
    errors: {},
  });
  modal.open(orderAddressPaymentForm.render());
}

function openOrderEmailPhone() {
  orderEmailPhoneForm.render({
    email: buyer.getEmail() || "",
    phone: buyer.getPhone() || "",
    valid: isEmailPhoneValid(),
    errors: {},
  });
  modal.open(orderEmailPhoneForm.render());
}

function handlePay() {
  if (!isEmailPhoneValid()) return;

  const payload: IOrderPayload = {
    items: cart.getItems().map((i) => i.id),
    payment: buyer.getPayment() || "",
    address: buyer.getAddress() || "",
    email: buyer.getEmail() || "",
    phone: buyer.getPhone() || "",
    total: cart.getTotal(),
  };

  api
    .postOrder(payload)
    .then((res) => {
      cart.clear();
      buyer.reset();

      modal.open(orderSuccessView.render({ total: res.total }));
    })
    .catch((e) => {
      console.error("Ошибка оформления заказа:", e);
    });
}

const isAddressPaymentValid = () =>
  Object.keys(buyer.validateAddressPayment()).length === 0;
const isEmailPhoneValid = () =>
  Object.keys(buyer.validateEmailPhone()).length === 0;

// modal

events.on(EVENTS.CATALOG_CHANGED, () => rerenderCatalog());
events.on(EVENTS.CART_CHANGED, () => {
  rerenderHeader();
  basketRowsCache = cart.getItems().map((p, idx) => {
    const row = new CardInCart(cloneTemplate(tplBasketItem), {
      onRemove: () =>
        events.emit(EVENTS.CARD_REMOVE, { id: p.id, from: "basket" as const }),
    });
    return row.render({
      index: idx + 1,
      title: p.title,
      price: p.price,
    });
  });
  basketTotalCache = cart.getTotal();
  basketView.render({
    items: basketRowsCache,
    total: basketTotalCache,
    empty: basketRowsCache.length === 0,
  });
});

events.on(EVENTS.SELECT_CHANGED, () => openPreview());

// view
events.on(EVENTS.BASKET_OPEN, () => openBasket());
events.on(EVENTS.BASKET_CHECKOUT, () => openOrderAddressPayment());

events.on<{ id: string }>(EVENTS.CARD_SELECT, ({ id }) => {
  products.setSelectedProduct(id);
});

events.on<{ id: string }>(EVENTS.CARD_BUY, ({ id }) => {
  const item = products.getItemById(id);
  if (item) {
    cart.add(item);
    modal.close();
  }
});

events.on<{ id: string; from?: "preview" | "basket" }>(
  EVENTS.CARD_REMOVE,
  ({ id, from }) => {
    cart.remove(id);
    if (from === "preview") {
      modal.close();
    }
  }
);

events.on(EVENTS.ORDER_ADDRESS_PAYMENT_NEXT, () => {
  if (isAddressPaymentValid()) openOrderEmailPhone();
});

events.on(EVENTS.ORDER_EMAIL_PHONE_PAY, () => handlePay());

(async () => {
  try {
    const items = await api.getProducts();
    products.setItems(items);
    rerenderHeader();
  } catch (e) {
    console.error("Не удалось загрузить каталог:", e);
  }
})();
