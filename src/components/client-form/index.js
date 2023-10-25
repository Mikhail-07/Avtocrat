import report from "../../data/report-data.js";
import clients from "../../data/clients.js";
import Extension from "../schedule/extension/index.js"
import Calculator from "../calculator/index.js";


export default class ClientForm{
time = new Date();
elem = {};
subElem = {};
counter = 0;
wrapperWidth
report = report;
clients = clients;

  onSubmit = (event) => {
    event.preventDefault();

    this.dispatch();
  }

  onArrow = side => { 
    const direction = {
      right: -1,
      left: 1
    }
    const { inner, arrowLH, arrowRH } = this.subElem;
    const innerWidth = inner.clientWidth
    if (side === 'left'){
      const offset = 0;
      arrowLH.style.display = 'none';
      arrowRH.style.display = 'flex';
      inner.style.transform = `translateX(${offset}px)` 
    }

    if (side === 'right'){
      const offset = (( innerWidth - this.wrapperWidth ) * direction[side]);
      arrowLH.style.display = 'flex';
      arrowRH.style.display = 'none';
      inner.style.transform = `translateX(${offset}px)`
    }
  }

  onAdd = () => {
    this.counter++
    const addDriver = document.createElement('div');
    addDriver.innerHTML = this.getAddDriverTemplate();
    const elem = addDriver.firstElementChild
    const { inner, drivers, addBtn } = this.subElem;
    drivers.append(elem);
    addBtn.before(elem);

    elem.querySelector('.button-add-tel').onclick = this.onTelBtn;

    const innerWidth = inner.getBoundingClientRect().width;
    if (!this.wrapperWidth) this.wrapperWidth = this.elem.getBoundingClientRect().width;
    if ( innerWidth > this.wrapperWidth) this.onArrow('right')
  }

  onRegionCheckbox = (event) => {
    if (event.target.checked === true){
      const region = document.createElement('fieldset');
      region.innerHTML = /*html*/`
        <input required
        id="region"
        type="text"
        name="region"
        class="form-control"
        data-element="region"
        placeholder="Введите регион">` 
      const fieldset = event.target.closest('fieldset');
      fieldset.append(region);
    } else {
      event.target.closest('fieldset').lastChild.remove()
    }
  }

  onTelBtn = (event) => {
    const tel = document.createElement('input');
    tel.type = 'text';
    tel.name = 'tel';
    tel.classList.add('form-control');
    tel.dataset.element = 'tel';
    const fieldset = event.target.closest('fieldset');
    fieldset.append(tel);
  }

  constructor(client, rent){
    this.client = client;
    this.rent = rent;
    this.render();
  }

  template(){
    return /*html*/`
    <div class="client-form">
    <form data-element="clientForm" class="form-grid">
      <div data-element="arrowRH" class="carousel__arrow carousel__arrow_right">
        <img src="../../assets/images/icons/angle-icon.svg" alt="icon">
      </div>
      <div data-element="arrowLH" class="carousel__arrow carousel__arrow_left">
        <img src="../../assets/images/icons/angle-left-icon.svg" alt="icon">
      </div>
      <div class="inner" data-element="inner">
        <div class="content-box" data-element="drivers">
          <div class="form-allWidth">
            <div class="form-group form-group__half_left">
              ${this.getClientContact(this.client)}
              ${this.getPassport(this.client)}
              ${this.getDriveLicense(this.client)}
              ${this.getDescription()}
            </div>
            <div class="form-group form-group__half_left">
            <div data-element="extensionHolder"></div>    
              ${this.getRentalOptions()} 
              <div data-element="calculatorHolder"></div>
            </div>
          </div>
          
          <div class="form-buttons">
            <button type="submit" name="save" class="button-primary-outline">
                Добавить аренду 
            </button>
            <!-- <button type="button" name="print" class="button-primary-outline">
                Распечатать
            </button> -->
          </div>
        </div>
        ${this.getAddDriver()}          
      </div>
    </form>
    </div>`
  }

  getClientContact(client = {}){
    return /*html*/`
      <fieldset>
        <label class="form-label"> Имя клиента </label>
        <input required
          id="title"
          value="${client.name ? client.name : ''}"
          type="text"
          name="name"
          class="form-control"
          data-element="name"
          placeholder="ФИО">
      </fieldset>
      <fieldset class = 'tel'>
        <label class="form-label"> Номер телефона </label>
        <input required
          id="tel"
          value="${client.tel ? client.tel : ''}"
          type="text"
          name="tel"
          class="form-control "
          data-element="tel"
          placeholder="Номер">
        <button type="button" class="button-add-tel" data-element="addTel">+</button>
      </fieldset>`
  }

