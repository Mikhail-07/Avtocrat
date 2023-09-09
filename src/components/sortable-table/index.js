export default class SortableTable {
  elem
  subElements

  onSortClick = event =>{
    const column = event.target.closest('[data-sortable = "true"]');

    const toggleOrder = order => {
      const orders = {
        asc: 'desc',
        desc: 'asc'
      };
    return orders[order];
    };

    if (column){
      const {id, order} = column.dataset;
      const newOrder = toggleOrder (order);
      const sortedData = this.sortData (id, newOrder);
      const arrow = column.querySelector('.sortable-table__sort-arrow');
      column.dataset.order = newOrder;

      if (!arrow){
        column.append(this.subElements.arrow);
      }

      this.subElements.body.innerHTML = this.getTableRows(sortedData);
    };
  }

  constructor(
    headersConfig = [],
    data = [],
    tableName = '',
    sorted = {
      id: headersConfig.find(item => item.sortable).id,
      order: 'desc'
    }) {
    this.headersConfig = headersConfig;
    this.data = data;
    this.sorted = sorted;
    this.tableName = tableName

    this.render();
  }

  getTableHeader(){
    return `
      <div data-element="header" class="sortable-table__header sortable-table__row ${this.tableName}">
        ${this.headersConfig.map(item => this.getHeaderConfig(item)).join('')}
      </div>`;
  }

  getHeaderConfig ({title, sortable, id}){
    const order = this.sorted.id === id ? this.sorted.order:'asc';

    return /*html*/`
    <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-order="${order}" >
      <span>${title}</span>
      ${this.getHeaderSortingArrow(id)}
    </div>`;    
  }

  getHeaderSortingArrow(id){
    const isOrderExist = this.sorted.id === id ? this.sorted.order : '';

    return isOrderExist
      ? /*html*/`
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>`
      : '';
  }

  getTableRows(data){

    return data.map((item) => {
        return /*html*/`
        <a href="/${this.tableName}/${item.id}" class="sortable-table__row ${this.tableName}">
          ${this.getTableRow(item)}
        </a>` 
    }).join('');
  }

  getTableRow(item){
    const cells = this.headersConfig.map(({id, template}) => {
      return {
        id,
        template
      };
    });

    return cells.map(({id, template}) => {
      if (template) return template(item[id])
      
      if (id === 'period' && (item.type === 'rent' || item.type === 'extension')){
        const from = new Date (item.from);
        const to = new Date (item.to);
        return `<div class="sortable-table__cell">${("0" + from.getDate()).slice(-2)}.${("0" + from.getMonth()).slice(-2)} - ${("0" + to.getDate()).slice(-2)}.${("0" + to.getMonth()).slice(-2)}</div>`
      }

      return item[id] 
        ? `<div class="sortable-table__cell">${item[id]}</div>`
        : `<div class="sortable-table__cell"> </div>`

    }).join('');
  }

  template(data){
    return /*html*/`
    <div class="sortable-table">
      ${this.getTableHeader()}
        <div data-element="body" class="sortable-table__body">
          ${this.getTableRows(data)}
        </div>
    </div>`
  }

  render(){
    const {id, order} = this.sorted;
    const wrapper = document.createElement('div');
    const sortedData = this.sortData (id, order);

    wrapper.innerHTML = this.template(sortedData);

    this.elem = wrapper.firstElementChild;
    this.subElements = this.getSubElements(this.elem);
    
    this.initEventListener()
  }

  initEventListener(){
    this.subElements.header.addEventListener('pointerdown', this.onSortClick);
  }

  getSubElements(element){
    const result = {};
    const elements = element.querySelectorAll('[data-element]');
    for (const subElement of elements){
      const name = subElement.dataset.element;
      result[name] = subElement;
    }

    return result
  }
  
  sortData(id, order){
    const arr = [...this.data];
    const column = this.headersConfig.find(item => item.id === id);
    const {sortType, customSorting} = column;
    const direction = order === 'asc' ? 1 : -1;

    return arr.sort((a, b) => {
      switch (sortType) {
        case 'number':
          return direction * (a[id] - b[id]);
        case 'string':
          return direction * a[id].localeCompare(b[id], 'ru');
        case 'custom':
          return direction * customSorting(a, b);
        default:
          return direction * (a[id] - b[id]);
      }
    });

  }

  sort(field, order){
    const sortedData = sortData (field, order);
    const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
    const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id = '${field}']`);

    allColumns.forEach (column => {
      column.dataset.order = '';
    })

    currentColumn.dataset.order = order;
    this.subElements.body.innerHTML = this.getTableRows(sortedData)
  }
  remove() {
    this.elem.remove();
    // document.removeEventListener('scroll', this.onWindowScroll);
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }
}