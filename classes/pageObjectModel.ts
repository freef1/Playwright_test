/**
 * Класс для создания моделей страниц
 * @property {object[]} pageElementMap — карта элементов страницы.
 *  Используется для поиска селекторов по имени (см. getElementSelectorByName)
 */
export default class PageObjectModel {
  pageElementMap
  constructor({
    pageElementMap,
  }) {
    this.pageElementMap = pageElementMap;
  }

  /**
   * Возвращает элемент, найденный по селектору, соотествующему заданному имени в pageElementMap
   * @param {string} name — имя элемента
   * @returns {<HTMLElement>} элемент
   */
  getElementByName(page, name) {
    return page.locator(this.getElementSelectorByName(name));
  }

  /**
   * Возвращает локатор, соотествующий заданному имени в pageElementMap
   *
   * @param {string} name — имя элемента
   * @returns {string} cелектор
   */
  getElementSelectorByName(name) {
    const element = this.pageElementMap.find((elem) => elem.name === name);
    if (element) {
      return element.locator;
    } else {
      throw new Error('Такого элемента нет в pageElementMap');
    }
  }
}
