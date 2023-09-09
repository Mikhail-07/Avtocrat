//при добавлениее записи в клиентскую базу указывать ее тип
//добавить период аренды/продление/дату создания записи в КБ

import Contextmenu from './context/index.js';

import bookingModal from './booking/booking-modal.js';
import bookingForm from './booking/booking-form.js'

import extensionModal from './extension/extension-modal.js';
import extensionForm from './extension/extension-form.js';

import rentCloseModal from './rent_close/rent_close-modal.js';
import rentCloseForm from './rent_close/rent_close-form.js';

import nextMonth from './month-create/next-month.js';
import previousMonth from './month-create/previous-month.js';

import Resizer from './extension/extension-resize.js'
import cellProperties from './cellProperties.js';
import extensionSpecific from './extension/extension-specific.js';

export default class Schedule{

  elem = {};
  subElements = {};
  clientForm = {};
  contextMenu = {};

  date = new Date(); // сегодняшняя дата
  day = this.date.getDate(); // какой сегодня день по счету
  month = parseInt(this.date.getMonth()) + 1;
  year = this.date.getFullYear();
  days = 0; //дней в текущем месяце
  cellWidth = 40; //ширина ячейки
  scheduleCell = {} //ячейка с записью
  resizerWidth = 6

  setAppointment = (event) => {
    //ищет ячейку с записью appointment
    const appointment = event.target.closest('.schedule__appointmentCell');
    if (appointment) this.appointment = appointment
  }

  onWindowScroll = () =>{
    const tableWidth = this.subElements.table.getBoundingClientRect().width;
    const workZone = 100;

    const{ monthsRow, daysRow, bodyRow } = this.subElements;
    const wrapperWidth = this.elem.getBoundingClientRect().width;
    const dif = tableWidth - wrapperWidth;

    const headings = monthsRow.getElementsByTagName('th');
  

    if ( this.elem.scrollLeft > dif - workZone || tableWidth < wrapperWidth ){    
      this.getNextMonth(headings, monthsRow, daysRow, bodyRow);
    }

    if ( this.elem.scrollLeft === 0 ){
      this.getPreviousMonth(headings, monthsRow, daysRow, bodyRow);
    }
  };


  //определяет ячейку таблицы под курсоромcellProperties
  searchCell = (event) => { 
    this.td = this.cellHighlight(event);

    if (this.td.tagName != 'TD') return
    if (this.td === this.currentTd) return

    if (this.td != this.currentTd && this.currentTd){
      const { carCell, dateCell } = cellProperties(this.currentTd);
      this.currentTd.classList.remove('chosen-cell');
      carCell.classList.add('sleeper-cell');
      carCell.classList.remove('chosen-cell');
      dateCell.classList.remove('chosen-cell');
    }  

    this.currentTd = this.td;
    const { carCell, dateCell } = cellProperties(this.td);
    this.td.classList.add('chosen-cell');
    carCell.classList.remove('sleeper-cell');
    carCell.classList.add('chosen-cell');
    dateCell.classList.add('chosen-cell');
    this.resizerClass.td = this.td;

    return this.td
  }

  clickOnTable = (event) => {
    this.homeCell = this.td;
    const appointment = event.target.closest('.schedule__appointmentCell');
    if (!appointment) return
    const book = appointment.querySelector('[data-filling="book"]')
    if (!book) return
    this.appointment = appointment;

    appointment.ondragstart = () => false;

    const { left, top } = appointment.getBoundingClientRect();
    this.shiftX = event.clientX - left;
    this.shiftY = event.clientY - top;

    document.addEventListener('pointermove', this.moveOnCell);
    document.addEventListener('pointerup', this.pointerupOnCell, {once: true});
  }

  moveOnCell = (event) => {
    this.subElements.bodyRow.removeEventListener('pointermove', this.setAppointment);
    this.moveAt( this.appointment, event.pageX, event.pageY );
  }

