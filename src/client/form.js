export default class ClientForm{
time = new Date();
elem = {};
subElem = {};
counter = 0;

  onSubmit = (event) => {
    event.preventDefault();

    this.dispatch();
    this.close(); //удалить
  }

  close() { //удалить
    document.removeEventListener('keydown', this._keydownEventListener);
    document.body.classList.remove('is-modal-open');
    this.elem.remove();
  } 

  onArrow = side => { 
    const direction = {
      right: -1,
      left: 1
    }
    const { inner, arrowLH, arrowRH } = this.subElem;
    const elemWidth = this.elem.clientWidth
    const { width } = inner.getBoundingClientRect();
    if (side === 'left'){
      const offset = 0;
      arrowLH.style.display = 'none';
      arrowRH.style.display = 'flex';
      inner.style.transform = `translateX(${offset}px)` 
    }

    if (side === 'right'){
      const offset = (( width - elemWidth ) * direction[side]);
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
    const { inner, addBtn } = this.subElem;
    inner.insertBefore(elem, addBtn);

    elem.querySelector('.button-add-tel').onclick = this.onTelBtn
    this.onArrow('right')
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

  constructor(client = {}, rent = {}){
    this.client = client;
    this.rent = rent;

    this.render();
  }

  template(){ //удалить модальное окно!
    return /*html*/`
    <div class="modal"> 
      <div class="modal__overlay"></div>
      <div class="modal__inner">
      <div class="client-form">
        <form data-element="clientForm" class="form-grid">
          <div data-element="arrowRH" class="carousel__arrow carousel__arrow_right">
            <img src="/assets/images/icons/angle-icon.svg" alt="icon">
          </div>
          <div data-element="arrowLH" class="carousel__arrow carousel__arrow_left">
            <img src="/assets/images/icons/angle-left-icon.svg" alt="icon">
          </div>
          <div class="inner" data-element="inner">
            <div>
              <div class="form-allWidth">
                <div class="form-group form-group__half_left">
                  ${this.getClientContact(this.client)}
                  ${this.getPassport(this.client)}
                  ${this.getDriveLicense(this.client)}
                </div>
                <div class="form-group form-group__half_left">
                  <div class="fieldset_row">
                    ${this.getDateTime()}
                  </div>    
                  ${this.getRentalOptions()} 
                  <div data-element="priceHolder"></div>
                </div>
              </div>
              ${this.getDescription()}
              <div class="form-buttons">
                <button type="submit" name="save" class="button-primary-outline">
                    Сохранить
                    ${this.productId 
                    ? 'договор' 
                    : 'изменения'} 
                </button>
                <button type="button" name="print" class="button-primary-outline">
                    Распечатать 
                </button>
              </div>
            </div>
            ${this.getAddDriver()}          
          </div>
        </form>
      </div>
      </div>
      </div>
    `
  }

  getClientContact(client){
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

  getPassport(client){
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

  getDriveLicense(client){
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

  getDateTime(){
    return /*html*/`
    <fieldset>
      <label class="form-label">Дата</label>
      <input required
        id="date"
        value="${this.rent.date.d + '.' + (parseInt(this.rent.date.m) + 1) + '.' + this.rent.date.y}"
        type="text"
        name="date"
        class="form-control"
        placeholder="__.__.__">
    </fieldset>
    <fieldset>
      <label class="form-label">Дни</label>
      <input required
        id="days"
        data-element = "days"
        value="${this.rent.days}"
        type="number"
        name="days"
        class="form-control"
        placeholder="1">
    </fieldset>
    <fieldset>
      <label class="form-label">Время</label>
      <input required
        id="time"
        value="${this.time.getHours()}:${this.time.getMinutes()}"
        type="text"
        name="time"
        class="form-control"
        placeholder="">
    </fieldset>`
  }

  getRentalOptions(){
    return /*html*/`
      <fieldset>
        <span class="form-label">Тариф</span>
        <div class="fieldset_row">
          <label class="radio-label"> 
          <input required
            value="100"
            type="radio"
            name="rate"
            class="form-control">
            100
          </label>
          <label class="radio-label">
            <input required
            value="250"
            type="radio"
            name="rate"
            class="form-control"
            checked>
            250
          </label>
          <label class="radio-label">
            <input required
            value="400"
            type="radio"
            name="rate"
            class="form-control">
            400
          </label>
      </fieldset>
      <fieldset>
          <label class="checkbox-label" ><input required
          id="regionBox"
          type="checkbox"
          data-element="regionBox">
          Выезд за пределы региона 
          </label>
      </fieldset>`
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
      <h1>+</h1>
    </button>`
  }

  getAddDriverTemplate(){
    return /*html*/`
      <div class="form-group form-group__half_left" data-element = "additionalDriver${this.counter}">
        ${this.getClientContact({})}
        ${this.getPassport({})}
        ${this.getDriveLicense({})}
      </div>
    `
  }

  render(){
      const elem = document.createElement('div');
      elem.innerHTML = this.template();
      this.elem = elem.firstElementChild;
      this.subElem = this.getSubElements(this.elem)

      this.initEventListener()
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
    days.addEventListener('change', this.dependingDays); // подсчет стоимости одного дня аренды при изменении кол-ва дней
    
    const rates = this.elem.querySelectorAll('input[name="rate"]');
    for (const rate of rates){
      rate.addEventListener('change', () => this.dependingRate(rates)) // подсчет стоимости одного дня аренды при изменении тарифа
    }

  }

  dispatch(){
    const form = this.elem.querySelector('form');
    const formData = new FormData(form);
    formData.append('id', this.rent.id);
    formData.append('perDay', this.rent.perDay);
    formData.append('total', this.rent.total);
    formData.append('deposit', this.rent.deposit);
    const event = new CustomEvent('client-form', {
      detail: formData,
      bubbles: true
      }) 
    this.elem.dispatchEvent(event)
  }
}

