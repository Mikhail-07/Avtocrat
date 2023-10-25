import CarService from './index.js';
import Modal from '../../../modal_window/index.js';

export default function(){
  const modalBody = new CarService();
  const modal = new Modal('carService', 'Техническое состояние', modalBody.elem);
  modal.open()
}