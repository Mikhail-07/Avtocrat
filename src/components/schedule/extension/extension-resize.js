import cellProperties from "../cellProperties.js";

export default class Resizer{
  
  resizerWidth = 6;

  static instance;
  element

  //ищет ячейку с записью appointment
  searchResizableElement = (event) => { 
    this.serachForResizer(event)
  }

  outResizableElement = () => {
    this.resizer.classList.remove('resizer_dragging');
    this.resizer.style.left = `calc(100%-${this.resizerWidth}px)`;
    this.resizer.style.zIndex = 2;
    this.resizer.removeEventListener('mouseout', this.outResizableElement);
  }

  onPointerDown = (event) => {
    this.clickResizer(event)    
  }

  onPointerMove = (event) => {
    this.moveResizer(event)
  }

  tooltipRentExtensionTemplate (days){
    if (this.td.tagName != 'TD') return
    if (days === 0) return /*html*/`<span class="menu-item">Перемещайте бегунок для продления или возврата аренды</span>`

    const d = this.dateByTd(this.td);
    const monthName = d.toLocaleString('ru', { month: 'long' });
    return /*html*/`<span class="menu-item">${days >= 0 ? 'продление на' : 'возврат за '} ${Math.abs(days)} дней по ${d.getDate()} ${monthName}</span>`
  }

  dateByTd(td) {
    const { dateCell } = cellProperties(td);
    const day = dateCell.dataset.day;
    const month = dateCell.dataset.month;
    const year = dateCell.dataset.year;
    return new Date (year, month, day);
  }

  pointerupOnResizer = () => {
    this.upOnResizer()
  }

  constructor() {
    if (Resizer.instance){
      return Resizer.instance;
    }

    Resizer.instance = this;
  }

  initialize(){
    this.bodyRow.addEventListener('pointermove', this.searchResizableElement);
  }

  serachForResizer(event){
    let resizer

    this.appointment = event.target.closest('.schedule__appointmentCell');
    if (!this.appointment) return
    
    // находит текст который мешает достать до ресайз элемента. 
    this.textWrapper = this.appointment.querySelector('.schedule__textCell-wrapper');
    if (!this.textWrapper) return

    //скрывает текст и ищет resizer
    if (this.textWrapper) this.textWrapper.style.display = 'none';
    const elemBelow = document.elementFromPoint(event.clientX, event.clientY);
    if (elemBelow.querySelector('.line')){
      resizer = elemBelow;
    } else {
      resizer = elemBelow.parentElement;
    }
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
    this.resizer.classList.add('resizer_dragging');
    
    this.resizer.addEventListener('pointerdown', this.onPointerDown);
    this.textWrapper.style.display = '';
    this.resizer.addEventListener('mouseout', this.outResizableElement);
  }

  clickResizer(event){
    this.textWrapper.classList.add('unselectable');
    this.bodyRow.removeEventListener('pointermove', this.searchResizableElement);
    this.x = event.clientX;

    this.appointmentDebtCell = this.appointment.querySelector('[data-filling="debt"]');
    if (this.appointmentDebtCell) this.wDebt = parseInt(this.appointmentDebtCell.style.width);
    

    this.resizer.style.left = this.wPaid - this.resizerWidth + 'px';
    document.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('pointerup', this.pointerupOnResizer, {once: true});
    this.tooltipSwitcher = false;
    const { bottom } = this.td.getBoundingClientRect();
    this.tdBottom = bottom;

    const template = this.tooltipRentExtensionTemplate (0);
    this.createTooltip( event.pageX, this.tdBottom, template )
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

  moveResizer(event){
    // На сколько переместили элемент
    this.dx = event.clientX - this.x;

    // Меняем размеры элемента
    this.appointmentPaidCell.style.width = `${this.wPaid + this.dx}px`;
    if (this.appointmentDebtCell) this.appointmentDebtCell.style.width = `${this.wDebt - this.dx}px`;
    this.resizer.style.left = `${this.wPaid - this.resizerWidth + this.dx}px`;
    
    const days = Math.floor(this.dx/this.cellWidth);

    const template = this.tooltipRentExtensionTemplate (days);

    if(!this.tooltipSwitcher) {
      this.tooltip.classList.add('show');
      this.tooltipSwitcher = true;
    }

    if (this.tooltipSwitcher){
      this.tooltipUpdate(event.pageX, this.tdBottom, template)
    }

    if(!this.resizer.classList.contains('resizer_dragging')) this.resizer.classList.add('resizer_dragging');
  }

  tooltipUpdate( pageX, pageY, template ) {
    this.tooltip.innerHTML = template;
    this.tooltip.style.left = Math.round(pageX) + 'px';
    this.tooltip.style.top = Math.round(pageY) + 'px';
  }

  upOnResizer(){
    const days = Math.floor(this.dx/this.cellWidth);

    //ширина в соответсвии с кол-вом продленных дней
    this.appointmentPaidCell.style.width = `${this.wPaid}px`;
    if (this.appointmentDebtCell) this.appointmentDebtCell.style.width = `${this.wDebt}px`;
    this.resizer.style.left = `${this.wPaid - this.resizerWidth }px`;

    this.textWrapper.classList.remove('unselectable');
    this.resizer.classList.remove('resizer_dragging');
    this.resizer.style.zIndex = 2; 

    this.dx = 0;
    document.removeEventListener('pointermove', this.onPointerMove);
    this.bodyRow.addEventListener('pointermove', this.searchResizableElement);
    this.tooltip.remove();

    if (days > 0) this.extension(days, this.appointmentPaidCell, this.appointmentDebtCell, this.resizer)
  }

  extension (days, appointmentPaidCell, appointmentDebtCell, resizer) {
    document.dispatchEvent(new CustomEvent('extension-modal', {
      detail: {days, appointmentPaidCell, appointmentDebtCell, resizer},
      bubbles: true
    }))
  }
}