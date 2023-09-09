import prices from '../../data/prices.js';
import cars from '../../data/cars.js';

export default class Calculator{
  elem = {}

  dependingDays = () => {
    const currentDays = days.value;
    // this.rent.days = currentDays; !!!перезаписывает переменную в extension. Зачем это тут???
    perDay.value = this.perDay(currentDays, this.rent.rate);
    total.innerText = this.setTotal()
  }

  dependingDate = () => {
    const dateFrom = new Date (this.from.innerText);
    const dateTo = new Date (this.to.value);
    const currentDays = Math.floor(dateTo-dateFrom);
    perDay.value = this.perDay(currentDays, this.rent.rate);
    total.innerText = this.setTotal()

  }

  dependingRate = (rates) => {
    let currentRate;
    for (const rate of rates){
      if (rate.checked){
        currentRate = rate.value;
      }
    }
    this.rent.rate = currentRate;
    perDay.value = this.perDay(this.rent.days, currentRate);
    total.innerText = this.setTotal()
  }

  constructor(rent = 
    {
    carId: '',
    days: 1,
    rate: '100'
    },
    extensionElem = {}
  ){
    this.rent = rent;
    this.extensionElem = extensionElem;

    this.findInputs()
    this.render();
  }

  findInputs(){
    this.toInput = this.extensionElem.querySelector('[data-element="to"]');
    this.fromInput = this.extensionElem.querySelector('[data-element="from"]');
    this.daysInput = this.extensionElem.querySelector('[data-element="days"]');
  }

  template({ days, rate }) {
    return /*html*/`
    <div class="calculator">
      <div class="form-space-between">
        <label class="price-label">Сутки</label>
        <input required
          id="perDay"
          value="${this.perDay(days, rate)}"
          type="text"
          name="perDay"
          class="form-price"
          placeholder="">
      </div>
      <div class="form-space-between">
        <span class="price-label">Сумма аренды:</span>
        <span id="total">${this.setTotal()}</span>
      </div>
      <div class="form-space-between">
        <span class="price-label">Залог на автомобиль:</span>
        <span id="deposit">${this.setDeposit()}</span>
      </div>
    </div>`
  }

  render(){
    const elem = document.createElement('div');
    elem.innerHTML = this.template(this.rent);
    this.elem = elem.firstElementChild;

    this.initEventListener();
  }

  perDay(days, rate){
    const { carId } = this.rent;
    const { brand } = cars.find( item => item.id === carId);
    
    let r = 0
    if (rate === '250'){
      r = 1
    }
    if (rate === '400'){
      r = 2
    }

    let d = 0
    if (days > 1 && days < 8){
      d = 1;
    }
    if (days >= 8 && days <= 14){
      d = 2;
    } 
    if (days >= 15){
      d = 3;
    }
    this.rent.perDay = prices[brand][r][d]
    return this.rent.perDay;
  }

  setTotal(){
    this.rent.total = this.daysInput.value * this.rent.perDay
    return this.rent.total 
  }

  setDeposit(){
    const { carId } = this.rent;
    const { brand } = cars.find( item => item.id === carId);
    this.rent.deposit = prices[brand][3]
    return this.rent.deposit
  }
  
  initEventListener(){
    this.daysInput.addEventListener('change', this.dependingDays); // подсчет стоимости одного дня аренды при изменении кол-ва дней

    if (this.to) {
      this.to.addEventListener('change', this.dependingDate); // подсчет стоимости одного дня аренды при изменении даты
    }
    
    const rates = document.querySelectorAll('input[name="rate"]');
    for (const rate of rates){
      rate.addEventListener('change', () => this.dependingRate(rates)) // подсчет стоимости одного дня аренды при изменении тарифа
    }
  }
}

