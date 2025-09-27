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
import { OrderStep1Form } from "./components/views/forms/OrderStep1Form";
import { OrderStep2Form } from "./components/views/forms/OrderStep2Form";
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
const tplOrderStep1 = ensureElement<HTMLTemplateElement>("#order");
const tplOrderStep2 = ensureElement<HTMLTemplateElement>("#contacts");
const tplSuccess = ensureElement<HTMLTemplateElement>("#success");

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
    onRemove: () => events.emit(EVENTS.CARD_REMOVE, { id: item.id }),
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
  const rows: HTMLElement[] = cart.getItems().map((p, idx) => {
    const row = new CardInCart(cloneTemplate(tplBasketItem), {
      onRemove: () => events.emit(EVENTS.CARD_REMOVE, { id: p.id }),
    });
    return row.render({
      index: idx + 1,
      title: p.title,
      price: p.price,
    });
  });

  const basket = new BasketView(cloneTemplate(tplBasket), () =>
    events.emit(EVENTS.BASKET_CHECKOUT)
  );

  modal.open(
    basket.render({
      items: rows,
      total: cart.getTotal(),
      empty: rows.length === 0,
    })
  );
}

function openOrderStep1() {
  const form = new OrderStep1Form(
    cloneTemplate(tplOrderStep1),
    () => events.emit(EVENTS.ORDER_STEP1_NEXT),
    (data) => {
      if ("address" in data) buyer.setAddress(data.address || "");
      if ("payment" in data) buyer.setPayment((data.payment || "") as any);
      updateStep1Validity(form);
    }
  );

  form.render({
    address: buyer.getAddress() || "",
    payment: (buyer.getPayment() || "") as any,
    valid: isStep1Valid(),
    errors: {},
  });

  modal.open(form.render());
}

function openOrderStep2() {
  const form = new OrderStep2Form(
    cloneTemplate(tplOrderStep2),
    () => events.emit(EVENTS.ORDER_STEP2_PAY),
    (data) => {
      if ("email" in data) buyer.setEmail(data.email || "");
      if ("phone" in data) buyer.setPhone(data.phone || "");
      updateStep2Validity(form);
    }
  );

  form.render({
    email: buyer.getEmail() || "",
    phone: buyer.getPhone() || "",
    valid: isStep2Valid(),
    errors: {},
  });

  modal.open(form.render());
}

function handlePay() {
  if (!isStep2Valid()) return;

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

      const view = new OrderSuccess(cloneTemplate(tplSuccess), () =>
        modal.close()
      );

      modal.open(view.render({ total: res.total }));
    })
    .catch((e) => {
      console.error("Ошибка оформления заказа:", e);
    });
}

//валидация

const isStep1Valid = () => Object.keys(buyer.validateStep1()).length === 0;
const isStep2Valid = () => Object.keys(buyer.validateStep2()).length === 0;

function updateStep1Validity(form: OrderStep1Form) {
  form.render({ valid: isStep1Valid(), errors: buyer.validateStep1() });
}

function updateStep2Validity(form: OrderStep2Form) {
  form.render({ valid: isStep2Valid(), errors: buyer.validateStep2() });
}

// modal

events.on(EVENTS.CATALOG_CHANGED, () => rerenderCatalog());
events.on(EVENTS.CART_CHANGED, () => {
  rerenderHeader();
  const isBasketOpenNow = !!document.querySelector(
    ".modal.modal_active .basket"
  );
  if (isBasketOpenNow) openBasket();
});

events.on(EVENTS.SELECT_CHANGED, () => openPreview());

// view
events.on(EVENTS.BASKET_OPEN, () => openBasket());
events.on(EVENTS.BASKET_CHECKOUT, () => openOrderStep1());

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

events.on<{ id: string }>(EVENTS.CARD_REMOVE, ({ id }) => {
  cart.remove(id);
  const isBasketOpen = !!document.querySelector(".modal.modal_active .basket");
  if (!isBasketOpen) {
    modal.close();
  }
});

events.on(EVENTS.ORDER_STEP1_NEXT, () => {
  if (isStep1Valid()) openOrderStep2();
});

events.on(EVENTS.ORDER_STEP2_PAY, () => handlePay());

(async () => {
  try {
    const items = await api.getProducts();
    products.setItems(items);
    rerenderHeader();
  } catch (e) {
    console.error("Не удалось загрузить каталог:", e);
  }
})();
