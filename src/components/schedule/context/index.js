export default class Contextmenu{

  elem = {};
  eventOfContext = {};
  clientX = 0;
  clientY = 0;
  target = {};


  outClick = document.getElementById('out-click')

  constructor(clickable = {}, li = []){
    this.clickable = clickable
    this.li = li

    this.render()
  }

  template(li = []){
    return /*html*/`
    <ul id="menu" class="menu">
      ${this.getList(li)}
    </ul>`
  }

  getList(...li){
    return li.map((item) =>{
      const [action, title] = item;
      if (action === 'contractCreate'){
        const id = this.td.firstElementChild.dataset.id;
        return `<a href="/clients/${id}">
          <li class="menu-item">
            ${title}
          </li>
        </a>`
      } else {
        return `<li class="menu-item" data-action="${action}">${title}</li>`  
      }  
    }).join('')
  }

  render(){
    const elem = document.createElement('div');
    elem.innerHTML = this.template();
    this.elem = elem.firstElementChild;
  }

  getTitles(td, type){
    this.td = td;
    let res

    if (!type){
      res = this.getList(['book', 'Создать бронь']); //['service', 'Создать событие']
      this.elem.innerHTML = res;
      this.initEventListeners(['book']); //'service'
      this.getModal(td);
      return
    };
    
    if (type === 'book' ){
      res = this.getList(['contractCreate', 'Создать договор'], ['delete', 'Очистить ячейку']);
      this.elem.innerHTML = res;  
      this.initEventListeners(['contractCreate', 'delete']);
    };
    
    if (type === 'paid'){
      res = this.getList(['rentClose', 'Завершить аренду']) //['service', 'Создать событие']
      this.elem.innerHTML = res;
      this.initEventListeners(['rentClose']) //'service' 
    }

    if (type === 'debt'){
      res = this.getList(['rentClose', 'Завершить аренду'], ['extensionSpecific', 'Продлить по выбранный день']) //['service', 'Создать событие']
      this.elem.innerHTML = res;
      this.initEventListeners(['rentClose', 'extensionSpecific']) //'service'
    }

    this.getModal(td);
  }

  getModal(td){

    this.elem.classList.add('show')
    const { right, bottom, top } = td.getBoundingClientRect()
    // const { width, height } = this.elem.getBoundingClientRect() //почему-то значения видны только в devTools

    this.elem.style.top = `${bottom + window.scrollY}px`
    this.elem.style.left = `${right + window.scrollX }px`
    
    this.outClick.style.display = "block"
    this.outClick.addEventListener('click', this.close)
  }

  close = () => {
    this.elem.classList.remove('show')
    this.outClick.style.display = "none"
  }

  initEventListeners(action) { //присваивает действия кнопкам контекстного меню
    action.forEach( item => {
      if (item === 'contractCreate') return
      const itemAction = this.elem.querySelector(`[data-action="${item}"]`);
      itemAction.addEventListener('pointerdown', this[item]);  
    }); 
  }

  delete = () => {
    this.td.removeAttribute("data-filling");
    this.td.textContent = '';
    this.td.classList.remove('schedule__fillingCell-booking');
    this.close()
  }

  contractCreate = () => {
    const event = new CustomEvent('client-card', {
      bubbles: true
    });
    this.elem.dispatchEvent(event);
    console.log(event);
    this.close()
  }

  book = () => {
    const event = new CustomEvent('booking-modal', {
      bubbles: true
    });
    this.elem.dispatchEvent(event);
    this.close()
  }

  extension = () => {
    const event = new CustomEvent('extension-modal', {
      bubbles: true
    });
    this.elem.dispatchEvent(event);
    this.close()
  }

  extensionSpecific = () => {
    const event = new CustomEvent('extension-specific', {
      bubbles: true
    });
    this.elem.dispatchEvent(event);
    this.close()
  }

  rentClose = () => {
    const event = new CustomEvent('rentClose-modal', {
      bubbles: true
    });
    this.elem.dispatchEvent(event);
    this.close()
  }
}
