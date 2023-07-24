export default class RibbonMenu {
  
  elem ={}

   onRhArrClick = () =>{
    const ribbonInner = this.elem.querySelector('.ribbon__inner');
    ribbonInner.scrollBy(100, 0);
    
    ribbonInner.addEventListener('scroll', ()=> {this.arrowDisplay(this.scrollCalculate(ribbonInner))})
  }

  onLhArrClick = () =>{
    const ribbonInner = this.elem.querySelector('.ribbon__inner');
    ribbonInner.scrollBy(-100, 0);

    ribbonInner.addEventListener('scroll', ()=> {this.arrowDisplay(this.scrollCalculate(ribbonInner))})
  }

  onMenuClick = (e) => {
    console.log(':)')
    e.preventDefault();

    const categories = this.elem.querySelectorAll('.ribbon__item')
    categories.forEach( item => item.classList.remove('ribbon__item_active'))
    e.target.classList.add('ribbon__item_active') //!!!это нужно???
    
    const id = e.target.getAttribute('data-service')

    this.dispatch(id)
  }

  constructor (services = {}){
    this.services = services

    this.render()
  }

  template(){
    return /*html*/`
    <div class="ribbon">
      <button type="button" class="ribbon__arrow ribbon__arrow_left ">
        <img src="./assets/images/icons/angle-icon.svg" alt="icon">
      </button>
      <nav class="ribbon__inner">
        ${this.getCategories()}
      </nav>
      <button type="button" class="ribbon__arrow ribbon__arrow_right ribbon__arrow_visible">
        <img src="./assets/images/icons/angle-icon.svg" alt="icon">
      </button>
    </div>`
  }

  getCategories(){
    let result = '';

    for (const [key, value] of Object.entries(this.services)){
      result = result + /*html*/`
      <button type="button" data-service="${key}" class="button-primary-tags">
        ${value} 
      </button>`
    }

    return result
  }

  render(){
    const element = document.createElement('div');
    element.innerHTML = this.template();
    this.elem = element.firstElementChild;

    this.initEventListener(this.elem);
  }

  initEventListener(elem){
    elem.querySelector('.ribbon__arrow_left').addEventListener('pointerdown', this.onLhArrClick)
    elem.querySelector('.ribbon__arrow_right').addEventListener('pointerdown', this.onRhArrClick)

    const categories = elem.querySelectorAll('[data-service]');
    categories.forEach(item => item.addEventListener('pointerdown', this.onMenuClick));
  }

  scrollCalculate(ribbonInner){
    const scrollWidth = ribbonInner.scrollWidth;
    const scrollLeft = ribbonInner.scrollLeft;
    const clientWidth = ribbonInner.clientWidth;

    const scrollRight = scrollWidth - scrollLeft - clientWidth;

    const result = {}
    result.scrollLeft = scrollLeft;
    result.scrollRight = scrollRight;
     
    return result
  }

  arrowDisplay({scrollLeft, scrollRight}){
    scrollLeft > 0 
      ? this.elem.querySelector('.ribbon__arrow_left').classList.add("ribbon__arrow_visible") 
      : this.elem.querySelector('.ribbon__arrow_left').classList.remove("ribbon__arrow_visible"),

    scrollRight > 0 
      ? this.elem.querySelector('.ribbon__arrow_right').classList.add("ribbon__arrow_visible") 
      : this.elem.querySelector('.ribbon__arrow_right').classList.remove("ribbon__arrow_visible")
  }

  dispatch (id){
    const event = this.elem.dispatchEvent (new CustomEvent('ribbon-select', {
      detail: id,
      bubbles: true
    }))
    console.log(event)
  }
}