  pointerupOnCell = (event) => {
    this.subElements.bodyRow.addEventListener('pointermove', this.setAppointment);
    this.appointment.classList.remove('dragging-shadow');
    this.subElements.table.classList.remove('unselectable')
    document.removeEventListener('pointermove', this.moveOnCell);
    

    this.appointment.style.display = 'none';
    const elemBelow = document.elementFromPoint(event.clientX, event.clientY);
    this.appointment.style.display = '';
    if (elemBelow.tagName === 'TD' && (!elemBelow.closest('td').querySelector('[data-filling="book"]'))) {
      elemBelow.append(this.appointment);
      this.bookPropertiesUpdate(this.td)
    } else {
      this.homeCell.append(this.appointment)
    }
    
    this.appointment.style.position = 'relative';
    this.appointment.style.left = 0 + 'px';
    this.appointment.style.top = 0 + 'px';
    this.subElements.bodyRow.addEventListener('pointermove', this.setAppointment);
  }

  constructor(cars = [], clients = [], report = []){
    this.cars = cars;
    this.clients = clients;
    this.report = report;

    this.render();
  }

  template(){
    return /*html*/`
    <div class="schedule-wrapper">
      <div id="out-click"></div>
      <table data-element="table" id="schedule">
        ${this.getDateHeader(this.year, this.month)}
        <tbody data-element = "bodyRow">
          ${this.getCarsList()}
        </tbody>
    </table>
    </div>
    `
  } 

  getDateHeader(year, month){
    const daysAmount = this.daysAmount(year, month); //получаем кол-во дней в месяце

    return /*html*/`
    <thead>
      <tr data-element = "monthsRow">
        <td class="sticky__left sleeper-cell">
          <button class="button-primary-tags" type="button" id="today" data-element = "today">Today</button>
        </td>
        ${this.getHeaderMonth (year, month, daysAmount)}
      </tr>
      <tr data-element = "daysRow">
        <td class="sticky__left sleeper-cell">
        </td>
        ${this.getHeaderDays(year, month, daysAmount)}
      </tr>
    </thead>`      
  }

  getHeaderMonth(year, month, daysAmount){
    const d = new Date (year, month - 1);
    const monthName = d.toLocaleString('ru', { month: 'long' });

    return /*html*/ `
    <th colspan = ${daysAmount} data-list-id = ${month + '.' + year}>
      ${monthName}
    </th>`
  }

  getHeaderDays(year, month, daysAmount){
    let result = '';
    for (let i = 1; i <= daysAmount; ++i){
    result += /*html*/`
      <th data-day="${i}" data-month="${month}" data-year="${year}">
        ${i}
        <span></span>
        <span></span>
      </th>`;
    }
    // spanы для таймлайна
    return result
  }

  daysAmount(year, month){
    // находим кол-во дней в месяце
    let counter = 0;
    let day = 0;
    const d = new Date (year, month - 1);
    const currentMonth = d.getMonth();
    while (d.getMonth() === currentMonth){
      counter++
      day = d.getDate() + 1
      d.setDate(day)
    }

    this.days = counter
    return this.days
  }

  getCarsList(){
    return this.cars.map((item) =>{
      return /*html*/`
      <tr>
          <td class="schedule__cars sticky__left sleeper-cell" data-car-id="${item.id}">${item.plate}</td>
          ${'<td></td>'.repeat(this.days)}
      </tr>`
    }).join('')
  }

  getClientsCells(){
    return td = document.createElement('td')
  }

