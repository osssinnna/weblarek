# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с TS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

# Интернет-магазин «Web-Larёk»

«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component

Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`

#### Класс Api

Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах эндпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на эндпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter

Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` - хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

## Данные

В приложении используются две доменные сущности — **товар** и **покупатель**. Ниже приведены интерфейсы и их назначение.

### Интерфейсы данных

```ts
// Тип способа оплаты
export type TPayment = "card" | "cash";

// Товар каталога
export interface IProduct {
  id: string; // уникальный идентификатор товара
  description: string; // краткое описание
  image: string; // относительный путь к изображению
  title: string; // название
  category: string; // категория (для бейджа)
  price: number | null; // цена; null — товар недоступен к покупке
}

// Данные покупателя
export interface IBuyer {
  payment: TPayment; // 'card' | 'cash'
  email: string;
  phone: string;
  address: string;
}

// Ответ сервера на GET /product
export interface IProductsResponse {
  total: number;
  items: IProduct[];
}

// Тело запроса на POST /order
export interface IOrderPayload {
  items: string[]; // массив id выбранных товаров
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  total: number; // итоговая сумма заказа
}

// Ответ сервера на POST /order
export interface IOrderResult {
  id: string; // номер/идентификатор заказа
  total: number; // списанная сумма
  success: boolean; // успешность операции
}
```

## Модели данных

Модели отвечают только за хранение и преобразование данных; они не зависят от DOM и API.

### ProductsModel (каталог)

**Зона ответственности:**

- хранит массив всех товаров каталога;
- хранит товар, выбранный для детального просмотра;
- предоставляет методы поиска и выборки.

**Конструктор:** без параметров.

**Поля:**

- `items: IProduct[]` — список всех товаров каталога;
- `selectedId: string | null` — id выбранного товара.

**Методы:**

- `setItems(items: IProduct[]): void` — сохранить массив товаров;
- `getItems(): IProduct[]` — получить копию массива товаров;
- `getItemById(id: string): IProduct | undefined` — найти товар по id;
- `setSelectedProduct(id: string | null): void` — сохранить id выбранного товара;
- `getSelectedProduct(): IProduct | null` — вернуть выбранный товар или `null`.

### CartModel (корзина)

**Зона ответственности:**

- хранит товары, выбранные пользователем для покупки;
- предоставляет операции добавления/удаления/очистки;
- считает количество и итоговую стоимость.

**Конструктор:** без параметров.

**Поля:**

- `items: Map<string, IProduct>` — отображение `id → товар` (по одному экземпляру каждого товара).

**Методы:**

- `getItems(): IProduct[]` — получить массив товаров из корзины;
- `add(product: IProduct): void` — добавить товар (игнорирует товары с `price: null`);
- `remove(productOrId: IProduct | string): void` — удалить по объекту товара или по `id`;
- `clear(): void` — очистить корзину;
- `getCount(): number` — количество позиций в корзине;
- `has(id: string): boolean` — проверка наличия товара по `id`;
- `getTotal(): number` — сумма цен всех товаров (товары с `price: null` учитываются как `0`).

---

### BuyerModel (покупатель)

**Зона ответственности:**

- хранит данные покупателя, вводимые на двух шагах оформления (оплата/адрес и контакты);
- позволяет сохранять данные по одному полю, не затирая остальные;
- выполняет базовую валидацию полей по шагам.

**Конструктор:** без параметров.

**Поля:**

- `payment?: TPayment`
- `address?: string`
- `email?: string`
- `phone?: string`

**Методы записи/чтения:**

- `setPayment(value: TPayment): void`
- `setAddress(value: string): void`
- `setEmail(value: string): void`
- `setPhone(value: string): void`
- `get(): { payment?: TPayment; address?: string; email?: string; phone?: string }` — текущее состояние;
- `clear(): void` — очистить все поля.

**Валидация:**

- `validateStep1(): { payment?: string; address?: string }`
  **Правила:**
  - `payment` — должен быть `'card' | 'cash'`;
  - `address` — непустая строка.
- `validateStep2(): { email?: string; phone?: string }`
  **Правила:**
  - `email` — непустая строка;
  - `phone` — непустая строка.

## Слой коммуникации

