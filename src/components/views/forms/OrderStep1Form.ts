import { BaseForm } from "./BaseForm";
import { ensureElement } from "../../../utils/utils";

export type TOrderStep1 = { address: string; payment: "card" | "cash" | "" };
export class OrderStep1Form extends BaseForm<TOrderStep1> {
  protected addressInput: HTMLInputElement;
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    onSubmit: () => void,
    onChange: (data: Partial<TOrderStep1>) => void
  ) {
    super(container, onSubmit);
    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      this.container
    );
    this.cardButton = ensureElement<HTMLButtonElement>(
      '.button[name="card"]',
      this.container
    );
    this.cashButton = ensureElement<HTMLButtonElement>(
      '.button[name="cash"]',
      this.container
    );

    const pick = (p: "card" | "cash") => {
      this.cardButton.classList.toggle("button_alt-active", p === "card");
      this.cashButton.classList.toggle("button_alt-active", p === "cash");
      onChange({ payment: p });
    };
    this.cardButton.addEventListener("click", (e) => {
      e.preventDefault();
      pick("card");
    });
    this.cashButton.addEventListener("click", (e) => {
      e.preventDefault();
      pick("cash");
    });
    this.addressInput.addEventListener("input", () =>
      onChange({ address: this.addressInput.value })
    );
  }

  set address(v: string) {
    this.addressInput.value = v ?? "";
  }
  set payment(v: "card" | "cash" | "") {
    this.cardButton.classList.toggle("button_alt-active", v === "card");
    this.cashButton.classList.toggle("button_alt-active", v === "cash");
  }
}