  getClientsList(client, eventMonth, eventYear){  //заполняем график клинетами      
    const { rents } = client;
    
    for (const rent of rents){ //поочередно берем аренды клиента
      let appointment

      const from = new Date (rent.from); //начало аренды
      const to = new Date (rent.to); // конец аренды
      const eventfromDate = new Date (eventYear, parseInt(eventMonth) - 1); //месяц который отрисовываем
      const eventtoDate = new Date (eventYear, parseInt(eventMonth)- 1, this.days);  
      let debt = Math.floor(((this.date - to)/3600000)/24);
      
      // if (debt > 0){
      //   console.log(`${client.name} is debtor. Debt amount: ${debt}`)      
      // };

      if (debt > 0 && this.month >= eventMonth && (to.getMonth() + 1) <= this.month){ //!!!добавил ровно из-за бага при смене месяца!!!
        debt = this.debtAdjust( eventMonth, to, eventfromDate, eventtoDate )
      }; 

      //CASEs

      //Booking

      if ( rent.status === 'booked' && ( eventfromDate < rent.tableDate && rent.tableDate < eventtoDate)){
        const date = new Date(rent.tableDate);
        const scheduleCell = this.scheduleCellByRowAndCollumn(rent.carId, date);
        const bookDiv = this.putBookedOnMap(client, rent);
        scheduleCell.append(bookDiv);
        return
      }

      if ( rent.status === 'booked' ) return

      //CASE 1 случай, при котором аренда начинается и кончается в текущем месяце
      if ( from > eventfromDate && to < eventtoDate ){ 
        appointment = this.putClientOnMap(client, rent); //вызываем метод наносящий аренду на график
        this.scheduleCell.append(appointment)
        if ( rent.status === 'open' && debt >= 0) { // debt < this.days - на случай, если это аренда с долгом из CASE 4
          this.debtor( debt, appointment, client.name ) 
        }
        this.textСropping(appointment)
      }

      //CASE 2 случай "переходящей" аренды с прошлого месяца на нынешний
      if ( from < eventfromDate && to > eventfromDate ){
        const borderRent = {};
        const restOfDays = Math.floor(((to - eventfromDate)/3600000/24) + 1); //кол-во дней в текущем месяце
        restOfDays > this.days ? borderRent.days = this.days : borderRent.days = restOfDays; // если кол-во ячеек больше, чем остаток дней в месяце, то закрашиваем клетки на максимальное кол-во дней в месяце
        borderRent.d = 1 //наношу аренду с первой ячейки, так как договор заключен в прошлом месяце
        borderRent.m = eventMonth;
        appointment = this.putClientOnMap(client, rent, borderRent);

        const previousMonth = this.subElements.table.rows[0].querySelector(`[data-list-id="${eventMonth - 1}.${this.year}"]`)//проверка сущетсвет, ли прошлый месяц, если нет, то отрисовывем в нем аренду
        if( parseInt(eventMonth) - 1 <= to.getMonth() && !previousMonth ){ //Не переносилась аренда на ИЮНЬ. добавил =
          this.scheduleCell.append(appointment);
        }
        //!!!убрал ровно из-за бага при смене месяца!!!
        //!!!убрал ">" из-за того что долг присваивался дважды (х2) 05.09.2023
        if (debt > 0 && this.month >= eventMonth){ //дополняет дни долга, если событийный месяц (eventMonth) идет до нынешнего месяца 
          this.debtor( debt, appointment, client.name )
        }
      }

      //CASE 3 случай "переходящей" аренды с нынешнего месяца на следущий
      if ( from > eventfromDate && to > eventtoDate && to > eventfromDate && from > eventfromDate && from < eventtoDate){
        const borderRent = {};
        const restOfDays = Math.ceil((eventtoDate - from)/3600000/24); //считаю сколько ячеек нужно закрыть от начала до конца
        borderRent.days = restOfDays;
        appointment = this.putClientOnMap(client, rent, borderRent); 
        this.scheduleCell.append(appointment);
      }

      //CASE 4 случай "переходящей" аренды с прошлого месяца на нынешний с долгом
      if ( from < eventfromDate && to < eventfromDate  && rent.status === 'open' && eventfromDate < this.date){ 
        const borderRent = {};
        borderRent.d = 1;
        borderRent.m = eventMonth;
        borderRent.days = debt;
        borderRent.type = 'debt';

        appointment = this.putClientOnMap(client, rent, borderRent);  

        if( eventMonth <= this.month ){
          this.scheduleCell.append(appointment)
        }
      } 
      
      if (appointment && rent.status === 'open') this.resizerUpdate(appointment);
    } 
  }  

