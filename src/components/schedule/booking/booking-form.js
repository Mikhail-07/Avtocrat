import cellProperties from "../tools/cellProperties";
import informationSeporator from "../tools/information_seporator.js";
import bookOnSchedule from "./book-on-schedule";

export default function(form){ 
  let clientId = ''

  const formData = Object.fromEntries(form.entries()) //данные из bookingForm в формате ключ-значение
  
  const [ hh, mm ] = formData.time.split(':') 
  delete formData.time;
  const date = new Date (formData.from);
  date.setHours(hh);
  date.setMinutes(mm);
  formData.date = date.getTime();
  
  const { clientData, rentData } = informationSeporator(formData)
  
  const idx = this.clients.findIndex( item => item.name === formData.name)

  if (idx === -1){
    clientId = this.clients.length;
    clientData.id = `${clientId}`;
    clientData.rents = [];
    this.clients.push(clientData);
  } else {
    clientId = idx
  }

  const { carId } = cellProperties(this.td);
  const rent = {}
  rent.id = clientId + '-' + this.year + this.month + this.day // id договора
  rent.carId = carId;
  rent.rate = rentData.rate;
  rent.days = rentData.days;
  rent.status = 'booked';

  rent.from = date.getTime();
  rent.to = rent.from + rentData.days*24*3600*1000;
  rent.tableDate = new Date (date.getFullYear(), date.getMonth(), date.getDate() + 1).getTime();
  
  clientData.rents.push(rent);
  clientData.status = 'booked';
  
  const div = bookOnSchedule(clientData, rent, this.cellWidth);
  const scheduleCell = this.tdByRowAndCollumn(carId, new Date (date.getFullYear(), date.getMonth(), date.getDate() + 1));
  scheduleCell.append(div);
} 