import { BaseForm } from "./BaseForm";
import { ensureElement } from "../../../utils/utils";

export type TOrderStep2 = { email: string; phone: string };
export class OrderStep2Form extends BaseForm<TOrderStep2> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(
    container: HTMLElement,
    onSubmit: () => void,
    onChange: (data: Partial<TOrderStep2>) => void
  ) {
    super(container, onSubmit);
    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.container
    );
    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.container
    );

    this.emailInput.addEventListener("input", () =>
      onChange({ email: this.emailInput.value })
    );
    this.phoneInput.addEventListener("input", () =>
      onChange({ phone: this.phoneInput.value })
    );
  }

  set email(v: string) {
    this.emailInput.value = v ?? "";
  }
  set phone(v: string) {
    this.phoneInput.value = v ?? "";
  }
}