  textСropping(appointment) {
    const appointmentWidth = appointment.getBoundingClientRect().width;
    const textContentWidth = appointment.querySelector('span').getBoundingClientRect().width;
    if (textContentWidth > appointmentWidth) appointment.querySelector('span').style.width = appointmentWidth -5 + 'px';
  }

  debtAdjust( eventMonth, to, eventfromDate, eventtoDate ){ 
    let debtThisMonth //корректирует кол-во дней долга. Если эти дни превышают кол-во дней в месяце, то долг принимается за дни в месяце.
    
    if ( this.month === eventMonth && eventfromDate < to){
      debtThisMonth = Math.ceil((((this.date - to)/3600000)/24)) - 1 //заменил eventfromDate на to
    }

    if ( this.month === eventMonth && to < eventfromDate){
      debtThisMonth = Math.ceil((((this.date - eventfromDate)/3600000)/24))
    }
    
    if ( this.month > eventMonth ){
      debtThisMonth = Math.ceil(((eventtoDate - to)/3600000)/24);
      debtThisMonth = debtThisMonth > this.days 
        ? this.days 
        : debtThisMonth;
    }

    return debtThisMonth; 
  }

  putBookedOnMap(client, rent){
    const date = new Date (rent.from);
    const d = ("0" + date.getDate()).slice(-2);
    const m = ("0" + (date.getMonth() + 1)).slice(-2);
    const hh = ("0" + date.getHours()).slice(-2);
    const mm = ("0" + date.getMinutes()).slice(-2);

    const div = document.createElement('div');
    div.innerHTML = `
    <div class="schedule__appointmentCell" data-id="${rent.id}" style="width: ${this.cellWidth}px;">
      <div class="schedule__fillingCell" data-filling="book">
        <div class="schedule__fillingCell-sole"></div>
      </div>
      <div class="schedule__textCell-wrapper">
        <span class="schedule__textCell-content">${d}.${m}, ${hh}:${mm}, ${client.name}, тел: +7 ${client.tel}, ${rent.days} дня, ${rent.rate} км.</span>
      </div>
    </div>`

    return div.firstElementChild
  }

  putClientOnMap(client, rent, borderRent = {}) {
    let appointment = {};
    let div = {};
    let i = 0; //если запись уже существует, то мы увеличиваем ее длину на полное количество дней

    const { name, tel } = client;
    const { status, carId, id } = rent;
    const date = new Date(rent.from)
    const dateAdjusted = new Date (date.getFullYear(), date.getMonth(), date.getDate()+1); //плюс один день, чтобы на графике аренда начиналась со следущего дня
    const days = borderRent.days ? borderRent.days : rent.days /*Можно оптимизировать циклом*/
    borderRent.d ? dateAdjusted.setDate(borderRent.d) : '';
    borderRent.m ? dateAdjusted.setMonth(parseInt(borderRent.m) - 1) : '';
    const filling = borderRent.type ? borderRent.type : 'paid';
    this.scheduleCellByRowAndCollumn(carId, dateAdjusted)
    
    const { width } = this.scheduleCell.getBoundingClientRect();
    this.width = Math.round(width);

    
    const row = this.subElements.table.querySelector(`[data-car-id='${carId}']`).closest('tr');
    appointment = row.querySelector(`[data-id="${id}"]`);
    if(!appointment){
      appointment = this.createAppointment(id, name, tel, filling, status);
      i = 1; //i=1, так как первая ячейка уже создана и ее учитывать в итерации нет необходиомсти
    }  

    div = appointment.querySelector(`[data-filling="${filling}"]`); //div debt или paid из appointment
    if(!div){
      div = this.createFillingCell(filling); 
      const rentWrap = appointment.querySelector('.rent-wrap');
      rentWrap.prepend(div)
      i = 1;
    }

    //присваивание цвета дням аренды
    let defaultWidth = parseInt(div.style.width);
    const update = (delta) => div.style.width = `${defaultWidth += delta}px`;
    for ( i; i < days; i++){
      update(this.width);
    }

    const resizer = appointment.querySelector('.resizer');
    if ( !resizer && rent.status === 'open') this.resizerCreate(appointment);

    return appointment
  }

