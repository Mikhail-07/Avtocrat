export default [
  {
    id: "name",
    title: "Имя клиента",
    sortable: true,
    sortType: "string",
  },
  {
    id: "tel",
    title: "Телефон",
    sortable: false,
    sortType: "string",
  },
  {
    id: "registration",
    title: "Адрес",
    sortable: false,
    sortType: "string",
  },
  {
    id: "status",
    title: "Статус",
    sortable: true,
    sortType: "string",
    template: data => {
      if (data === 'booked') return `<div class="sortable-table__cell">бронь</div>`
      if (data === 'close') return `<div class="sortable-table__cell">аренда закрыта</div>`
      if (data === 'open') return `<div class="sortable-table__cell">в аренде</div>`
    }
  },
  {
    id: "deposit",
    title: "Залог",
    sortable: true,
    sortType: "number",
  },
  {
    id: "fines",
    title: "Штраф",
    sortable: true,
    sortType: "number",
  }
];
