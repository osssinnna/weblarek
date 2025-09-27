export const EVENTS = {
  CATALOG_CHANGED: "catalog:changed",
  CART_CHANGED: "cart:changed",
  SELECT_CHANGED: "select:changed",
  BUYER_CHANGED: "buyer:changed",

  CARD_SELECT: "card:select",
  CARD_BUY: "card:buy",
  CARD_REMOVE: "card:remove",
  BASKET_OPEN: "basket:open",
  BASKET_CHECKOUT: "basket:checkout",
  ORDER_ADDRESS_PAYMENT_NEXT: "order:addressphone:next",
  ORDER_EMAIL_PHONE_PAY: "order:addressphone:pay",
  FORM_CHANGE: /^form:/,
  MODAL_OPENED: "modal:open",
  MODAL_CLOSED: "modal:close",
} as const;
