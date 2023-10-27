import report from "../../data/report-data.js";
import clients from "../../data/clients.js";


export default class CarForm{
time = new Date();
elem = {};
subElem = {};
counter = 0;
wrapperWidth
report = report;
clients = clients;

  onSubmit = (event) => {
    event.preventDefault();
  
    const form = event.target.closest('form')
    this.dispatch(form);
  }

  onAdd = () => {
    const checkUpForm = document.createElement('div');
    checkUpForm.innerHTML = this.getCheckUpForm(this.car);
    const elem = checkUpForm.firstElementChild
    this.subElem.addBtn.remove();
    this.subElem.maintenance.append(elem);
    elem.addEventListener('submit', this.onSubmit);
    
    const button = elem.querySelector('button');
    button.onclick = () => {
      elem.innerHTML = `
      <div class="content-box form-group">
        Данные успешно обновлены!
      </div>`
    }
  }

  constructor(car){
    this.car = car;

    this.render();
  }

  template(){
    return /*html*/`
    <div class="client-form">
      <form data-element="carForm">
        <div class="inner" data-element="inner">
          <div class="content-box">
            <div class="form-allWidth">
              <div class="form-group form-group__half_left">
                ${this.getCarInf(this.car)}
              </div>
            </div>
            
            ${this.getSaveButton()}

          </div>   
        </div>
      </form>
      <div data-element="maintenance" class="maintenance"> 
        <div class="content-box form-group form-group__half_left">
          ${this.getCarService(this.car)}
        </div>
        ${this.getAddDriver()}
      </div>    
    </div>`
  }

  getCarInf(car = {}){
    const carInformation = [
      {
        name: 'plate',
        label: 'Гос номер',
        placeholder: 'e 777 кх 178'
      },
      {
        name: 'brand',
        label: 'Марка автомобиля',
        placeholder: 'Polo'
      },
      {
        name: 'bodyNum',
        label: 'Номер кузова',
        placeholder: 'Номер'
      },
      {
        name: 'insuranceNum',
        label: 'Номер СТС',
        placeholder: 'Номер'
      },
      {
        name: 'insuranceDate',
        label: 'Страховка действительна до',
        placeholder: 'Дата'
      }
    ]
    return carInformation.map(item => {
      return /*html*/`
      <fieldset class="fieldset">
        <label class="form-label"> ${item.label} </label>
        <input required
          id="plate"
          value="${car[item.name] ? car[item.name] : ''}"
          type="${item.name === 'insuranceDate' ? 'date' : 'text'}"
          name="plate"
          class="form-control"
          data-element="plate"
          placeholder="${item.placeholder}">
      </fieldset>`
    }).join('')
  }

  getCarService(car = {}){
    const services = [['mileage', 'Текущий пробег'], ['lastCheckUp', 'Последнее ТО'], ['nextCheckUp', 'Следущее ТО'], ['belt', 'ГРМ'], ['oil', 'Масло в КП'], ['wheelAlignment', 'Развал схождения']]
    return services.map(service => {
      return /*html*/`
      <div class="form-space-between form-services">
        <span class="price-label">${service[1]}</span>
        <span id="deposit">${car[service[0]]} км</span>
      </div>`
    }).join('')
  }


  getAddDriver(){
    return /*html*/`
    <button type="button" data-element="addBtn" class="button-option-outline">
      <img src="../../assets/images/icons/checkUp-icon.svg" alt="checkUp-icon" class="icon-gear"/>
    </button>`
  }

  getCheckUpForm(car){
    return /*html*/`
    <form data-element="checkUpForm" class="">
      <div class="content-box">
        ${this.getMileageTemplate(car)}
        <fieldset>
          <span class="form-label">Состав ТО:</span>
          ${this.getListOfWorks(car)}
        </fieldset>
        ${this.getSaveButton()}
      </div>
    </form>`
  }

  getMileageTemplate(car){
    const checkUpStep = 10000;
    return /*html*/`
    <fieldset>
      <label class="form-label">Следущее ТО</label>
      <input required
        value="${car.mileage ? car.mileage + checkUpStep : ''}"
        type="number"
        name="mileage"
        class="form-control"
        data-element="plate">
    </fieldset>`
  }

  getListOfWorks(){
    const works = [['belt', 'Замена ремня ГРМ'], ['oil', 'Замена масла в КП'], ['wheelAlignment', 'Проверка развал/схождения']]
    return works.map( work => {
      return /*html*/`
      <label class="checkbox-label" >
        <input
        type="checkbox"
        name="${work[0]}"
        value = "1">
        ${work[1]}
      </label>`}).join('')
  }

  getSaveButton(){
    return /*html*/`
      <div class="form-buttons">
        <button type="submit" name="save" class="button-primary-outline">
            Сохранить 
        </button>
      </div>
      <!-- <button type="button" name="print" class="button-primary-outline">
        Распечатать
      </button> -->`
  }

  render(){
    const elem = document.createElement('div');
    elem.innerHTML = this.template();
    this.elem = elem.firstElementChild;
    this.subElem = this.getSubElements(this.elem);

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
    const { carForm, addBtn } = this.subElem;
    carForm.addEventListener('submit', this.onSubmit); //отправка формы
    addBtn.onclick = this.onAdd; // ТО
  }

  dispatch(form){
    const formData = new FormData(form);
    formData.append('carId', this.car.id)
    const event = new CustomEvent('car-form', {
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

