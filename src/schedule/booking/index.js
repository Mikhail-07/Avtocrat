export default class Booking {

  elem = {}
  subElem = {}

  constructor(
    carID = '', 
    bookDate = ''){
    this.carID = carID;
    this.bookDate = bookDate;

    this.render();
  }

  template() {
    return /*html*/`
    <form data-element="currentForm" class="form-collumn">
      <div class="form-row">
        ${this.personalInformation()}
        <div class="form-booking-rent-inf">
          ${this.rentInformation()}
        </div>
      </div>
      <div class="form-buttons">
        ${this.button()}
      </div>
    </form>`;
  }

  personalInformation(){
    return /*html*/`
    <div>
      <fieldset class="fieldset-full-width">
        <label class="form-label"> Имя клиента </label>
          <input required
          id="title"
          type="text"
          name="name"
          class="form-control"
          data-element="name"
          placeholder="Петров Евгений Петрович">
      </fieldset>
    
      <fieldset class="fieldset-full-width">
        <label class="form-label">Телефон</label>
          <input required
          id="tel"
          type="text"
          name="tel"
          class="form-control"
          data-element="tel"
          placeholder="+7">
      </fieldset>

      <fieldset class="fieldset-full-width">
        <label class="form-label">Особые отметки</label>
        <textarea required
            id="description"
            class="form-control"
            name="description"
            placeholder="Комментарий">
        </textarea>
      </fieldset>

      
    </div>`
  }

  rentInformation(){
    return /*html*/`
    <div class="form-rent-inf-wrap">
    <div class="form-space-between">
      <fieldset class="fieldset-half-width">
        <label class="form-label">Дата</label>
        <input required
          id="date"
          value="${this.bookDate}"
          type="date"
          name="date"
          class="form-control">
      </fieldset>
    

    
      <fieldset class="fieldset-third-width">
        <label class="form-label">Время</label>
        <input required
          id="time"
          value="15:00"
          type="time"
          name="time"
          class="form-control"
          placeholder="15:00">
      </fieldset>
    

    
      <fieldset class="fieldset-third-width">
        <label class="form-label">Дни</label>
        <input required
          id="days"
          value="1"
          type="number"
          name="days"
          class="form-control"
          min="1"
          placeholder="1">
      </fieldset>
      </div>
  

    
      <div class="form-space-between">
        <span class="price-label">Тарифы:</span>
        <div class="fieldset_row">
          <label class="radio-label"> 
          <input required
            value="100"
            type="radio"
            name="rate"
            class="form-control">
          100 </label>
          <label class="radio-label">
          <input required
            value="250"
            type="radio"
            name="rate"
            class="form-control">
          250</label>
          <label class="radio-label">
          <input required
            value="400"
            type="radio"
            name="rate"
            class="form-control">
          400</label>
        </div>
      </div>

      <div data-element="priceHolder"></div>
    </div>`
  }

  button(){
    return /*html*/`
    <button type="submit" name="save" class="button-primary-outline">
      ${this.productId 
        ? 'Сохранить' 
        : 'Добавить'} 
      запись
    </button>`
  }

  render(){
    const elem = document.createElement('div');
    elem.innerHTML = this.template();
    this.elem = elem.firstElementChild;
  }
}