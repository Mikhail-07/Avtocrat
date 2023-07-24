export default class SortableTable {
  element
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

  constructor(headersConfig = [], {
    data = [],
    sorted = {
      id: headersConfig.find(item => item.sortable).id,
      order: 'asc'
    }
  } = {}) {
    this.headersConfig = headersConfig;
    this.data = data;
    this.sorted = sorted;

    this.render();
  }

  getTableHeader(){
    return `
      <div data-element="header" class="sortable-table__header sortable-table__row">
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
        <a href="/products/${item.id}" class="sortable-table__row">
          ${this.getTableRow(item)}
        </a>` 
    }).join('');
    
  }

  getTableRow(client, rent){
    const cells = this.headersConfig.map(({id}) => {
      return {
        id
      };
    });

    return cells.map(({id}) => {
      
      if (id === 'date') return `<div class="sortable-table__cell">${client[id].d}.${client[id].m}</div>`

      return client[id] 
        ? `<div class="sortable-table__cell">${client[id]}</div>`
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

    this.element = wrapper.firstElementChild;
    this.subElements = this.getSubElements(this.element);
    
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
  
  sortData(field, order){
    const arr = [...this.data];
    const column = this.headersConfig.find(item => item.id === field);
    
    const directions = {
      asc: 1,
      desc: -1,
    };

    const direction = directions[order];

    return arr.sort((a, b) => {
      switch (column.sortType){
        case 'number':
          return direction * (a[field] - b[field]);
        case 'string':
          return direction * a[field].localeCompare(b[field], ['ru', 'en']);
      };
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
}