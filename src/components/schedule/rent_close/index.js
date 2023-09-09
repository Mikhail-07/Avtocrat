import services from "../../../data/services.js";

export default class RentClose {

  elem = {}
  subElem = {}

  constructor(
    rent = {}
    ){
    this.rent = rent;

    this.render();
  }

  template() {
    return /*html*/`
      <div class="form-collumn modal-close_rent">
        <div>
          <span class="form-label"> Имя клиента </span>
          <span>${this.rent.name}</span>
        </div>
        <div data-element="extensionHolder"></div>
        ${this.getAdditionalServicesButtons()}
      </div>
    </form>`;
  }

  getAdditionalServicesButtons(){
    return /*html*/`
    <div data-element="services">
      <h2 class="section-heading">
        Дополнительные услуги
      </h2>
      <div data-element="ribbonHolder"></div>
    </div>`
  }

  getButton(){
    return /*html*/`
    <div class="form-buttons">
      <button type="submit" name="save" class="button-primary-outline"> 
        Завершить аренду
      </button>
    </div>  `
  }

  render(){
    const elem = document.createElement('div');
    elem.innerHTML = this.template();
    this.elem = elem.firstElementChild;

    const button = document.createElement('div');
    button.innerHTML = this.getButton();
    this.button = button.firstElementChild;

    this.subElem = this.getSubElements(this.elem);
    this.getServices();
  }


  getSubElements(elem) {
    const subElem = {};
    const elements = elem.querySelectorAll('[data-element]');

    for (const item of elements) {
      subElem[item.dataset.element] = item;
    }

    return subElem;
  }

  getServices(){
    document.body.addEventListener('ribbon-select', ({ detail: key }) => {
    const result = document.createElement('div');
    result.innerHTML =/*html*/`
      <div class="form-space-between">
        <label class="form-label">${services[key]}</label>
        <input required
          id="${key}"
          value="${key === 'washer' ? 400 : ''}"
          type="number"
          name="${key}"
          class="fieldset-third-width"
          min="1">
      </div>`

      this.subElem.services.append(result.firstElementChild);
    })
  }
}