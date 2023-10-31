export default function(headings, monthsRow, daysRow, bodyRow){
  let [ month, year] = headings[0].dataset.listId.split('.');
  
  month--
  const date = new Date (year, month)
  //кол-во дней в месяце
  this.days = this.daysAmount(year, month)

  month < 10 ? '0' + month : month
  
  //создаем строку с месяцем
  const mWrapper = document.createElement('tr');
  mWrapper.innerHTML = this.getHeaderMonth(date.getFullYear(), date.getMonth(), this.days);
  const headerMonth = mWrapper.firstElementChild;
  const td = monthsRow.querySelector('td')
  td.after(headerMonth);

  //создаем строку с днями
  let i = this.days;
  while ( i > 0){
    const tr = document.createElement('tr');
    tr.innerHTML = /*html*/`
    <th data-day="${i}" data-month="${date.getMonth()}" data-year="${date.getFullYear()}">
        ${i}
        <span></span>
        <span></span>
      </th>`;
    const td = daysRow.querySelector('td')
    td.after(tr.firstElementChild)
    i --
  }

  //создает строку с ячейками клиента
  const rows = bodyRow.querySelectorAll('tr')
  for (const row of rows){
    let i = 0;
    while (i != this.days){
      i++
      const carCell = row.querySelector('td')
      const td = document.createElement('td');
      carCell.after(td);
    }
  }
  const { width } = headerMonth.getBoundingClientRect();
  window.scrollBy( width, 0);

  this.getAppointments(month, year)
} 