  scheduleCellByRowAndCollumn(car, date){
    //поиск ячейки клиента, по машине (1) и дню (2)
    
    const row = this.subElements.table.querySelector(`[data-car-id='${car}']`).closest('tr'); //(1)
    const rowInd = row.rowIndex;
    const cell = this.subElements.table.querySelector(`[data-day="${date.getDate()}"][data-month="${date.getMonth() + 1}"][data-year="${date.getFullYear()}"]`); //(2)
    const cellInd = cell.cellIndex;
    this.scheduleCell = this.subElements.table.rows[rowInd].cells[cellInd]; //ячейка клиента
    return this.scheduleCell
  }

  resizerCreate(appointment){
    const resizer = document.createElement('div');
    resizer.innerHTML = this.resizerTemplate();
    resizer.classList.add('resizer', 'resizer-r', 'container');
    resizer.dataset.resizable  = 'true';
    appointment.append(resizer);
    this.resizerUpdate(appointment);
  }

  resizerTemplate(){
    return /*html*/`
    <div class="line line-1"></div>
		<div class="line line-2"></div>
    `
  }
  

  resizerUpdate(appointment){
    const paid = appointment.querySelector(`[data-filling="paid"]`);
    if (!paid) return;
    const resizer = appointment.querySelector('.resizer');
    if (!paid || !resizer) return
    
    const { width } = paid.getBoundingClientRect();
    resizer.style.left = width - this.resizerWidth + 'px';
  }

  debtor(debt, appointment, name){
    let i = 0

    if (debt === 0){
      console.log(`${name} must close rent today`);
      return
    }

    let debtDiv = appointment.querySelector('[data-filling=debt]'); //проверяет наличие блока debt
    
    if(!debtDiv){
      debtDiv = this.createFillingCell('debt');
      const divWrap = appointment.querySelector('.rent-wrap')
      divWrap.append(debtDiv);
      i = 1;
    }

    let defaultWidth = parseInt(debtDiv.style.width);
    for ( i; i < debt; i++ ){
      debtDiv.style.width = `${defaultWidth += this.width}px`;
    } 
  }
  
  createAppointment(id, name, tel, filling, status){
    //наполняем созданную запись (appointment)
    const appointment = document.createElement('div');
    appointment.classList.add('schedule__appointmentCell');
    appointment.dataset.id = id;
    
    const divWrap = document.createElement('div');
    divWrap.classList.add('rent-wrap');
    appointment.append(divWrap);

    // помещаем в appointment divFilling который дальше будет отображать тип заполнения paid или debt
    const divFilling = this.createFillingCell(filling, status)
    divWrap.append(divFilling);
    
    const textContentDiv = this.createCellTextContent( name, tel);
    appointment.append(textContentDiv); 

    return appointment
  }

  createFillingCell(filling){
    const div = document.createElement('div');
    div.style.width = this.width + 'px'; 
    div.classList.add('schedule__fillingCell', 'resizable');
    div.dataset.filling = `${filling}`;

    const sole = document.createElement('div');
    sole.classList.add('schedule__fillingCell-sole');
    div.append(sole)

    return div
  }

  createCellTextContent( name, tel ){
    //обертка с absolute
    const div = document.createElement('div');
    div.innerHTML = this.cellTextContentTemplate( name, tel );
    div.classList.add('schedule__textCell-wrapper');

    return div
  }