Для работы с сервером используется класс-обёртка над базовым Api из стартера. Класс наследуется от Api, поэтому напрямую использует его методы get и post без передачи экземпляра через конструктор.

**Класс:** `WebLarekApi`

**Конструктор:**

- `constructor(baseUrl: string, options?: RequestInit)`

**Публичные методы:**

- `getProducts(): Promise<IProduct[]>` — выполняет `GET /product/`, возвращает массив `items` из ответа (`IProductsResponse`);
- `postOrder(payload: IOrderPayload): Promise<IOrderResult>` — отправляет заказ `POST /order/`, возвращает результат (`IOrderResult`).

**Эндпоинты:**

- `GET /product/` → `IProductsResponse`
- `POST /order/` + body `IOrderPayload` → `IOrderResult`

## Слой Представления (View)

Каждый класс представления отвечает за свой блок разметки, находит элементы в конструкторе и сохраняет ссылки в полях.

### Модальное окно: `Modal`

Модальное окно **не имеет дочерних классов**. Внутри отображаются самостоятельные компоненты.

- **Конструктор:** `constructor(container: HTMLElement)`
- **Поля:**
  - `protected closeButton: HTMLButtonElement` — `.modal__close`
  - `protected contentElement: HTMLElement` — `.modal__content`
- **Методы:**
  - `open(content?: HTMLElement): void` — вставляет контент и добавляет модификатор `modal_active` элементу `.modal`. Блокирует скролл страницы.
  - `close(): void` — снимает `modal_active`. Возвращает скролл страницы.
  - `set content(value: HTMLElement | null)` — замена содержимого `.modal__content`.

### Шапка: `Header`

- **Конструктор:** `constructor(events: IEvents, container: HTMLElement)`
- **Поля:**
  - `protected basketButton: HTMLButtonElement` — `.header__basket`
  - `protected counterElement: HTMLElement` — `.header__basket-counter`
- **Методы:**
  - `render(data: { counter: number }): HTMLElement` — обновляет счётчик.
- **События (emit):**
  - `basket:open` — при клике по иконке корзины.

### Галерея каталога: `Gallery`

- **Конструктор:** `constructor(container: HTMLElement)`
- **Поля:**
  - `protected catalogElement: HTMLElement` — равен самому контейнеру `.gallery`.
- **Методы:**
  - `render(data: { catalog: HTMLElement[] }): HTMLElement` — заменяет детей контейнера; каждому элементу гарантируется класс `.gallery__item`.

### Базовая карточка: `Card<T extends object = {}>`

(родитель для карточек каталога/превью/корзины)

- **Конструктор:** `constructor(container: HTMLElement, actions?: { onClick?: () => void; onBuy?: () => void; onRemove?: () => void })`
- **Поля:**
  - `protected titleElement: HTMLElement` — `.card__title`
  - `protected priceElement: HTMLElement` — `.card__price`
- **Методы/сеттеры:**
  - `set title(value: string)` — текст заголовка.
  - `set price(value: number | null)` — цена или «Бесценно».
- **Особенность:** клик по **внутренней** кнопке не триггерит `onClick` карточки.

### Карточка в каталоге: `CardCatalog extends Card`

- **Конструктор:** `constructor(container: HTMLElement, actions?: { onClick?: () => void })`
- **Поля:**
  - `protected imageElement: HTMLImageElement` — `.card__image`
  - `protected categoryElement: HTMLElement` — `.card__category`
- **Методы/сеттеры:**
  - `render(data: { title: string; price: number | null; image: string; category: string }): HTMLElement`
  - применяет модификаторы элемента `.card__category` по `categoryMap` (см. `src/utils/constants.ts`).

### Карточка превью (в модалке): `CardPreview extends Card`

- **Конструктор:** `constructor(container: HTMLElement, actions?: { onBuy?: () => void; onRemove?: () => void })`
- **Поля:**
  - `protected imageElement: HTMLImageElement` — `.card__image`
  - `protected textElement: HTMLElement` — `.card__text`
  - `protected actionButton: HTMLButtonElement` — `.card__button`
- **Методы/сеттеры:**
  - `render(data: { title: string; price: number | null; image: string; description: string; inCart: boolean }): HTMLElement`
  - если `price === null` — `actionButton.disabled = true`, текст «Недоступно»; иначе текст «Купить»/«Удалить из корзины» по `inCart`.

