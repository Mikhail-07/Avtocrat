
export default function (scheduleCell){
  const obj = {};

  const rentId = scheduleCell.dataset.id;
  const carRow = scheduleCell.closest('tr'); //строка по которой был клик
  const carCell = carRow.firstElementChild; //ячейка машины по строке которой был клик
  const carId = carCell.dataset.carId; // id машины
  const dateCell = schedule.rows[1].cells[scheduleCell.cellIndex]; //ячейка с датой на которую создают бронь
  let clientId;
  if (rentId) { clientId = rentId.split('-')[0] };


  obj.rentId = rentId;
  obj.clientId = clientId;
  obj.carRow = carRow;
  obj.carCell = carCell;
  obj.dateCell = dateCell;
  obj.carId = carId;
  
  return obj
}