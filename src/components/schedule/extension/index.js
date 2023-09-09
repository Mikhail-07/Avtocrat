import dateHandler from "../../../assets/lib/date_handler"

export default class Extension {

  onSubmit = (event) =>{
    event.preventDefault();

    this.dispatch();
    this.close();
  }

  daysChange = () => {
    const { from, to, days } = this.subElem;
    this.days = parseInt(days.value);
    const dateFrom = new Date(from.value); // дата в которую был заключен договор
    const dateTo = new Date (dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate() + this.days) //дата по которую был заключен договор

    const toFormatted = () => dateHandler(dateTo);
    to.value = `${toFormatted().y}-${toFormatted().m}-${toFormatted().d}`;
  }

  dateChange = (type) => {
    const { from, to, days } = this.subElem; // нашел поля 'продление по' и 'дни'
    const dateFrom = new Date (from.value) //дата по которую был заключен договор
    const dateTo = new Date(to.value); // дата в которую был заключен договор

    const dateDiff = Math.floor(((dateTo - dateFrom)/3600000)/24);
    if (dateDiff <= 0){

      if (type === 'from'){
        const date = new Date (dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate() + 1);
        const dateFormatted = () => dateHandler(date);
        to.value = `${dateFormatted().y}-${dateFormatted().m}-${dateFormatted().d}`;
      }

      if (type === 'to'){
        const date = new Date (dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate() - 1);
        const dateFormatted = () => dateHandler(date);
        from.value = `${dateFormatted().y}-${dateFormatted().m}-${dateFormatted().d}`;
      }

      days.value = '1';
    } else {
      days.value = dateDiff;
    }
      
  
    this.days = parseInt(days.value); // для калькулятора
  }

  elem = {}
  subElem = {}

  constructor(
    rent = {},
    days = 1,
    name = ''
    ){
    this.rent = rent;
    this.days = days;
    this.name = name;

    this.render();
  }

  template() {
    const { from } = this.rent;

    return /*html*/`
      <div class="form-collumn modal-close_rent">
        ${this.rentInformation(from, this.days)}
      </div>`;
  }

  personalInformation(name){
    return /*html*/`
    <div>
      <span class="form-label">${name}</span>
    </div>`
  }

  rentInformation(from, days){
    const fromFormatted = () => dateHandler(from);
    const toFormatted = () => dateHandler(from, days);

    return /*html*/`
    <div class="form-space-between ">
      <div>
        <fieldset class="fieldset-half-width">
          <label class="form-label">с какого</label>
          <input required
            id="from"
            value="${fromFormatted().y}-${fromFormatted().m}-${fromFormatted().d}"
            type="date"
            name="from"
            class="form-control"
            data-element="from">
        </fieldset>    

        <fieldset class="fieldset-half-width">
          <label class="form-label">по какое</label>
          <input required
            id="to"
            value="${toFormatted().y}-${toFormatted().m}-${toFormatted().d}"
            type="date"
            name="to"
            class="form-control"
            data-element="to">
        </fieldset>
      </div>
      
      <div>
        ${this.timeTemplate()}

        <fieldset class="fieldset-third-width">
          <label class="form-label">Дни</label>
          <input required
            id="days"
            value="${this.days}"
            type="number"
            name="days"
            class="form-control"
            min="1"
            data-element="days">
        </fieldset>
      </div>
      <div data-element="priceHolder"></div>
    </div>`
  }

  timeTemplate(){
    if (!this.name) {
      return /*html*/`
      <fieldset class="fieldset-third-width">
        <label class="form-label">Время</label>
        <input required
          id="time"
          value="15:00"
          type="time"
          name="time"
          class="form-control"
          placeholder="15:00">
      </fieldset>`
    }
    return ''
  }

  ratesTemplate(rate){
    return /*html*/`
    <div class="form-space-between">
      <span class="price-label">Тарифы:</span>
      <div class="fieldset_row">
        ${this.getRates(rate)}
      </div>
    </div>`
  }

  getRates(rate) {
    const arr = ['100', '250', '400'];
    return arr.map(item =>{
      return /*html*/`
      <label class="radio-label"> 
          <input required
            value="${item}"
            type="radio"
            name="rate"
            class="form-control"
            ${rate === item ? "checked" : ''}>
          ${item} </label>`
    }).join('');
  }

  getButton(){
    return /*html*/`
    <div class="form-buttons" data-element="button">
      <button type="submit" name="save" class="button-primary-outline"> 
        Продлить аренду
      </button>
    </div>  `
  }

  render(){
    const elem = document.createElement('div');
    elem.innerHTML = this.template();
    this.elem = elem.firstElementChild;

    const rates = document.createElement('div');
    rates.innerHTML = this.ratesTemplate(this.rent.rate);
    this.elem.append(rates);

    const name = document.createElement('div');
    name.innerHTML = this.personalInformation(this.name);
    this.name = name.firstElementChild;

    const button = document.createElement('div');
    button.innerHTML = this.getButton();
    this.button = button.firstElementChild;

    this.subElem = this.getSubElements(this.elem);

    
    this.initEventListener();
  }

  getSubElements(elem) {
    const subElem = {};
    const elements = elem.querySelectorAll('[data-element]');

    for (const item of elements) {
      subElem[item.dataset.element] = item;
    }

    return subElem;
  }

  initEventListener(){
    const { from, to, days } = this.subElem;
    from.addEventListener('change', () => this.dateChange ('from'))
    to.addEventListener('change', () => this.dateChange ('to'));
    days.addEventListener('change', this.daysChange);
    
  }
}