  cellTextContentTemplate( name, tel ){
    return /*html*/`
    <span class="schedule__textCell-content">${name}, тел: +7 ${tel}</span>`
  }

  render(){
    const elem = document.createElement('div');
    elem.innerHTML = this.template();
    this.elem = elem.firstElementChild;
    this.subElements = this.getSubElements(this.elem);
    
    this.initComponents();
    this.initEventListener();
  }

  initResizer(){
    this.resizerClass = new Resizer();
    this.resizerClass.bodyRow = this.subElements.bodyRow;
    this.resizerClass.cellWidth = this.cellWidth;
    this.resizerClass.initialize();
  }
  
  initEventListener(){
    const { today, bodyRow, table } = this.subElements;
    today.onclick = () => this.today('smooth');
    table.addEventListener('pointerdown', this.clickOnTable);
    bodyRow.addEventListener('pointermove', this.searchCell);
    bodyRow.addEventListener('pointermove', this.setAppointment)
  }

  initialScheduleState (){
    const{ monthsRow, daysRow, bodyRow } = this.subElements;
    const headings = monthsRow.getElementsByTagName('th');
    
    this.getNextMonth(headings, monthsRow, daysRow, bodyRow);
    this.getPreviousMonth(headings, monthsRow, daysRow, bodyRow);

    this.elem.addEventListener('scroll', this.onWindowScroll);

    this.today();
  }

  cellHighlight (event) {
    let td
    if (event.target.tagName != 'TD'){
      const appointment = event.target.closest('.schedule__appointmentCell');
      appointment.style.display = 'none';
      td = document.elementFromPoint(event.clientX, event.clientY);
      appointment.style.display = '';
    } else {
      td = event.target;
    } 
    return td
  } 

  getSubElements(element) {
    const subElements = {};
    const elements = element.querySelectorAll('[data-element]');

    for (const item of elements) {
      subElements[item.dataset.element] = item;
    }

    return subElements;
  }
  
  initComponents(){
    document.body.addEventListener('booking-modal', this.initBookingModal)
    document.body.addEventListener('booking-form', this.getBookingForm)
    document.body.addEventListener('client-form', this.getClientForm)
    document.addEventListener('extension-modal', this.initExtensionModal)
    document.body.addEventListener('extension-form', this.getExtensionForm)
    document.body.addEventListener('extension-specific', this.initExtensionSpecific)
    document.body.addEventListener('rentClose-modal', this.initRentCloseModal)
    document.body.addEventListener('rentClose-form', this.getRentCloseForm)

  }

  initBookingModal = () => bookingModal(this.td)

  //получает данные о бронировании и отмечает в нужной ячейке
  getBookingForm = ({ detail: form }) =>{ 
    const func = bookingForm.bind(this);
    func(form)      
  }

  //получает данные из карты клиента  
  getClientForm = ({ detail: clientForm }) =>{
    const formToObject = Object.fromEntries(clientForm.entries()); // преобразуем clientForm в объект
    formToObject.date = this.dateToObj(formToObject.date, formToObject.time) // преобразует дату и время под клиентскую БД
    delete formToObject.time // удаляем теперь не актуальное время
    formToObject.status = 'open'; // изменение статуса аренды с booked на open      
  }

  initExtensionSpecific = () => {
    const func = extensionSpecific.bind(this);
    func() 
  }

  initExtensionModal = ({ detail: {days, appointmentPaidCell, appointmentDebtCell, resizer} }) => {
    this.appointmentPaidCell = appointmentPaidCell;
    this.appointmentDebtCell = appointmentDebtCell;
    this.resizer = resizer;
    const func = extensionModal.bind(this);
    func(days) 
  }

  getExtensionForm = ({ detail: form }) => {
    //получает данные из карты клиента   
    const func = extensionForm.bind(this);
    func(form);  
  }

  initRentCloseModal = () => {  
    const func = rentCloseModal.bind(this);
    func() 
  }

