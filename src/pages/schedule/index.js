import Schedule from '../../components/schedule/index.js';
import cars from '../../data/cars.js';
import clients from '../../data/clients.js';
import report from '../../data/report-data.js';

export default class Page {
  elem;
  subElements = {};
  components = {};

  initComponents () {
    const schedule = new Schedule(cars, clients, report);
    this.components.schedule = schedule;
  }

  renderComponents () {
    Object.keys(this.components).forEach(component => {
      const root = this.subElements[component];
      const { elem } = this.components[component];
      root.append(elem);
    });
  }

  get template () {
    return `
    <div class="products-edit">
      <div class="content__top-panel">
        <h2 class="page-title">График</h2>
        </h1>
      </div>
      <div>
        <div data-element="schedule">
          <!-- schedule component -->
        </div>        
      </div>
    </div>`;
  }


  render () {
    const elem = document.createElement('div');

    elem.innerHTML = this.template;

    this.elem = elem.firstElementChild;
    this.subElements = this.getSubElements(this.elem);

    this.initComponents();
    this.renderComponents();

    return this.elem;
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
