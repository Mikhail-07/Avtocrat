//при добавлениее записи в клиентскую базу указывать ее тип
//даты в формате UTC
//добавить период аренды/продление/дату создания записи в КБ

// Облегчить основной файл. onWindowScroll, resizer, createTooltip в синглтон???
// закрытие аренды должно наполняться из уже созданных модулей: продление, риббон меню...
// роутер?  https://learn.javascript.ru/taskbook/js-20230223/workspace/routes-browser-history-api/dashboard-page
//https://www.youtube.com/watch?v=f7nejJv0fzc&ab_channel=webDev

import Contextmenu from './context/index.js';
import ClientForm from '../client/form.js';
import Modal from '../components/modal.js';
import Booking from './booking/index.js';
import Extension from './extension/index.js';
import RentClose from './rent_close/index.js';
import Calculator from '../components/calculator.js';
import services from "../assets/lib/services.js";
import RibbonMenu from "../components/ribbon_menu.js";
import dateHandler from '../assets/lib/date_handler.js';


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
  counter = 0;
  cellWidth = 40; //ширина ячейки
  scheduleCell = {} //ячейка с записью
  resizerWidth = 2

  onWindowScroll = () =>{
    const tableWidth = this.subElements.table.getBoundingClientRect().width;
    const workZone = 100;
    // console.log('right '+ width);
    // console.log('offset '+ window.pageXOffset);

    const{ monthsRow, daysRow, bodyRow } = this.subElements;
    const wrapperWidth = this.elem.getBoundingClientRect().width;
    const dif = tableWidth - wrapperWidth;
    console.log('dif '+ dif);
    const headings = monthsRow.getElementsByTagName('th');
    

    if ( this.elem.scrollLeft > dif - workZone || tableWidth < wrapperWidth ){    
      this.getNextMonth(headings, monthsRow, daysRow, bodyRow);
    }

    if ( this.elem.scrollLeft === 0 ){
      this.getPreviousMonth(headings, monthsRow, daysRow, bodyRow);
    }
  };


  //определяет ячейку таблицы под курсором
  searchCell = (event) => { 
    this.td = this.cellHighlight(event);

    if (this.td.tagName != 'TD') return
    if (this.td === this.currentTd) return

    if (this.td != this.currentTd && this.currentTd){
      const { carCell, dateCell } = this.cellProperties(this.currentTd);
      this.currentTd.classList.remove('chosen-cell');
      carCell.classList.add('sleeper-cell');
      carCell.classList.remove('chosen-cell');
      dateCell.classList.remove('chosen-cell');
    }  

    this.currentTd = this.td;
    const { carCell, dateCell } = this.cellProperties(this.td);
    this.td.classList.add('chosen-cell');
    carCell.classList.remove('sleeper-cell');
    carCell.classList.add('chosen-cell');
    dateCell.classList.add('chosen-cell');
    return this.td
  }
  
  //определяет наличие бегунка продления под курсором
  searchResizableElement = (event) => {
    //ищет ячейку с записью appointment
    this.appointment = event.target.closest('.schedule__appointmentCell');
    if (!this.appointment) return
    

    // находит текст который мешает достать до ресайз элемента. 
    this.textWrapper = this.appointment.querySelector('.schedule__textCell-wrapper');
    if (!this.textWrapper) return
    //скрывает текст
    if (this.textWrapper) this.textWrapper.style.display = 'none';
    const resizer = document.elementFromPoint(event.clientX, event.clientY);
    if (resizer.dataset.resizable  != 'true'){
      this.textWrapper.style.display = '';
      return
    } 

    //выводит resizer на верх
    this.resizer = resizer;
    this.appointmentPaidCell = this.appointment.querySelector('[data-filling="paid"]');
    this.wPaid = parseInt(this.appointmentPaidCell.style.width);
    this.resizer.style.left = this.wPaid - this.resizerWidth + 'px';
    this.resizer.style.zIndex = 5;
    
    this.resizer.addEventListener('pointerdown', this.clickOnResizer);
    this.textWrapper.style.display = '';
    this.resizer.addEventListener('mouseout', this.outResizableElement);
  }

  outResizableElement = () => {
    this.resizer.style.left = `calc(100%-${this.resizerWidth}px)`;
    this.resizer.style.zIndex = 2;
    this.resizer.removeEventListener('mouseout', this.outResizableElement);
  }

  clickOnResizer = (event) => {
    this.textWrapper.classList.add('unselectable');
    this.resizer.classList.add('resizer_dragging');
    this.subElements.bodyRow.removeEventListener('pointermove', this.searchResizableElement);
    this.x = event.clientX;
    this.appointmentDebtCell = this.appointment.querySelector('[data-filling="debt"]');
    this.wDebt = parseInt(this.appointmentDebtCell.style.width);
    this.wResizer = this.resizer.getBoundingClientRect().width;
    this.resizer.style.left = this.wPaid - this.wResizer + 'px';
    document.addEventListener('pointermove', this.moveOnResizer);
    document.addEventListener('pointerup', this.pointerupOnResizer, {once: true});
    this.tooltipSwitcher = false;
    const { bottom } = this.td.getBoundingClientRect();
    this.tdBottom = bottom;

    const template = this.tooltipRentExtensionTemplate (0);
    this.createTooltip( event.pageX, this.tdBottom, template )
    
  }

  moveOnResizer = (event) => {
    // На сколько переместили элемент
    this.dx = event.clientX - this.x;

    // Меняем размеры элемента
    this.appointmentPaidCell.style.width = `${this.wPaid + this.dx}px`;
    this.appointmentDebtCell.style.width = `${this.wDebt - this.dx}px`;
    this.resizer.style.left = `${this.wPaid - this.wResizer + this.dx}px`;
    
    const days = Math.floor(this.dx/this.cellWidth);

    const template = this.tooltipRentExtensionTemplate (days);

    if(!this.tooltipSwitcher) {
      this.tooltip.classList.add('show');
      this.tooltipSwitcher = true;
    }

    if (this.tooltipSwitcher){
      this.tooltipUpdate(event.pageX, this.tdBottom, template)
    }
  }

  tooltipRentExtensionTemplate (days){
    if (this.td.tagName != 'TD') return
    if (days === 0) return /*html*/`<span class="menu-item">Перемещайте бегунок для продления или возврата аренды</span>`

    const d = this.dateByTd(this.td);
    const monthName = d.toLocaleString('ru', { month: 'long' });
    return /*html*/`<span class="menu-item">${days >= 0 ? 'продление на' : 'возврат за '} ${Math.abs(days)} дней по ${d.getDate()} ${monthName}</span>`
  }

  pointerupOnResizer = () => {
    const days = Math.floor(this.dx/this.cellWidth);

    //ширина в соответсвии с кол-вом продленных дней
    this.appointmentPaidCell.style.width = `${this.wPaid}px`;
    this.appointmentDebtCell.style.width = `${this.wDebt}px`;
    this.resizer.style.left = `${this.wPaid - this.wResizer }px`;

    this.textWrapper.classList.remove('unselectable');
    this.resizer.classList.remove('resizer_dragging');
    this.resizer.style.zIndex = 2; 

    this.dx = 0;
    document.removeEventListener('pointermove', this.moveOnResizer);
    this.subElements.bodyRow.addEventListener('pointermove', this.searchResizableElement);
    this.tooltip.remove();

    if (days > 0) this.extension(days)
  }

  extension (days) {
    const event = this.elem.dispatchEvent(new CustomEvent('extension-modal', {
      detail: days,
      bubbles: true
    }))
    console.log(event);
  }


  clickOnTable = (event) => {
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
    this.moveAt( event.pageX, event.pageY );
  }

  pointerupOnCell = (event) => {
    this.appointment.classList.remove('dragging-shadow');
    this.subElements.table.classList.remove('unselectable')
    document.removeEventListener('pointermove', this.moveOnCell);

    this.appointment.style.display = 'none';
    const elemBelow = document.elementFromPoint(event.clientX, event.clientY);
    this.appointment.style.display = '';
    elemBelow.append(this.appointment);
    this.appointment.style.position = 'relative';
    this.appointment.style.left = 0 + 'px';
    this.appointment.style.top = 0 + 'px';
    this.subElements.bodyRow.addEventListener('pointermove', this.searchResizableElement);
  }

  constructor(cars = [], clients = [], report = []){
    this.cars = cars;
    this.clients = clients;
    this.report = report;

    this.render();
  }

  moveAt( pageX, pageY ) {
    this.appointment.classList.add('dragging-shadow');
    this.subElements.table.classList.add('unselectable')
    this.appointment.style.position = 'absolute';
    this.appointment.style.left = pageX - this.elem.getBoundingClientRect().left + this.elem.scrollLeft - this.shiftX + 'px';
    this.appointment.style.top = pageY - this.elem.getBoundingClientRect().top + this.elem.scrollTop - this.shiftY + 'px';
    this.subElements.bodyRow.removeEventListener('pointermove', this.searchResizableElement);
  }

  createTooltip( pageX, pageY, template ) {
    const div = document.createElement('div');
    div.innerHTML = template;
    div.style.position = 'absolute';
    div.style.left = Math.round(pageX) + 'px';
    div.style.top = Math.round(pageY) + 'px';
    div.classList.add('menu');
    document.body.append(div);
    
    this.tooltip = div;
  }

  tooltipUpdate( pageX, pageY, template ) {
    this.tooltip.innerHTML = template;
    this.tooltip.style.left = Math.round(pageX) + 'px';
    this.tooltip.style.top = Math.round(pageY) + 'px';
  }

  template(){
    return /*html*/`
    <div class="schedule-wrapper">
      <div id="out-click"></div>
      <table data-element = "table">
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
    const d = new Date (year, parseInt(month) - 1 );
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
    const d = new Date (year, month);
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
      const rentReport = this.findRentById(rent.id)//ищем по id аренду в массиве report
      const from = new Date (rentReport.date); //начало аренды
      const to = new Date (from.getFullYear(), from.getMonth(), from.getDate() + rentReport.days); // конец аренды
      const eventfromDate = new Date (eventYear, parseInt(eventMonth) - 1); //месяц который отрисовываем
      const eventtoDate = new Date (eventYear, parseInt(eventMonth)); // 
      let debt = Math.floor(((this.date - to)/3600000)/24);
      if (debt > 0){
        console.log(`${client.name} is debtor. Debt amount: ${debt}`)      
      };

      if (debt > this.days || debt > 0 && this.month > eventMonth ){ // 
        debt = this.debtAdjust( eventMonth, to, eventfromDate, eventtoDate )
      }; 

      //CASEs

      //CASE 1 случай, при котором аренда начинается и кончается в текущем месяце
      if ( from > eventfromDate && to < eventtoDate){ 
        const appointment = this.putClientOnMap(client, rentReport); //вызываем метод наносящий аренду на график
        this.scheduleCell.append(appointment)
        if ( rent.status === 'open' && debt >= 0) { // debt < this.days - на случай, если это аренда с долгом из CASE 4
          this.debtor( debt, appointment, client.name ) 
        }
        this.textСropping(appointment)
      }

      //CASE 2 случай "переходящей" аренды с прошлого месяца на нынешний
      if ( from < eventfromDate && to > eventfromDate ){
        const borderRent = {};
        const restOfDays = ((to - eventfromDate)/3600000/24) + 1; //кол-во дней в текущем месяце
        restOfDays > this.days ? borderRent.days = this.days : borderRent.days = restOfDays; // если кол-во ячеек больше, чем остаток дней в месяце, то закрашиваем клетки на максимальное кол-во дней в месяце
        borderRent.d = 1 //наношу аренду с первой ячейки, так как договор заключен в прошлом месяце
        borderRent.m = eventMonth;
        const appointment = this.putClientOnMap(client, rentReport, borderRent);

        const previousMonth = this.subElements.table.rows[0].querySelector(`[data-list-id="${eventMonth - 1}.${this.year}"]`)//проверка сущетсвет, ли прошлый месяц, если нет, то отрисовывем в нем аренду
        if( parseInt(eventMonth) - 1 <= to.getMonth() && !previousMonth ){ //Не переносилась аренда на ИЮНЬ. добавил =
          this.scheduleCell.append(appointment);
        }
        if (this.month >= eventMonth){ //дополняет дни долга, если событийный месяц (eventMonth) идет до нынешнего месяца 
          this.debtor( debt, appointment, client.name )
        }
      }

      //CASE 3 случай "переходящей" аренды с нынешнего месяца на следущий
      if ( from > eventfromDate && to > eventtoDate && to > eventfromDate && from > eventfromDate && from < eventtoDate){
        const borderRent = {};
        const restOfDays = Math.ceil((eventtoDate - from)/3600000/24) - 1; //считаю сколько ячеек нужно закрыть от начала до конца
        borderRent.days = restOfDays;
        const appointment = this.putClientOnMap(client, rentReport, borderRent); 
        this.scheduleCell.append(appointment);
      }

      //CASE 4 случай "переходящей" аренды с прошлого месяца на нынешний с долгом
      if ( from < eventfromDate && to < eventfromDate  && rent.status === 'open' && eventfromDate < this.date){ 
        const borderRent = {};
        borderRent.d = 1;
        borderRent.m = eventMonth;
        borderRent.days = debt;
        borderRent.type = 'debt';

        const appointment = this.putClientOnMap(client, rentReport, borderRent);  

        if( eventMonth <= this.month ){
          this.scheduleCell.append(appointment)
        }
      } 
    } 
  }  

  textСropping(appointment) {
    const appointmentWidth = appointment.getBoundingClientRect().width;
    const textContentWidth = appointment.querySelector('span').getBoundingClientRect().width;
    if (textContentWidth > appointmentWidth) appointment.querySelector('span').style.width = appointmentWidth -5 + 'px';
  }

  debtAdjust( eventMonth, to, eventfromDate, eventtoDate ){ 
    let debtThisMonth //корректирует кол-во дней долга. Если эти дни превышают кол-во дней в месяце, то долг принимается за дни в месяце.
    
    if ( this.month === eventMonth ){
      debtThisMonth = Math.ceil(((this.date - eventfromDate)/3600000)/24);
    }
    
    if ( this.month > eventMonth ){
      debtThisMonth = Math.ceil((((eventtoDate - to)/3600000)/24) - 1);
      debtThisMonth = debtThisMonth > this.days 
        ? this.days 
        : debtThisMonth;
    }

    return debtThisMonth; 
  }

  

  putClientOnMap(client, rent, borderRent = {}) {
    const { name, tel } = client;
    const { status, car, id } = rent;
    const date = new Date(rent.date)
    const dateAdjusted = new Date (date.getFullYear(), date.getMonth(), date.getDate()+1);
    const days = borderRent.days ? borderRent.days : rent.days /*Можно оптимизировать циклом*/
    borderRent.d ? dateAdjusted.setDate(borderRent.d) : '';
    borderRent.m ? dateAdjusted.setMonth(parseInt(borderRent.m) - 1) : '';
    const filling = borderRent.type ? borderRent.type : 'paid';

    //поиск ячейки клиента, по машине (1) и дню (2)
    const row = this.subElements.table.querySelector(`[data-car-id='${car}']`).closest('tr'); //(1)
    
    let appointment = {};
    let div = {};
    let i = 0; //если запись уже существует, то мы увеличиваем ее длину на полное количество дней

    const rowInd = row.rowIndex;
    const cell = this.subElements.table.querySelector(`[data-day="${dateAdjusted.getDate()}"][data-month="${dateAdjusted.getMonth() + 1}"][data-year="${dateAdjusted.getFullYear()}"]`); //(2)
    const cellInd = cell.cellIndex;
    this.scheduleCell = this.subElements.table.rows[rowInd].cells[cellInd]; //ячейка клиента
    const { width } = this.scheduleCell.getBoundingClientRect();
    this.width = width;
    
    appointment = row.querySelector(`[data-id="${id}"]`);
    if(!appointment){
      appointment = this.createAppointment(id, name, tel, filling, status);
      i = 1; //i=1, так как первая ячейка уже создана и ее учитывать в итерации нет необходиомсти
    }  

    div = appointment.querySelector(`[data-filling="${filling}"]`); //div debt или paid из appointment
    if(!div){
      div = this.createFillingCell(filling);
      appointment.prepend(div);  
      i = 1;
    }

    //присваивание цвета дням аренды
    let defaultWidth = parseInt(div.style.width);
    const update = (delta) => div.style.width = `${defaultWidth += delta}px`;
    for ( i; i < days; i++){
      update(width);
    }

    this.resizerUpdate(appointment); 

    return appointment
  }

  resizerUpdate(appointment){
    const paid = appointment.querySelector(`[data-filling="paid"]`);
    const resizer = appointment.querySelector('.resizer');
    if (!paid || !resizer) return
    
    const { width } = paid.getBoundingClientRect();
    resizer.style.left = width + 'px';
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
      appointment.append(debtDiv);
      i = 1;
    }

    let defaultWidth = parseInt(debtDiv.style.width);
    for ( i; i < debt; i++ ){
      debtDiv.style.width = `${defaultWidth += this.width}px`;
    } 

    const resizer = appointment.querySelector('.resizer');
    if ( !resizer && debt > 0 ){
      const resizer = document.createElement('div');
      resizer.classList.add('resizer', 'resizer-r');
      resizer.dataset.resizable  = 'true';
      appointment.append(resizer);
      this.resizerUpdate(appointment);
    }
  }
  
  createAppointment(id, name, tel, filling, status){
    //наполняем созданную запись (appointment)
    const appointment = document.createElement('div');
    appointment.classList.add('schedule__appointmentCell');
    appointment.dataset.id = id;
    
    // помещаем в appointment div который дальше будет отображать тип заполнения paid или debt
    const div = this.createFillingCell(filling, status)
    appointment.append(div);
    
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

    this.renderBookingModal();
    this.getBookingForm();

    this.renderClientForm();
    this.getClientForm();

    this.renderExtensionModal();
    this.getExtensionForm();

    this.renderRentCloseModal();


    this.initEventListener();
  }

  
  initEventListener(){
    const { today, bodyRow, table } = this.subElements;
    today.onclick = () => this.today('smooth');
    table.addEventListener('pointerdown', this.clickOnTable);

    bodyRow.addEventListener('pointermove', this.searchResizableElement);
    bodyRow.addEventListener('pointermove', this.searchCell);
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
  
  renderBookingModal(){ //открывает модальное окно с бронированием и предает в него автомобиль, который был выбран для брнирования  
    document.body.addEventListener('booking-modal', () => {    
      const { carId, dateCell} = this.cellProperties(this.td);
      const bookDate = `${dateCell.dataset.year}-${("0" + dateCell.dataset.month).slice(-2)}-${dateCell.dataset.day}`

      const modalBody = new Booking(carId, bookDate);
      const modal = new Modal('booking', 'Запись клиента', modalBody.elem);
      modal.open()

      const rent = {} //объект rent с дефолтными значениями days, rate и номер машины на которую планируют поставить бронь
      rent.car = carId;
      rent.days = 1;
      rent.rate = '100';

      const calculator = new Calculator (rent);
      modal.subElem.priceHolder.append(calculator.elem)
    })
  } 

  informationSeporator(form){
    const formatToNumber = ['days', 'perDay', 'total', 'deposit']; // список объектов которые будут преобразованы в числа
    const personalInformation = ['name', 'tel', 'series', 'nom', 'issued', 'issuedDate', 'registration', 'license', 'description'];
    
    const client = {};
    const rent = {};
    for (const [key, value] of Object.entries(form)){
      const parsedValue = formatToNumber.includes(key)
        ? parseInt(value)
        : value;
      personalInformation.includes(key)
        ? client[key] = parsedValue
        : rent[key] = parsedValue
    };

    rent.name = form.name;

    return {client, rent}
  }

  getBookingForm(){ //получает данные о бронировании и отмечает в нужной ячейке
    document.body.addEventListener('booking-form', ({ detail: bookingForm }) => {

      const formDataObject = Object.fromEntries(bookingForm.entries()) //данные из bookingForm в формате ключ-значение
      formDataObject.date = new Date (formDataObject.date);
      const { d, m } = dateHandler(formDataObject.date.getDate(), formDataObject.date.getMonth(), formDataObject.date.getYear())
      const { client, rent } = this.informationSeporator(formDataObject);

      this.counter++ // кол-во догоров за сегодня
      const id = this.counter + '-' + this.year + this.day + this.year // id договора

      const obj = {
        id: id,
        status: 'booked'
      }

      client.rents = []

      client.rents.push(obj);
      rent.id = id;
      
      this.clients.push(client);
      this.report.push(rent);

      const appointmentDiv = document.createElement('div');
      appointmentDiv.classList.add('schedule__appointmentCell');
      appointmentDiv.innerHTML = /*html*/`
      
      <div class="schedule__fillingCell" data-filling="book">
        <div class="schedule__textCell-wrapper">
          <span class="schedule__textCell-content">${d}.${m}, ${rent.time}, ${formDataObject.name}, тел: +7 ${formDataObject.tel}, ${formDataObject.days} дня, ${formDataObject.rate} км.</span>
        </div>
        <div class="schedule__fillingCell-sole"></div>
      </div>`
      appointmentDiv.dataset.id = id;
      appointmentDiv.style.width = this.cellWidth + 'px';      

      this.td.append(appointmentDiv)
    });
  }

  renderClientForm(){ //создает карту клиента
    document.body.addEventListener('client-card', () => {
      const { rentId } = this.cellProperties(this.appointment);
      const rent = this.findRentById(rentId);
      const client = this.findClientById(rentId);
      
      this.clientForm = new ClientForm(client, rent);
      document.body.append(this.clientForm.elem); 
    }) 
  }

  getClientForm(){ //получает данные из карты клиента   
    document.body.addEventListener('client-form', ({ detail: clientForm }) => {
      console.log(this.clients)
      const formToObject = Object.fromEntries(clientForm.entries()); // преобразуем clientForm в объект
      formToObject.date = this.dateToObj(formToObject.date, formToObject.time) // преобразует дату и время под клиентскую БД
      delete formToObject.time // удаляем теперь не актуальное время
      formToObject.status = 'open'; // изменение статуса аренды с booked на open      
    })
  }

  renderExtensionModal(){
    document.body.addEventListener('extension-modal', ({ detail: days }) => {
      const { rentId, carId } = this.cellProperties(this.appointment);
      const rent = this.findRentById( rentId );

      const obj = {} //объект rent с дефолтными значениями days, rate и номер машины на которую планируют поставить бронь
      obj.name = rent.name;
      obj.days = rent.days;
      obj.car = carId;
      obj.rate = rent.rate;
      obj.date = rent.date;

      if (rent.extansion){
        let extansionDaysTotal = 0

        for ( const extension of rent.extansion){
          extansionDaysTotal += extension.days
        }

        obj.days += extansionDaysTotal 
      }

      const modalBody = new Extension(obj, days);
      const modal = new Modal('extension', 'Продление аренды', modalBody.elem);
      modal.open()

      obj.days = rent.days + days - 1 // перезаписываю дни для правильной работы калькулятора
      const calculator = new Calculator (obj);
      modal.subElem.priceHolder.append(calculator.elem)
    })
  }

  getExtensionForm(){ //получает данные из карты клиента   
    document.body.addEventListener('extension-form', ({ detail: extensionForm }) => {
      const formToObject = Object.fromEntries(extensionForm.entries()); // преобразуем extensionForm в объект
      
      formToObject.to = this.dateToObj(formToObject.to) // преобразует дату и время под клиентскую БД
      const dateTo = new Date ( formToObject.to.y, formToObject.to.m, formToObject.to.d );

      const formatToNumber = ['days', 'perDay' ]; // список объектов которые будут преобразованы в числа
      const { rentId } = this.cellProperties(this.appointment);
      const [сlientIndx, rentIndx] = this.indxRentById(rentId); //индекс клиента и индекс аренды в базе клиентов
      const rent = this.clients[сlientIndx].rents[rentIndx]
      if (!rent.extansion) rent.extansion = [];
      const extansion = {}
      for (const [key, value] of Object.entries(formToObject)){
        extansion[key] = formatToNumber.includes(key)
          ? parseInt(value)
          : value;
      }

      const debt = Math.floor(((this.date - dateTo)/3600000)/24);
      if (debt <= 0){// изменение статуса аренды с debt на open
        rent.status = 'open';
        this.appointmentDebtCell.style.width = 0 + 'px';
      };
      rent.extansion.push(extansion);
      const days = parseInt(formToObject.days);
      this.appointmentPaidCell.style.width = `${this.wPaid + (this.cellWidth * days)}px`;
      this.appointmentDebtCell.style.width = `${this.wDebt - (this.cellWidth * days)}px`;
      this.resizer.style.left = `${this.wPaid + (this.cellWidth * days) - this.resizerWidth}px`;
    })
  }

  renderRentCloseModal(){
    document.body.addEventListener('rentClose-modal', () => {    
      const { rentId, carId } = this.cellProperties(this.appointment);
      const rent = this.findRentById(rentId);
      const client = this.findClientById(rentId);

      const date = new Date(rent.date)
      const dateTo = new Date (date.getFullYear(), date.getMonth(), date.getDate() + rent.days);
      const tdDate = this.dateByTd(this.td); //дата ячейки
      const days = (((tdDate - dateTo)/3600000)/24);

      const obj = {} //объект rent с дефолтными значениями days, rate и номер машины на которую планируют поставить бронь
      obj.name = client.name;
      obj.days = rent.days;
      obj.car = carId;
      obj.rate = rent.rate;
      obj.date = rent.date;


      const modalBody = new RentClose( obj, days );
      const modal = new Modal('rentClose', 'Закрытие аренды', modalBody.elem);
      modal.open();

      obj.days = rent.days + days - 1 // перезаписываю дни для правильной работы калькулятора
      const calculator = new Calculator (obj);
      modal.subElem.priceHolder.append(calculator.elem);

      const ribbonMenu = new RibbonMenu (services);
      modal.subElem.ribbonHolder.append(ribbonMenu.elem);

      let amount
      const total = document.createElement('div');
      total.innerHTML =/*html*/`
      <div class="form-space-between">
        <span class="form-label">К оплате</span>
        <span></span>
      </div>`
      
      modal.subElem.services.after(total);
    })
  }

  cellProperties(scheduleCell){
    const obj = {};

    const rentId = scheduleCell.dataset.id
    const carRow = scheduleCell.closest('tr'); //строка по которой был клик
    const carCell = carRow.firstElementChild; //ячейка машины по строке которой был клик
    const carId = carCell.dataset.carId; // id машины
    const dateCell = this.subElements.table.rows[1].cells[scheduleCell.cellIndex]; //ячейка с датой на которую создают бронь
    
    obj.rentId = rentId;
    obj.carRow = carRow;
    obj.carCell = carCell;
    obj.dateCell = dateCell;
    obj.carId = carId;
    
    return obj
  }

  dateByTd(td) {
    const { dateCell } = this.cellProperties(td);
    const day = dateCell.dataset.day;
    const month = dateCell.dataset.month;
    const year = dateCell.dataset.year;
    return new Date (year, month, day);
  }
  
  today(style = 'auto'){
    const cell = this.subElements.table.querySelector(`[data-day="${this.day}"][data-month="${this.month}"][data-year="${this.year}"]`);
    cell.scrollIntoView({behavior: style, block: "center", inline: "center"});
  }

  getNextMonth(headings, monthsRow, daysRow, bodyRow){
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
    for (const client of this.clients){ //поочередно берем клиента из базы 
      this.getClientsList(client, month, year)
    }
  }

  getPreviousMonth(headings, monthsRow, daysRow, bodyRow){
    let [ month, year] = headings[0].dataset.listId.split('.');
    month = parseInt(month)
    month--

    //кол-во дней в месяце
    const daysAmount = this.daysAmount(year, month-1)

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

  timeline(){     
    const cell = this.subElements.table.querySelector(`[data-day="${this.day}"][data-month="${this.month}"][data-year="${this.year}"]`); //(2)
    const cellInd = cell.cellIndex; 
    const timelineArr = this.subElements.table.rows[1].cells[cellInd].firstElementChild;
    const timelineLine = this.subElements.table.rows[1].cells[cellInd].lastElementChild;
    const { height } = this.subElements.table.getBoundingClientRect();
    timelineArr.classList.add('schedule__timeline-arrow');
    timelineLine.classList.add('schedule__timeline-line');
    timelineLine.style.height = height - 40  + 'px';   
  }

  

  findRentById(id){
    return this.report.find( element => element.id === id)//ищем по id аренду в массиве report
  }

  findClientById(id){
    for ( const client of this.clients){
     const result = client.rents.find( element => element.id === id);
     if (result) return client  
    }
    
  }

  indxRentById(id){
    for (const client of this.clients){
      const { rents } = client;
      for (let i = 0; i < rents.length; i++){
        if (rents[i].id === id){
          return [this.clients.indexOf(client), i] //индекс клиента в массиве объектов и индекс аренды
        }
      }
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
}
