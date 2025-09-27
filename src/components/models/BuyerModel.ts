import type { TPayment } from "../../types";
import type { IEvents } from "../base/Events";
import { EVENTS } from "../base/eventNames";

type Step1Errors = { payment?: string; address?: string };
type Step2Errors = { email?: string; phone?: string };

export class BuyerModel {
  private payment?: TPayment;
  private address?: string;
  private email?: string;
  private phone?: string;

  constructor(private events?: IEvents) {}

  public setPayment(payment: TPayment) {
    this.payment = payment;
    this.events?.emit(EVENTS.BUYER_CHANGED, {});
  }
  public getPayment(): TPayment | undefined {
    return this.payment;
  }

  public setAddress(address: string) {
    this.address = address;
    this.events?.emit(EVENTS.BUYER_CHANGED, {});
  }
  public getAddress(): string | undefined {
    return this.address;
  }

  public setEmail(email: string) {
    this.email = email;
    this.events?.emit(EVENTS.BUYER_CHANGED, {});
  }
  public getEmail(): string | undefined {
    return this.email;
  }

  public setPhone(phone: string) {
    this.phone = phone;
    this.events?.emit(EVENTS.BUYER_CHANGED, {});
  }
  public getPhone(): string | undefined {
    return this.phone;
  }

  public reset() {
    this.payment = "";
    this.address = "";
    this.email = "";
    this.phone = "";
    this.events?.emit(EVENTS.BUYER_CHANGED, {});
  }

  public validateStep1(): Step1Errors {
    const errors: Step1Errors = {};
    if (!this.payment) errors.payment = "Выберите способ оплаты";
    if (!this.address || !this.address.trim())
      errors.address = "Необходимо указать адрес";
    return errors;
  }

  public validateStep2(): Step2Errors {
    const errors: Step2Errors = {};
    if (!this.email || !this.email.trim()) errors.email = "Укажите email";
    if (!this.phone || !this.phone.trim()) errors.phone = "Укажите телефон";
    return errors;
  }
}
