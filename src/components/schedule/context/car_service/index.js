export default class CarService {

  elem = {}
  subElem = {}

  constructor(){
    this.render();
  }

  template() {
    return /*html*/`
    <div class="form-collumn">
      <fieldset>
        <label class="form-label">Особые отметки</label>
        <input
        id="description"
        class="form-control"
        name="description"
        placeholder="">
      </fieldset>

      <fieldset>
        <label class="checkbox-label"><input
        type="checkbox"
        name="carBroken"
        value = "1">
        Автомобиль недоступен для дальнейшей эксплуатации 
        </label>
      </fieldset>

      <div class="form-buttons">
        <button type="submit" name="save" class="button-primary-outline"> Добавить запись </button>
      </div>
    </div>`;
  }

  render(){
    const elem = document.createElement('div');
    elem.innerHTML = this.template();
    this.elem = elem.firstElementChild;
  }
}