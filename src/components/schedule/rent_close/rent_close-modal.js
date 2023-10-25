import RentClose from './index.js'
import Modal from '../../modal_window/index.js';
import Extension from '../extension/index.js';
import Calculator from '../../calculator/index.js';
import RibbonMenu from '../../ribbon_menu/index.js';
import services from '../../../data/services.js';
import cellProperties from '../tools/cellProperties.js';

export default function(){
  const { rentId } = cellProperties(this.appointment);
  
  const rent = this.findRentById(rentId);
  const { client } = this.findClientById(rentId);

  const personalRent = client.rents.find(item => item.id === rentId)

  const rentClose = new RentClose( rent );
  const modal = new Modal('rentClose', 'Закрытие аренды', rentClose.elem);
  modal.open();

  const { dateCell } = cellProperties(this.td)
  const tdDate = new Date (dateCell.dataset.year, parseInt(dateCell.dataset.month) - 1, dateCell.dataset.day); //дата ячейки
  const days = Math.ceil(((tdDate.getTime() - personalRent.to)/3600000)/24);

  //если дни продления существую, то вызываем продление и калькулятор
  if (days > 0) {
    const obj = {};
    Object.assign(obj, personalRent);
    obj.from = personalRent.to

    const extension = new Extension( obj, days, client.name);
    modal.subElem.extensionHolder.append(extension.elem);

    const calculator = new Calculator (rent, extension.elem);
    extension.elem.append(calculator.elem)
  }
  
  const ribbonMenu = new RibbonMenu (services);
  modal.subElem.ribbonHolder.append(ribbonMenu.elem);

  let amount
  const total = document.createElement('div');
  total.innerHTML =/*html*/`
  <div class="form-space-between">
    <span class="form-label">К оплате</span>
    <span></span>
  </div>`
  
  rentClose.elem.append(rentClose.button)
} 