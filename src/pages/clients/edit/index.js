import ClientForm from "../../../components/client-form/index.js";
import SortableTable from "../../../components/sortable-table/index.js";
import headerConfig from "../../rental-report/list/header-config.js";
import addRent from "./addRent.js"
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
    const rentId = this.match[1];

    this.client = this.clients.find( element => element.id === rentId.split('-')[0])//ищем по id клиента в массиве clients;
    //если приходит просто id клиента, то берем данные из последней аренды
    this.rent = rentId.indexOf('-') === -1
      ? this.client.rents[this.client.rents.length - 1]
      : this.client.rents.find( element => element.id === rentId)//ищем по id аренду в массиве report; 

    const clientForm = new ClientForm(this.client, this.rent);

    //добавлю все его операции и создаю историю поездок
    const data = []
    for (const rent of this.client.rents){
      const result = this.report.filter((item) => item.id === rent.id);
      result.forEach(element => {
        data.push(element)
      });
    }

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
    
    //отвечает за получение и обработку данных из карточки клиента
    this.getClientForm();

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

  getClientForm(){ 
    //получает данные из карты клиента   
    document.body.addEventListener('client-form', this.addRent)
  }

  addRent = ({ detail: clientForm }) => {
    const func = addRent.bind(this);
    func(clientForm);
  }

  destroy () {
    for (const component of Object.values(this.components)) {
      component.destroy();
    }
    document.body.removeEventListener('client-form', this.addRent)
  }
}
