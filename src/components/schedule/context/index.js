export default class Contextmenu{

  elem = {};
  eventOfContext = {};
  clientX = 0;
  clientY = 0;
  target = {};


  outClick = document.getElementById('out-click')

  delete = () => {
    this.td.removeAttribute("data-filling");
    this.td.textContent = '';
    this.td.classList.remove('schedule__fillingCell-booking');
    this.close()
  }

  contractCreate = () => {
    this.dispatch('client-card')
  }

  book = () => {
    this.dispatch('booking-modal')
  }

  extension = () => {
    this.dispatch('extension-modal')
  }

  extensionSpecific = () => {
    this.dispatch('extension-specific')
  }

  rentClose = () => {
    this.dispatch('rentClose-modal')
  }

  service = () => {
    const li = this.elem.querySelector("[data-action='service']");
    const yOffset = li.offsetTop;
    const {width} = li.getBoundingClientRect();

    const elem = document.createElement('div');
    elem.innerHTML = this.template(['checkUp', 'Техническое обслуживание'], ['repair', 'Ремонт'], ['accident', 'ДТП']);
    const servicesContext = elem.firstElementChild;
    this.elem.append(servicesContext) 
    servicesContext.style.top = `${yOffset}px`;
    servicesContext.style.right = `${-width}px`;
    setTimeout( () => servicesContext.classList.add('show'), 100)
    this.initEventListeners(['checkUp', 'repair', 'accident'])
  } 

  clickOnServices = (e) => {
    const id = e.target.closest('li').getAttribute('data-action')
    this.dispatch('context-service', id)
  }

  constructor(clickable = {}, li = []){
    this.clickable = clickable
    this.li = li

    this.render()
  }

  template(...li){
    return /*html*/`
    <ul class="menu">
      ${this.getList(...li)}
    </ul>`
  }

  getList(...li){
    return li.map((item) =>{
      const [action, title] = item;
      if (action === 'contractCreate'){
        const id = this.td.firstElementChild.dataset.id;
        return `<a href="/clients/${id}">
          <li class="menu-item">
            <span>${title}</span>
          </li>
        </a>`
      } else {
        return `
          <li class="menu-item" data-action="${action}">
            <span>${title}</span>
            ${action === 'service' 
              ? `<span class="sortable-table__sort-arrow">
                  <span class="sortable-table__sort-arrow_options"></span>
                </span>`
              : '' }
          </li>`  
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
      res = this.getList(['book', 'Создать бронь'], ['service', 'Создать событие']); //
      this.elem.innerHTML = res;
      this.initEventListeners(['book', 'service']); //
      this.getModal(td);
      return
    };
    
    if (type === 'broken') return

    if (type === 'book' ){
      res = this.getList(['contractCreate', 'Создать договор'], ['delete', 'Очистить ячейку']);
      this.elem.innerHTML = res;  
      this.initEventListeners(['contractCreate', 'delete']);
    };
    
    if (type === 'paid'){
      res = this.getList(['rentClose', 'Завершить аренду'], ['service', 'Создать событие'])
      this.elem.innerHTML = res;
      this.initEventListeners(['rentClose', 'service']) //'service' 
    }

    if (type === 'debt'){
      res = this.getList(['rentClose', 'Завершить аренду'], ['extensionSpecific', 'Продлить по выбранный день'], ['service', 'Создать событие']) 
      this.elem.innerHTML = res;
      this.initEventListeners(['rentClose', 'extensionSpecific', 'service']) //'service'
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
      if (item === 'checkUp' || item === 'repair' || item === 'accident') {
        return itemAction.addEventListener('pointerdown', this.clickOnServices)
      } else {
        itemAction.addEventListener('pointerdown', this[item])
      };  
    }); 
  }

  dispatch(name, id){
    const event = new CustomEvent(name, {
      detail: id,
      bubbles: true
    })
    this.elem.dispatchEvent(event);
    this.close()
  }
}
