import CarForm from "../../../components/car-form/index.js";
import SortableTable from "../../../components/sortable-table/index.js";
import headerConfig from "../../rental-report/list/header-config.js";
import addCarData from "./add-car-data.js";
import cars from "../../../data/cars.js"
import clients from "../../../data/clients.js";
import reportData from "../../../data/report-data.js";

export default class Page {
  element;
  subElements = {};
  components = {};

  reportData = reportData;
  cars = cars;
  clients = clients;

  constructor(match) {
    this.match = match;
  }

  initComponents () {
    const carId = this.match[1];

    this.car = this.cars.find( element => element.id === carId)//ищем по id маишну в массиве cars;
    
    const carForm = new CarForm(this.car);

    //добавлю все его операции и создаю историю поездок
    const data = reportData.filter((item) => item.carId === carId);
    const sortableTable = new SortableTable(headerConfig, data, 'report')

    this.components.carForm = carForm;
    this.components.sortableTable = sortableTable;
  }

  get template () {
    return `
    <div class="products-edit">
      <div class="content__top-panel">
        <h1 class="page-title">
          <a href="/cars" class="link">Автомобили</a> / Добавить
        </h1>
      </div>
      <div data-element="carForm">
        <!-- product-form component -->
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
    
    //отвечает за получение и обработку данных из карточки авто
    this.getCarForm();

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

  getCarForm(){ 
    //получает данные из карты клиента   
    document.body.addEventListener('car-form', this.addCarData)
  }

  addCarData = ({ detail: carForm }) => {
    const func = addCarData.bind(this);
    func(carForm);
  }

  destroy () {
    for (const component of Object.values(this.components)) {
      component.destroy();
    }
    document.body.removeEventListener('car-form', this.addCarData)
  }
}
