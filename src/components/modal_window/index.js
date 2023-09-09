import svg from '../../assets/images/icons/cross-icon.svg'

export default class Modal {
  

  onSubmit = (event) =>{
    event.preventDefault();

    this.dispatch();
    this.close();
  }

  elem = {}

  constructor(name, header, body){
    this.name = name;
    this.header = header;
    this.body = body;

    this.render();
    this.elem.addEventListener('click', (event) => this.onClick(event));
  }

  template(){
    return /*html*/`
    <div class="modal">
      <div class="modal__overlay"></div>
      <div class="modal__inner">
        <div class="modal__header">
          <button type="button" class="modal__close">
            <img src="../../assets/images/icons/cross-icon.svg" alt="close-icon" />
          </button>
          <h3 class="modal__title">${this.header}</h3>
        </div>
        <div class="modal__body">
          <form data-element="currentForm" class="form-collumn">
          </form>
        </div>
      </div>
    </div>`
  }

  render(){
    const elem = document.createElement('div');
    elem.innerHTML = this.template();
    this.elem = elem.firstElementChild;

    this.elem.querySelector('[data-element=currentForm]').append(this.body)

    this.subElem = this.getSubElements(this.elem);

    this.initEventListener()
  }

  getSubElements(elem) {
    const subElem = {};
    const elements = elem.querySelectorAll('[data-element]');

    for (const item of elements) {
      subElem[item.dataset.element] = item;
    }

    return subElem;
  }


  open() {
    document.body.append(this.elem);
    document.body.classList.add('is-modal-open');
    this.keydownEventListener = (event) => this.onDocumentKeyDown(event);
    document.addEventListener('keydown', this.keydownEventListener);
    if (this.elem.querySelector('[autofocus]')) {
      this.elem.querySelector('[autofocus]').focus();
    }
  }

  onClick(event) {
    if (event.target.closest('.modal__close')) {
      event.preventDefault();
      this.close();
    }
  }

  onDocumentKeyDown(event) {
    if (event.code === 'Escape') {
      event.preventDefault();
      this.close();
    }
  }

  close() {
    document.removeEventListener('keydown', this._keydownEventListener);
    document.body.classList.remove('is-modal-open');
    this.elem.remove();
  }

  initEventListener(){
    const { currentForm } = this.subElem;
    currentForm.addEventListener('submit', this.onSubmit);
  }

  dispatch(){
    const form = this.elem.querySelector('form');
    const currentForm = new FormData(form);
    this.elem.dispatchEvent(new CustomEvent(`${this.name}-form`, {
      detail: currentForm,
      bubbles: true
    }))
  }
}