  getPassport(client = {}){
    return /*html*/`
      <fieldset>
      <label class="form-label">Паспорт</label>
        <input required
          id="series"
          value="${client.series ? client.series : ''}"
          type="text"
          name="series"
          class="form-control"
          data-element="series"
          placeholder="cерия">
        <input required
          id="nom"
          value="${client.nom ? client.nom : ''}"
          type="text"
          name="nom"
          class="form-control"
          data-element="nom"
          placeholder="номер">
        <input required
          id="issued"
          value="${client.issued ? client.issued : ''}"
          type="text"
          name="issued"
          class="form-control"
          data-element="issued"
          placeholder="Выдан">
        <input required
          id="issuedDate"
          value="${client.issuedDate ? client.issuedDate : ''}"
          type="text"
          name="issuedDate"
          class="form-control"
          data-element="issuedDate"
          placeholder="Дата выдачи">
      </fieldset>
      <fieldset>
          <label class="form-label"> Прописка </label>
          <input required
            id="registration"
            value="${client.registration ? client.registration : ''}"
            type="text"
            name="registration"
            class="form-control"
            data-element="registration"
            placeholder="Адрес">
      </fieldset>`
  }

  getDriveLicense(client = {}){
    return /*html*/`
      <fieldset>
          <label class="form-label"> Водительское удостоверение </label>
          <input required
          id="license"
          value="${client.license ? client.license : ''}"
          type="text"
          name="license"
          class="form-control"
          data-element="license"
          placeholder="Номер">
      </fieldset>`
  }

  getRentalOptions(){
    return /*html*/`
      <fieldset>
          <label class="checkbox-label" ><input required
          id="regionBox"
          type="checkbox"
          data-element="regionBox">
          Выезд за пределы региона 
          </label>
      </fieldset>`
  }

  getRates() {
    const arr = ['100', '250', '400'];
    return arr.map(item =>{
      return /*html*/`
      <label class="radio-label"> 
          <input required
            value="${item}"
            type="radio"
            name="rate"
            class="form-control"
            ${'250' === item ? "checked" : ''}>
          ${item} </label>`
    }).join('');
  }

  getDescription(){
    return /*html*/`
    <div class="form-group form-group__wide">
      <label class="form-label">Особые отметки</label>
      <input
        id="description"
        class="form-control"
        name="description"
        placeholder="">
    </div>`
  }

  getAddDriver(){
    return /*html*/`
    <button type="button" data-element="addBtn" class="button-option-outline">
      <span class="button-stroke">+</span>
    </button>`
  }

  getAddDriverTemplate(){
    return /*html*/`
      <div class="form-group form-group__half_left content-box" data-element = "additionalDriver${this.counter}">
        ${this.getClientContact()}
        ${this.getPassport()}
        ${this.getDriveLicense()}
      </div>`
  }

  render(){
    const elem = document.createElement('div');
    elem.innerHTML = this.template();
    this.elem = elem.firstElementChild;
    this.subElem = this.getSubElements(this.elem);
    this.initExtension();
    this.initCalculator();

    this.initEventListener();
  }

  getSubElements(element) {
    const subElements = {};
    const elements = element.querySelectorAll('[data-element]');

    for (const item of elements) {
        subElements[item.dataset.element] = item;
    }

    return subElements;
  }

  initEventListener(){
    const { clientForm, addBtn, arrowLH, arrowRH, regionBox, addTel, days } = this.subElem;
    clientForm.addEventListener('submit', this.onSubmit); //отправка формы
    arrowLH.addEventListener('pointerdown', () => this.onArrow ('left')); // стрелка в лево
    arrowRH.addEventListener('pointerdown', () => this.onArrow ('right')); // стрелка в право
    addBtn.onclick = this.onAdd; // доп водитель
    regionBox.onclick = this.onRegionCheckbox; // выезд из региона
    addTel.onclick = this.onTelBtn; // дополнительный телефон
  }

  initExtension(){
    this.extension = new Extension (this.rent, this.rent.days);
    this.subElem.extensionHolder.append(this.extension.elem)
  }

  initCalculator(){   
    const calculator = new Calculator (this.rent, this.extension.elem);
    this.subElem.calculatorHolder.append(calculator.elem)
  }

  dispatch(){
    const form = this.elem.querySelector('form');
    const formData = new FormData(form);
    formData.append('id', this.rent.id);
    formData.append('carId', this.rent.carId);
    formData.append('perDay', this.rent.perDay);
    formData.append('total', this.rent.total);
    formData.append('deposit', this.rent.deposit);
    formData.append('type', 'аренда')
    const event = new CustomEvent('client-form', {
      detail: formData,
      bubbles: true
      }) 
    this.elem.dispatchEvent(event)
  }

  remove() {
    this.elem.remove();
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }
}

