export default function(headings, monthsRow, daysRow, bodyRow){
  const headingLast = headings.length - 1
  let [ month, year] = headings[headingLast].dataset.listId.split('.');
  month = parseInt(month);
  month++
  //кол-во дней в месяце
  const daysAmount = this.daysAmount(year, month-1)
  
  month < 10 ? '0' + month : month    
  
  //создаем строку с месяцем
  const mWrapper = document.createElement('tr');
  mWrapper.innerHTML = this.getHeaderMonth(year, month, daysAmount);
  const headerMonth = mWrapper.firstElementChild;
  monthsRow.append(headerMonth);

  //создаем строку с днями
  for (let i = 1; i <= daysAmount; ++i){
    const tr = document.createElement('tr');
    tr.innerHTML = /*html*/`
      <th data-day="${i}" data-month="${month}" data-year="${year}">
        ${i}
        <span></span>
        <span></span>
      </th>`;
    daysRow.append(tr.firstElementChild)
  }

  //создает строку с ячейками клиента
  const rows = bodyRow.querySelectorAll('tr')
  for (const row of rows){
    let i = 0;
    while (i!=daysAmount){
      i++
      const td = document.createElement('td');
      row.append(td);
    }
  }
  this.getAppointments(month, year)
} 