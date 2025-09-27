import { Component } from "../base/Component";
import type { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { EVENTS } from "../base/eventNames";

export interface IHeader {
  counter: number;
}

export class Header extends Component<IHeader> {
  protected counterElement: HTMLElement;
  protected basketButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);
    this.counterElement = ensureElement<HTMLElement>(
      ".header__basket-counter",
      this.container
    );
    this.basketButton = ensureElement<HTMLButtonElement>(
      ".header__basket",
      this.container
    );
    this.basketButton.addEventListener("click", () =>
      this.events.emit(EVENTS.BASKET_OPEN)
    );
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}
