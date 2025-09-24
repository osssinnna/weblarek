import type { TPayment } from "../../types";

type Step1Errors = {
  payment?: string;
  address?: string;
};

type Step2Errors = {
  email?: string;
  phone?: string;
};

export class BuyerModel {
  private payment?: TPayment;
  private address?: string;
  private email?: string;
  private phone?: string;

  public setPayment(value: TPayment) {
    this.payment = value;
  }

  public setAddress(value: string) {
    this.address = value;
  }

  public setEmail(value: string) {
    this.email = value;
  }

  public setPhone(value: string) {
    this.phone = value;
  }

  public get() {
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.phone,
    };
  }

  public clear() {
    this.payment = undefined;
    this.address = undefined;
    this.email = undefined;
    this.phone = undefined;
  }

  public validateStep1(): Step1Errors {
    const errors: Step1Errors = {};
    if (this.payment != "card" && this.payment != "cash") {
      errors.payment = "Способ оплаты не выбран";
    }
    if (!this.address || !this.address.trim()) {
      errors.address = "Укажите адрес доставки";
    }

    return errors;
  }

  public validateStep2(): Step2Errors {
    const errors: Step2Errors = {};
    if (!this.email || !this.email.trim()) {
      errors.email = "Укажите email";
    }
    if (!this.phone || !this.phone.trim()) {
      errors.phone = "Укажите телефон";
    }
    return errors;
  }
}
