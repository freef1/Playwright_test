import PageObjectModel from '../classes/pageObjectModel'

const pageElementMap = [
  { name: 'Иконка корзины', locator: '.basket_icon:near(:text-matches("корзина", "i"))' },
  // Ни разу не использовал Xpath в cypress, так же дока Playwright не советует, но в тестовом требовалось показать
  { name: 'Иконка корзины(Xpath)', locator: '//*[@id="dropdownBasket"]/i' },
];

const productPage = new PageObjectModel({
  pageElementMap,
});

export default productPage;