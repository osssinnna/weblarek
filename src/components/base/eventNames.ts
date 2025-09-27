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
  ORDER_STEP1_NEXT: "order:step1:next",
  ORDER_STEP2_PAY: "order:step2:pay",
  FORM_CHANGE: /^form:/,
  MODAL_OPENED: "modal:open",
  MODAL_CLOSED: "modal:close",
} as const;
