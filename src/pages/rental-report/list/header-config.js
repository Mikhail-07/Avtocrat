import services from '../../../data/services.js'
export default [
  {
    id: "date",
    title: "Дата",
    sortable: true,
    sortType: "number",
    template: data => {
      return `<div class="sortable-table__cell">
          ${data ? new Date(data).toLocaleDateString() : ''}
        </div>`;
    }
  },
  {
    id: "name",
    title: "Имя клиента",
    sortable: true,
    sortType: "string",
  },
  {
    id: "type",
    title: "Тип",
    sortable: true,
    sortType: "number",
    template: data => {
      if (data === 'rent') return `<div class="sortable-table__cell">аренда</div>`
      if (data === 'extension') return `<div class="sortable-table__cell">продление</div>`
      for ( const [key, value] of Object.entries(services)){
        if (data === key) return `<div class="sortable-table__cell">${value}</div>`
      }
      return `<div class="sortable-table__cell"></div>` //в случае отсутсвия известного поля type у записи
    }
  },
  {
    id: "carId",
    title: "Марка машины",
    sortable: true,
    sortType: "string",
  },
  {
    id: "period",
    title: "Период",
    sortable: false,
    sortType: "string"
  },
  {
    id: "perDay",
    title: "В сутки",
    sortable: true,
    sortType: "number",
    template: data => {
      return `<div class="sortable-table__cell">
          ${data ? `${data} ₽` : ''}
        </div>`;
    }
  }, 
  {
    id: "days",
    title: "Дни",
    sortable: true,
    sortType: "number",
  },
  {
    id: "total",
    title: "Итого",
    sortable: true,
    sortType: "number",
    template: data => {
      return `<div class="sortable-table__cell">
          ${data ? `${data} ₽` : ''}
        </div>`;
    }
  },
  {
    id: "deposit",
    title: "Залог",
    sortable: true,
    sortType: "number",
    template: data => {
      return `<div class="sortable-table__cell">
          ${data ? `${data} ₽` : ''}
        </div>`;
    }
  },
];
