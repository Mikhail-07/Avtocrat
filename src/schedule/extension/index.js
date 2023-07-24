export default class Extension {

  onSubmit = (event) =>{
    event.preventDefault();

    this.dispatch();
    this.close();
  }

  daysChange = () => {
    const { to, days } = this.subElem;
    const daysValue = parseInt(days.value);
    const dateFrom = new Date(this.rent.date); // дата в которую был заключен договор
    const dateTo = new Date (dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate() + this.rent.days) //дата по которую был заключен договор
    dateTo.setDate(dateTo.getDate() + daysValue)
    to.value = `${dateTo.getFullYear()}-${("0" + (dateTo.getMonth() + 1)).slice(-2)}-${("0" + (dateTo.getDate())).slice(-2)}`;
  }

  dateChange = () => {
    const { to, days } = this.subElem; // нашел поля 'продление по' и 'дни'
    const dateFrom = new Date(this.rent.date); // дата в которую был заключен договор
    const dateTo = new Date (dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate() + this.rent.days) //дата по которую был заключен договор
    days.value = (((this.dateTo - this.dateFrom)/3600000)/24);
  }

  elem = {}
  subElem = {}

  constructor(
    rent = {
      name: '',
      days: 0,
      rate: '',
      date: ''
    },
    days = 0
    ){
    this.rent = rent;
    this.days = days;

    this.render();
  }

  template() {
    const { name, rate, date } = this.rent;

    return /*html*/`
    <form data-element="currentForm" class="form-collumn">
      <div class="form-collumn">
        ${this.personalInformation(name)}
        ${this.rentInformation(date, rate)}
        ${this.button()}
      </div>
    </form>`;
  }

  personalInformation(name){
    return /*html*/`
    <div>
      <span class="form-label">${name}</span>
    </div>`
  }

  rentPeriod(date){
    const from = this.extansionDate(date);
    const to = this.extansionDate(date, this.days);
    const dateFrom = new Date (from.y, from.m, from.d);
    const dateTo = new Date (to.y, to.m, to.d);


    return {from, to, dateFrom, dateTo}
  }

  rentInformation(date, rate){
    const {from, to} = this.rentPeriod(date)

    return /*html*/`
    <div class="form-space-between ">

      <div class="fieldset-half-width fieldset">
        <span class="form-label">Продление с</span>
        <span class="span-control" id="from"> ${("0" + from.d).slice(-2)}.${("0" + (from.m + 1)).slice(-2)}.${from.y}</span>
      </div>
    

      <fieldset class="fieldset-half-width">
        <label class="form-label">Продление по</label>
        <input required
          id="to"
          value="${to.y}-${("0" + (to.m + 1)).slice(-2)}-${("0" + to.d).slice(-2)}"
          type="date"
          name="to"
          class="form-control"
          data-element="to">
      </fieldset>

    
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
  

      <div class="form-space-between">
        <span class="price-label">Тарифы:</span>
        <div class="fieldset_row">
          ${this.getRates(rate)}
        </div>
      </div>

      <div data-element="priceHolder"></div>
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

  button(){
    return /*html*/`
    <div class="form-buttons">
      <button type="submit" name="save" class="button-primary-outline"> 
        Продлить аренду
      </button>
    </div>  `
  }

  render(){
    const elem = document.createElement('div');
    elem.innerHTML = this.template();
    this.elem = elem.firstElementChild;

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

  extansionDate ( date, extensionDays = 0) {
    const extDate = new Date(date);
    extDate.setDate(extDate.getDate() + this.rent.days + extensionDays);
    const d = extDate.getDate();
    const m = extDate.getMonth();
    const y = extDate.getFullYear();
    return { d, m, y }
  }

  dateToObj(date){
    const dateHandler = date.split('.');
    const obj = {};
    obj.y = dateHandler[2];
    obj.m = dateHandler[1];
    obj.d = dateHandler[0];
  for ( const [key, value] of Object.entries(obj)){
      obj[key] = parseInt(value)
    }
    obj.m = obj.m - 1;
    return obj
  }

  initEventListener(){
    const { to, days } = this.subElem;
    days.addEventListener('change', this.daysChange);
    to.addEventListener('change', this.dateChange);
  }
}