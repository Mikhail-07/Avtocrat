import cellProperties from "../../tools/cellProperties";
import iconsData from "../../../../data/icons-data";

export default function(service, td, form){
  // const services = {
  //   checkUp: 'ТО',
  //   repair: 'Ремонт',
  //   accident: 'ДТП'
  // }

  const formData = Object.fromEntries(form.entries());
  const { carId, dateCell} = cellProperties(td);
  const obj = {}
  obj.id = iconsData[iconsData.length-1] ? 's-' + parseInt((iconsData[iconsData.length-1].id).split('-')[1]) + 1 : 's-' + 0;
  obj.type = 'icon';
  obj.name = service;
  obj.from = new Date(dateCell.dataset.year, dateCell.dataset.month, dateCell.dataset.day).getTime();
  obj.carId = carId;

  //если в форме передан чекбокс, значит машина неисправна, поэтому завершаю аренду и крашу ячейку в серый цвет
  if (formData.carBroken){
    obj.broken = 'true';   
  } else {
  //если чекбокса нет, то просто добавляю иконку
    obj.to = new Date(dateCell.dataset.year, dateCell.dataset.month, dateCell.dataset.day).getTime();
  }

  this.setBeginningAndEndOfEventhMonth(parseInt(dateCell.dataset.month), parseInt(dateCell.dataset.year))
  this.appointmentSwitcher(obj, parseInt(dateCell.dataset.month), parseInt(dateCell.dataset.year))
  iconsData.push(obj)
}