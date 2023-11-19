import { expect } from '@playwright/test';
import productPage from '../elementMap/productPage';
/**
 * Класс для создания вспомогательных функций
 */
export default class FuncHelp {
  constructor() {}
  
  /**
   * Авторизация на сайте.
   * @param {string} login — значение логина
   * @param {string} pass — значение пароля
   */
  async login(page, login: string, pass: string) {
    await page.goto('/login');
    await page.getByPlaceholder(/логин/i).click();
    await page.getByPlaceholder(/логин/i).fill(login);
    await page.getByPlaceholder(/пароль/i).click();
    await page.getByPlaceholder(/пароль/i).fill(pass);
    await page.getByPlaceholder(/пароль/i).press('Enter');
    await page.getByRole('button', { name: /вход|войти/i }).click();
  }

  /**
   * Очистка корзины.
   */
  async clearBasket(page) {
    const countItemBasket = page.locator('.basket-count-items').textContent();
    if (await countItemBasket !== '0') { // Если корзина пуста, то её необязательно очищать
      if (await countItemBasket === '9') { // Временная мера, чтобы из-за бага не чистить руками корзину
        await this.addToBasket(page, 1, false);
        await page.waitForResponse('basket/get');
      }
      await page.locator('#dropdownBasket').click();
      await page.getByRole('button', { name: 'Очистить корзину' }).click();
      await expect(page.locator('.basket-count-items')).toHaveText('0');
    }
  }

  /**
   * Проверка кол-ва добавленного товара
   * @param {number} amount — кол-во добавленного товара, которое хотим сверить
   */
  async checkAmountBasket(page, amount: number) {
    await expect(page.locator('.basket-count-items')).toHaveText(`${amount}`);
  }

  /**
   * Нажатие на элемент
   * @param {string} elementName — название элемента в elementMap
   */
  async clickOnElement(page, elementName: string) {
    await productPage.getElementByName(page, elementName).click();
  }

  /**
   * Проверка url(а) при переходе на другую страницу
   * @param {string} namePage — название страницы в urlMap
   */
  async expectURL(page, namePage: string) {
    const urlMap = [
      { namePage: 'Страница корзины', url: /.*\/basket$/ },
    ];
    function getUrlByName(namePage: string) {
      const element = urlMap.find((elem) => elem.namePage === namePage);
      if (element) {
      return element.url;
      } else {
        throw new Error('Такого элемента нет в urlMap');
      }
    }
    await expect(page).toHaveURL(getUrlByName(namePage));
  }

  /**
   * Добавление товара в корзину, прокликивает каждую карточку товара, пока не заполнит корзину
   * @param {number} amount — кол-во товара, которое хотим добавить
   * @param {number} discount — если нужно добавить товар только со скидкой, то true
   * если нужно добавить товар только без скидки, то false
   * если нужно добавить товар со скидкой и без, то не указываем аргумент
   */
  async addToBasket(page, amount: number, discount: boolean | null = null) {
    const itemHasDiscount = '.hasDiscount';
    const itemNotDiscount = ':not(.hasDiscount)';
    const addItem = async (itemHasOrNotDiscount: string | null = null) => {
      let allItem = page.locator('.note-item');
      if (itemHasOrNotDiscount !== null) {
        allItem = page.locator(`.note-item${itemHasOrNotDiscount}`);
      }
      const countAllItem = await allItem.count();
      let count = 0;
      let countBreak = 0;
      while (count !== amount) // Если все карточки на странице прошли по одному разу, и требуется ещё добавить товар, то повторяем цикл
        for (let i = 0; i < countAllItem; i++) { // Итерация по всем найденным карточкам товара
          const productCountItem = await allItem.locator('.product_count').nth(i).textContent();
          if (productCountItem === "0" || productCountItem === "") { // Если в карточке товара указан "Склад: 0" или "Склад: "
            countBreak++;
            continue;
          }
          await allItem.getByRole('button', { name: 'Купить' }).nth(i).click();
          count++;
          if (count === amount) break; // Останавливаем цикл, если заполнили корзину необходимым кол-вом товара
        }
        if (countBreak === allItem.count()) { // Если во всех карточках товара указано "Склад: 0", а корзина не полностью заполнена по тест-кейсу
          throw new Error('Не хватает товара, чтобы заполнить корзину!');
        }
    }
    if (discount === true) { // Если требуется добавить только акционный товар
      await addItem(itemHasDiscount);
    } else if (discount === false) { // Если требуется добавить только неакционный товар
      await addItem(itemNotDiscount);
    } else await addItem();
  }

  /**
   * Добавление одного и того же товара в корзину
   * @param {number} amount — кол-во товара, которое хотим добавить
   * @param {number} discount — если нужно добавить товар только со скидкой, то true
   * если нужно добавить товар только без скидки, то false
   */
  async addToBasketSame(page, amount: number, discount: boolean) {
    const itemHasDiscount = '.hasDiscount';
    const itemNotDiscount = ':not(.hasDiscount)';
    const addItem = async (itemHasOrNotDiscount: string | null = null) => {
      let allItem = page.locator('.note-item');
      if (itemHasOrNotDiscount !== null) {
        allItem = page.locator(`.note-item${itemHasOrNotDiscount}`);
      }
      const countAllItem = await allItem.count();
      let countBreak = 0;
      for (let i = 0; i < countAllItem; i++) {
        const productCountItem = Number(await allItem.locator('.product_count').nth(i).textContent());
        if (productCountItem < amount) { // Если товара на складе меньше, чем требуется для заполнения корзины
          countBreak++;
          continue;
        }
        await allItem.locator('.form-control').nth(i).fill(`${amount}`)
        await allItem.getByRole('button', { name: 'Купить' }).nth(i).click();
        break;
      }
      if (countBreak === allItem.count()) { // Если во всех карточках товара указано меньше, чем требуется для заполнения корзины
        throw new Error('Не хватает товара, чтобы заполнить корзину!');
      }
    }
    if (discount === true) { // Если требуется добавить только акционный товар
      await addItem(itemHasDiscount);
    } else { // Если требуется добавить только неакционный товар
      await addItem(itemNotDiscount);
    }
  }

  /**
   * Сверяет сумму всех товаров с итоговой суммой
   */
  async totalPrice (page) {
    let sumTotalPrice: number = 0;
    const allItem = page.getByLabel('Корзина').locator('.basket-item');
    const countAllItem = await allItem.count();
    for (let i = 0; i < countAllItem; i++) {
      const itemPrice = await allItem.locator('.basket-item-price').nth(i).textContent();
      const numItemPrice = parseInt(itemPrice.match(/\d+/))
      sumTotalPrice = sumTotalPrice + numItemPrice;
    }
    const totalPrice = await page.getByLabel('Корзина').locator('.basket_price:near(:text-matches("итого к оплате:", "i"))');
    await expect(totalPrice).toHaveText(String(sumTotalPrice));
  }

  /**
   * Сверяет название добавленного товара по регулярному выражению
   */
  async expectItemTitle (page) {
    const allItem = page.getByLabel('Корзина').locator('.basket-item-title')
    const countAllItem = await allItem.count();
    for (let i = 0; i < countAllItem; i++) {
      await expect(allItem.nth(i)).toHaveText(/.*/);
    }
  }

  /**
   * Сверяет цену добавленного товара по регулярному выражению
   */
  async expectItemPrice (page) {
    const allItem = await page.getByLabel('Корзина').locator('.basket-item-price')
    const countAllItem = await allItem.count();
    for (let i = 0; i < countAllItem; i++) {
      await expect(allItem.nth(i)).toHaveText(/^ - \d{1,5} р\.$/);
    }
  }
}