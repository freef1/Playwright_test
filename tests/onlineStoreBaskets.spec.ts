import { test, expect } from '@playwright/test';
import FuncHelp from '../classes/functionHelpers';

const funcHelp = new FuncHelp();

test.describe('Переход в корзину', () => {
  test.beforeEach('Авторизация и очистка корзины', async ({ page }) => {
      
    await funcHelp.login(page, 'test','test');
    await funcHelp.clearBasket(page);
  });

  test('Переход в пустую корзину', async ({ page }) => {
    test.fail(); // Поможет вспомнить о тесте, когда пофиксят баг, ведь если тест пройдёт, то в отчёте он будет помечен как "failed"
    await test.step('Нажимаю на иконку корзины', async () => {
      await funcHelp.clickOnElement(page, 'Иконка корзины');
    });

    await test.step('Открывается окно корзины', async () => {
      await expect(page.getByLabel('Корзина')).toBeVisible();
    });

    await test.step('В окне корзины нажимаю кнопку "Перейти в корзину"', async () => {
      await page.getByRole('button', { name: 'Перейти в корзину' }).click();
    });

    await test.step('Осуществляется переход на страницу корзины', async () => {
      await funcHelp.expectURL(page, 'Страница корзины')
      /**
       * В будущем желательны тест-кесы с проверкой ожидаемого отображения элементов на странице.
       * Сейчас 500 ошибка текстом, не запросом. Обычно переходы на другую страницу проверяются
       * успешным ответом с бэка, который приходит после действия, как нажатие на кнопку. И тем,
       * что url страницы совпадает с ожидаемым url(ом).
       */
    });
  });

  test('Переход в корзину с 1 неакционным товаром', async ({ page }) => {
    await test.step('Добавляю в корзину один товар без скидки', async () => {
      await funcHelp.addToBasket(page, 1, false); // Решил добавлять через эту функцию, а не прокликивая заранее подготовленные тестовые данные
    });

    await test.step('Рядом с корзиной отображается цифра 1', async () => {
      await funcHelp.checkAmountBasket(page, 1);
    });

    await test.step('Нажимаю на иконку корзины', async () => {
      await funcHelp.clickOnElement(page, 'Иконка корзины(Xpath)');
    });

    await test.step('Открывается окно корзины, в котором указана цена, наименование товара, общая сумма', async () => {
      await expect(page.getByLabel('Корзина')).toBeVisible();
      await funcHelp.expectItemTitle(page);
      await funcHelp.expectItemPrice(page);
      await funcHelp.totalPrice(page);
    });

    await test.step('В окне корзины нажимаю кнопку "Перейти в корзину"', async () => {
      await page.getByRole('button', { name: 'Перейти в корзину' }).click();
    });

    await test.step('Осуществляется переход на страницу корзины', async () => {
      await funcHelp.expectURL(page, 'Страница корзины')
    });
  });

  test('Переход в корзину с 1 акционным товаром', async ({ page }) => {
    test.fail();
    await test.step('Добавляю в корзину один товар со скидкой', async () => {
      await funcHelp.addToBasket(page, 1, true);
    });

    await test.step('Рядом с корзиной отображается цифра 1', async () => {
      await funcHelp.checkAmountBasket(page, 1);
    });

    await test.step('Нажимаю на иконку корзины', async () => {
      await funcHelp.clickOnElement(page, 'Иконка корзины');
    });

    await test.step('Открывается окно корзины, в котором указана цена, наименование товара, общая сумма', async () => {
      await expect(page.getByLabel('Корзина')).toBeVisible();
      await funcHelp.expectItemTitle(page);
      await funcHelp.expectItemPrice(page);
      await funcHelp.totalPrice(page);
    });

    await test.step('В окне корзины нажимаю кнопку "Перейти в корзину"', async () => {
      await page.getByRole('button', { name: 'Перейти в корзину' }).click();
    });

    await test.step('Осуществляется переход на страницу корзины', async () => {
      await funcHelp.expectURL(page, 'Страница корзины')
    });
  });

  test('Переход в корзину с 9 разными товарами', async ({ page }) => {
    test.fail();
    await funcHelp.addToBasket(page, 1, true);

    await test.step('Добавляю в корзину 8 разных товаров', async () => {
      await funcHelp.addToBasket(page, 8);
    });

    await test.step('Рядом с корзиной отображается цифра 9', async () => {
      await funcHelp.checkAmountBasket(page, 9);
    });

    await test.step('Нажимаю на иконку корзины', async () => {
      await funcHelp.clickOnElement(page, 'Иконка корзины');
    });

    await test.step('Открывается окно корзины, в котором указана цена, наименование товара, общая сумма', async () => {
      await expect(page.getByLabel('Корзина')).toBeVisible();
      await funcHelp.expectItemTitle(page);
      await funcHelp.expectItemPrice(page);
      await funcHelp.totalPrice(page);
    });

    await test.step('В окне корзины нажимаю кнопку "Перейти в корзину"', async () => {
      await page.getByRole('button', { name: 'Перейти в корзину' }).click();
    });

    await test.step('Осуществляется переход на страницу корзины', async () => {
      await funcHelp.expectURL(page, 'Страница корзины')
    });
  });

  test('Переход в корзину с 9 акционными товарами одного наименования', async ({ page }) => {
    await test.step('Добавляю в корзину 9 товаров одного наименования со скидкой', async () => {
      await funcHelp.addToBasketSame(page, 9, true);
    });

    await test.step('Рядом с корзиной отображается цифра 9', async () => {
      await funcHelp.checkAmountBasket(page, 9);
    });

    await test.step('Нажимаю на иконку корзины', async () => {
      await funcHelp.clickOnElement(page, 'Иконка корзины');
    });

    await test.step('Открывается окно корзины, в котором указана цена, наименование товара, общая сумма', async () => {
      await expect(page.getByLabel('Корзина')).toBeVisible();
      await funcHelp.expectItemTitle(page);
      await funcHelp.expectItemPrice(page);
      await funcHelp.totalPrice(page);
    });

    await test.step('В окне корзины нажимаю кнопку "Перейти в корзину"', async () => {
      await page.getByRole('button', { name: 'Перейти в корзину' }).click();
    });

    await test.step('Осуществляется переход на страницу корзины', async () => {
      await funcHelp.expectURL(page, 'Страница корзины')
    });
  });
});
