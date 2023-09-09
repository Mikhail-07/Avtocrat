import SortableTable from "../../../components/sortable-table/index.js";
import cars from "../../../data/cars.js";
import headerConfig from "./header-config.js";
import SortPanel from "../../../components/sort-panel/index.js"

export default class Page {
  element;
  subElements = {};
  components = {};

  async initComponents () {
    // const sortPanel = new SortPanel();
    const sortableTable = new SortableTable(headerConfig, cars, 'cars');

    // this.components.sortPanel = sortPanel;
    this.components.sortableTable = sortableTable;
  }


  
  get template () {
    return `<div class="sales">
      <div class="content__top-panel">
        <h2 class="page-title">Автомобили</h2>
        <!-- <a href="/clients/add" class="button-primary">Добавить автомобиль</a> -->
      </div>
      <div data-element="sortableTable">
        <!-- sortable-table component -->
      </div>
    </div>`;
  }
  async render () {
    const element = document.createElement('div');

    element.innerHTML = this.template;

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);

    await this.initComponents();

    this.renderComponents();

    this.subElements = this.getSubElements(this.element);

    return this.element;
  }

  renderComponents () {
    Object.keys(this.components).forEach(component => {
      const root = this.subElements[component];
      const { elem } = this.components[component];

      root.append(elem);
    });
  }

  getSubElements ($element) {
    const elements = $element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  destroy () {
    for (const component of Object.values(this.components)) {
      component.destroy();
    }
    // this.removeEventListeners();
  }
}