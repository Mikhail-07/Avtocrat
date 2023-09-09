export default class SortPanel {
  elem;
  subElements = {};
  components = {};

  constructor(sortPanelConfig){
    this.sortPanelConfig = sortPanelConfig;
    this.render();
  }

  get template () {
    return `
    <div class="content-box content-box_small">
      <form class="form-inline">
        <div class="form-sort">
          <label class="form-label">Поиск по:</label>
          <input type="text" data-element="filterName" class="form-control_sort" placeholder="ФИО или телефону">
        </div>
        <div class="form-sort">
          <label class="form-label">Статус:</label>
          ${this.selectTemplate(this.sortPanelConfig)}
        </div>
      </form>
    </div>`;
  }

  selectTemplate(sortPanelConfig){
    return /*html*/`
    <select class="form-control_sort" data-element="filterStatus">
      <option value="" selected="">все</option>
      ${(sortPanelConfig.map( item => {
        const key = Object.keys(item);
        const value = Object.values(item);
        return `<option value="${key}">${value}</option>`})).join('')}
    </select>`
  }

  render () {
    const elem = document.createElement('div');

    elem.innerHTML = this.template;

    this.elem = elem.firstElementChild;
    this.subElements = this.getSubElements(this.elem);

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
  }
}

