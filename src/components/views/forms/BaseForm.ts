import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";

export interface IBaseForm {
  valid: boolean;
  errors?: Record<string, string>;
}

export abstract class BaseForm<T extends object> extends Component<
  T & IBaseForm
> {
  protected submitButton: HTMLButtonElement;
  protected errorElement: HTMLElement;

  constructor(container: HTMLElement, onSubmit: () => void) {
    super(container);
    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.container
    );
    this.errorElement = ensureElement<HTMLElement>(
      ".form__errors",
      this.container
    );
    this.container.addEventListener("submit", (e) => {
      e.preventDefault();
      onSubmit();
    });
  }
  set valid(v: boolean) {
    this.submitButton.disabled = !v;
  }
  set errors(map: Record<string, string>) {
    this.errorElement.textContent = map ? Object.values(map).join("; ") : "";
  }
}
