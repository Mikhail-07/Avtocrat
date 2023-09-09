import ClientForm from "../../../components/client-form/index.js";
import SortableTable from "../../../components/sortable-table/index.js";
import headerConfig from "../../rental-report/list/header-config.js";
import clients from "../../../data/clients.js";
import report from "../../../data/report-data.js";

export default class Page {
  element;
  subElements = {};
  components = {};

  report = report;
  clients = clients;

  constructor(match) {
    this.match = match;
  }

  initComponents () {
    const [ productId ] = this.match[1];
    const clientForm = new ClientForm(productId);

    const client = this.clients.find( element => element.id === productId)//ищем по id клиента в массиве clients;
    const data = []
    for (const rent of client.rents){
      const result = this.report.filter((item) => item.id === rent.id);
      result.forEach(element => {
        data.push(element)
      });
      
    }
    console.log(data)

    const sortableTable = new SortableTable(headerConfig, data, 'report')

    this.components.clientForm = clientForm;
    this.components.sortableTable = sortableTable;
  }

  get template () {
    return `
    <div class="products-edit">
      <div class="content__top-panel">
        <h1 class="page-title">
          <a href="/clients" class="link">Клиенты</a> / Добавить
        </h1>
      </div>
      <div>
        <div data-element="clientForm">
          <!-- product-form component -->
        </div>        
      </div>

      <h3 class="block-title">История поездок</h3>

      <div data-element="sortableTable">
        <!-- sortableTable component -->
      </div>
      
    </div>`;
  }

  render () {
    const element = document.createElement('div');

    element.innerHTML = this.template;

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);

    this.initComponents();

    this.renderComponents();

    return this.element;
  }

  renderComponents () {
    Object.keys(this.components).forEach(component => {
      const root = this.subElements[component];
      const { elem } = this.components[component];
      root.append(elem);
      console.log('too fast')
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
  }
}
