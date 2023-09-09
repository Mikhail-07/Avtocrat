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
    <div class="form-collumn">
      <div class="form-row">
        ${this.personalInformation()}
        <div class="form-booking-rent-inf">
          ${this.rentInformation()}
        </div>
      </div>
      ${this.getbutton()}
    </div>`;
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
      <div class="form-space-between" data-element="extensionHolder">
      </div>
      <div data-element="priceHolder"></div>
    </div>`
  }

  getbutton(){
    return /*html*/`
    <div class="form-buttons">
      <button type="submit" name="save" class="button-primary-outline">
        ${this.productId 
          ? 'Сохранить' 
          : 'Добавить'} 
        запись
      </button>
    </div>`
  }

  render(){
    const elem = document.createElement('div');
    elem.innerHTML = this.template();
    this.elem = elem.firstElementChild;
  }
}