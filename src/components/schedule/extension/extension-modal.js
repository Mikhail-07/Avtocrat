import Extension from './index.js';
import Modal from '../../modal_window/index.js';
import Calculator from '../../calculator/index.js';
import cellProperties from '../cellProperties.js';

export default function(days){ 
  const { rentId } = cellProperties(this.appointment);

  const rent = this.findRentById(rentId);
  const { client } = this.findClientById(rentId);

  const personalRent = client.rents.find(item => item.id === rentId)

  const obj = {};
  Object.assign(obj, personalRent);
  obj.from = personalRent.to

  const extension = new Extension(obj, days, client.name);
  const modal = new Modal('extension', 'Продление аренды', extension.elem);
  extension.elem.prepend(extension.name);
  modal.open()

  const calculator = new Calculator (rent, extension.elem);
  extension.elem.append(calculator.elem)
  extension.elem.append(extension.button)
} 