import Booking from './index.js';
import Extension from '../extension/index.js';
import Modal from '../../modal_window/index.js';
import Calculator from '../../calculator/index.js';
import cellProperties from "../tools/cellProperties.js";

export default function(td){ 

  const { carId, dateCell} = cellProperties(td);

  const from = new Date(dateCell.dataset.year, dateCell.dataset.month, dateCell.dataset.day);
  const fromRFC = `${from.getFullYear()}-${("0" + from.getMonth()).slice(-2)}-${("0" + from.getDate()).slice(-2)}`;
  const to = new Date(from.getFullYear(), from.getMonth(), from.getDate() + 1);
  const toRFC = `${to.getFullYear()}-${("0" + to.getMonth()).slice(-2)}-${("0" + to.getDate()).slice(-2)}`;

  const rent = {} //объект rent с дефолтными значениями days, rate и номер машины на которую планируют поставить бронь
  rent.carId = carId;
  rent.days = 1;
  rent.rate = '100';
  rent.from = fromRFC;
  rent.to = toRFC;

  const modalBody = new Booking();
  const modal = new Modal('booking', 'Запись клиента', modalBody.elem);
  
  const extension = new Extension(rent);
  modal.subElem.extensionHolder.append(extension.elem)
  
  modal.open()

  const calculator = new Calculator (rent, extension.elem);
  modal.subElem.priceHolder.append(calculator.elem)
} 