import SortableTable from "../../../components/sortable-table/index.js";
import clients from "../../../data/clients.js";
import headerConfig from "./header-config.js";
import SortPanel from "../../../components/sort-panel/index.js";
import filterList from "../../../tools/filter_list.js";

export default class Page {
  elem;
  subElements = {};
  components = {};

  filterList = event => {
    const func = filterList.bind(this)
    func(clients)
  }

  async initComponents () {
    const sortPanelConfig = [
      {open: 'в аренде'},
      {close: 'аренда закрыта'}, 
      {booked: 'бронь'}, 
      {bills: 'есть штрафы'}]
    const sortPanel = new SortPanel(sortPanelConfig);
    const sortableTable = new SortableTable(headerConfig, clients, 'clients');

    this.components.sortPanel = sortPanel;
    this.components.sortableTable = sortableTable;
  }

  get template () {
    return `<div class="sales">
      <div class="content__top-panel">
        <h2 class="page-title">Клиенты</h2>
        <!-- <a href="/clients/add" class="button-primary">Добавить клиента</a> -->
      </div>
      <div data-element="sortPanel">
        <!-- sort-panel component -->
      </div>
      <div data-element="sortableTable">
        <!-- sortable-table component -->
      </div>
    </div>`;
  }

  async render () {
    const elem = document.createElement('div');

    elem.innerHTML = this.template;

    this.elem = elem.firstElementChild;
    this.subElements = this.getSubElements(this.elem);

    await this.initComponents();

    this.renderComponents();

    this.subElements = this.getSubElements(this.elem);
    this.initEventListeners();

    return this.elem;
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

  initEventListeners() {
    const { subElements } = this.components.sortPanel;
    const { filterName, filterStatus } = subElements;
    for (const element of [filterName, filterStatus]) {
      element.addEventListener("input", this.filterList);
    }
  }

  destroy () {
    for (const component of Object.values(this.components)) {
      component.destroy();
    }
    // this.removeEventListeners();
  }
}