  getRentCloseForm = ({ detail: form }) => {
    //получает данные при завершении аренды  
    const func = rentCloseForm.bind(this);
    func(form);  
  }

  today(style = 'auto'){
    const cell = this.subElements.table.querySelector(`[data-day="${this.day}"][data-month="${this.month}"][data-year="${this.year}"]`);
    cell.scrollIntoView({behavior: style, block: "center", inline: "center"});
  }

  bookPropertiesUpdate(td){
    const { carId, dateCell } = cellProperties(td);
    const { rent } = this.findClientById(cellProperties(this.appointment).rentId);
    const date = new Date ( dateCell.dataset.year, parseInt(dateCell.dataset.month) - 1, dateCell.dataset.day )
    
    rent.carId = carId;
    rent.tableDate = date;
  }

  getNextMonth(headings, monthsRow, daysRow, bodyRow){
    const func = nextMonth.bind(this);
    func(headings, monthsRow, daysRow, bodyRow)
  }

  getPreviousMonth(headings, monthsRow, daysRow, bodyRow){
    const func = previousMonth.bind(this);
    func(headings, monthsRow, daysRow, bodyRow)
  }  

  moveAt( appointment, pageX, pageY ) {
    appointment.classList.add('dragging-shadow');
    this.subElements.table.classList.add('unselectable')
    this.appointment.style.position = 'absolute';
    this.appointment.style.left = pageX - this.elem.getBoundingClientRect().left + this.elem.scrollLeft - this.shiftX + 'px';
    this.appointment.style.top = pageY - this.elem.getBoundingClientRect().top + this.elem.scrollTop - this.shiftY + 'px';
    this.subElements.bodyRow.removeEventListener('pointermove', this.searchResizableElement);
  }

  timeline(){     
    const cell = this.subElements.table.querySelector(`[data-day="${this.day}"][data-month="${this.month}"][data-year="${this.year}"]`); //(2)
    const cellInd = cell.cellIndex; 
    const timelineArr = this.subElements.table.rows[1].cells[cellInd].firstElementChild;
    const timelineLine = this.subElements.table.rows[1].cells[cellInd].lastElementChild;
    const { height } = this.subElements.table.getBoundingClientRect();
    timelineArr.classList.add('schedule__timeline-arrow');
    timelineLine.classList.add('schedule__timeline-line');
    timelineLine.style.height = height - 45  + 'px';   
  }

  findRentById(id){
    return this.report.find( element => element.id === id)//ищем по id аренду в массиве report
  }

  findClientById(id){
    for ( const client of this.clients){
     const rent = client.rents.find( element => element.id === id);
     if (rent) return { client, rent }  
    }
  }

  typeOfAppointment(e){
    e.target.style.display = 'none';
    const typeOfAppointment = document.elementFromPoint(e.clientX, e.clientY).dataset.filling;
    e.target.style.display = '';
    return typeOfAppointment
  }

  renderContextMenu (){
    this.contextMenu = new Contextmenu(this.subElements.table);
    this.subElements.bodyRow.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.contextMenu.getTitles(this.td, this.typeOfAppointment(e));
    });
    document.body.append(this.contextMenu.elem);
  }

  remove() {
    this.elem.remove();
    this.contextMenu.elem.remove();
    document.body.removeEventListener('booking-modal', this.initBookingModal)
    document.body.removeEventListener('booking-form', this.getBookingForm)
    document.body.removeEventListener('client-form', this.getClientForm)
    document.removeEventListener('extension-modal', this.initExtensionModal)
    document.body.removeEventListener('extension-specific', this.initExtensionSpecific)
    document.body.removeEventListener('extension-form', this.getExtensionForm)
    document.body.removeEventListener('rentClose-modal', this.initRentCloseModal)
    document.body.removeEventListener('rentClose-form', this.getRentCloseForm)
  }

  destroy() {
    this.remove();
    this.subElements = {};
    this.contextMenu = null;
    this.clientForm = null;
    this.resizerClass = null;
  }
}
