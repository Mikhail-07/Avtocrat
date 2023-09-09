import SortableTable from "../../../components/sortable-table/index.js";
import reportData from "../../../data/report-data.js";
import headerConfig from "./header-config.js";
import SortPanel from "../../../components/sort-panel/index.js"
import filterList from "../../../tools/filter_list.js";

export default class Page {

  filterList = event => {
    const func = filterList.bind(this)
    func(reportData)
  }

  elem;
  subElements = {};
  components = {};

  async initComponents () {
    const sortPanelConfig = [
      {rent: 'аренда'},
      {extension: 'продление'}, 
      {washer: 'мойка'},
      {damage: 'ущерб'},
      {fuel: 'топливо'},
      {late: 'опоздание'},
      {overMileage: 'перепробег'},
      {ticket: 'штраф'} 
    ]
    const sortPanel = new SortPanel(sortPanelConfig);
    const sortableTable = new SortableTable(headerConfig, reportData, 'report');

    this.components.sortPanel = sortPanel;
    this.components.sortableTable = sortableTable;
  }

  initEventListeners() {
    const { subElements } = this.components.sortPanel;
    const { filterName, filterStatus } = subElements;
    for (const element of [filterName, filterStatus]) {
      element.addEventListener("input", this.filterList);
    }
  }


  get template () {
    return `<div class="sales">
      <div class="content__top-panel">
        <h2 class="page-title">Отчет</h2>

        <div data-element="rangePicker"></div>
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

  destroy () {
    for (const component of Object.values(this.components)) {
      component.destroy();
    }
    // this.removeEventListeners();
  }
}