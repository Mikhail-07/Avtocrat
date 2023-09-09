export default function(headings, monthsRow, daysRow, bodyRow){
  let [ month, year] = headings[0].dataset.listId.split('.');
    month = parseInt(month)
    month--

    //кол-во дней в месяце
    const daysAmount = this.daysAmount(year, month)

    month < 10 ? '0' + month : month
    
    //создаем строку с месяцем
    const mWrapper = document.createElement('tr');
    mWrapper.innerHTML = this.getHeaderMonth(year, month, daysAmount);
    const headerMonth = mWrapper.firstElementChild;
    const td = monthsRow.querySelector('td')
    td.after(headerMonth);

    //создаем строку с днями
    let i = daysAmount;
    while ( i > 0){
      const tr = document.createElement('tr');
      tr.innerHTML = /*html*/`
      <th data-day="${i}" data-month="${month}" data-year="${year}">
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
      while (i!=daysAmount){
        i++
        const carCell = row.querySelector('td')
        const td = document.createElement('td');
        carCell.after(td);
      }
    }
    const { width } = headerMonth.getBoundingClientRect();
    window.scrollBy( width, 0);

    for (const client of this.clients){ //поочередно берем клиента из базы 
      this.getClientsList(client, month, year)
    }
} 