### Карточка в корзине (строка): `CardInCart extends Card`

- **Конструктор:** `constructor(container: HTMLElement, actions?: { onRemove?: () => void })`
- **Поля:**
  - `protected indexElement: HTMLElement` — `.basket__item-index`
  - `protected removeButton: HTMLButtonElement` — `.basket__item-delete`
- **Методы/сеттеры:**
  - `render(data: { index: number; title: string; price: number | null }): HTMLElement`

### Корзина(модальное окно): `BasketView`

- **Конструктор:** `constructor(container: HTMLElement, onCheckout: () => void)`
- **Поля:**
  - `protected listElement: HTMLElement` — `.basket__list`
  - `protected totalElement: HTMLElement` — `.basket__price`
  - `protected checkoutButton: HTMLButtonElement` — `.basket__button`
- **Методы/сеттеры:**
  - `render(data: { items: HTMLElement[]; total: number; empty: boolean }): HTMLElement`
  - при `empty = true` — выводит «Корзина пуста» и дизейблит кнопку оформления.
- **События (emit через коллбэк):**
  - `basket:checkout` — при клике по кнопке «Оформить».

### Базовая форма: `BaseForm<T extends object = {}>`

- **Конструктор:**  
  `constructor(container: HTMLFormElement, onSubmit: () => void, onChange?: (data: Partial<T>) => void)`
- **Поля:**
  - `protected submitButton: HTMLButtonElement` — `button[type="submit"]`
  - `protected errorsElement: HTMLElement` — `.form__errors`
- **Методы/сеттеры:**
  - `render(data: Partial<T & { valid?: boolean; errors?: Record<string,string> }>): HTMLElement`
  - `set valid(value: boolean)` — включает/выключает кнопку submit.
  - `set errors(map: Record<string,string>)` — выводит агрегированное сообщение об ошибках.

### Первая форма обработки ошибок: `OrderStep1Form extends BaseForm<{ payment: 'card'|'cash'|''; address: string }>`

- **Конструктор:**  
  `constructor(container: HTMLFormElement, onSubmit: () => void, onChange: (data: Partial<{ payment: 'card'|'cash'|''; address: string }>) => void)`
- **Поля:**
  - кнопки выбора оплаты — `.button_alt` (активная помечается модификатором `button_alt-active`)
  - поле адреса — `input[name="address"]`
- **Методы/сеттеры:**
  - `render(data: { payment: 'card'|'cash'|''; address: string; valid: boolean; errors: Record<string,string> }): HTMLElement`

### Вторая форма обработки ошибок: `OrderStep2Form extends BaseForm<{ email: string; phone: string }>`

- **Конструктор:**  
  `constructor(container: HTMLFormElement, onSubmit: () => void, onChange: (data: Partial<{ email: string; phone: string }>) => void)`
- **Поля:**
  - поле email — `input[name="email"]`
  - поле phone — `input[name="phone"]`
- **Методы/сеттеры:**
  - `render(data: { email: string; phone: string; valid: boolean; errors: Record<string,string> }): HTMLElement`

### Модалбное окно «Заказ оформлен»: `OrderSuccess`

- **Конструктор:** `constructor(container: HTMLElement, onClose: () => void)`
- **Поля:**
  - `protected descriptionElement: HTMLElement` — `.order-success__description`
  - `protected closeButton: HTMLButtonElement` — `.order-success__close`
- **Методы/сеттеры:**
  - `render(data: { total: number }): HTMLElement` — выставляет текст «Списано N синапсов».

## События, генерируемые Представлениями

Имена событий перечислены в `src/components/base/eventNames.ts`.

- `basket:open` — клик по корзине в шапке (`Header`)
- `card:select` — выбор карточки в каталоге (`CardCatalog`)
- `card:buy` — клик «Купить» в превью (`CardPreview`)
- `card:remove` — клик «Удалить из корзины» в превью или в строке корзины (`CardPreview`, `CardInCart`)
- `basket:checkout` — клик «Оформить» в корзине (`BasketView`)
- `order:step1:next` — сабмит формы шага 1 (`OrderStep1Form`)
- `order:step2:pay` — сабмит формы шага 2 (`OrderStep2Form`)
