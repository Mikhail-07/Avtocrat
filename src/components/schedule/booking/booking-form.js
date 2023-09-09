import cellProperties from "../cellProperties";
import informationSeporator from "../../../assets/lib/information_seporator";

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

  const from = new Date (formData.from);
  from.setHours(hh);
  from.setMinutes(mm);
  rent.from = from.getTime();
  rent.to = rent.from + rentData.days*24*3600*1000;
  rent.tableDate = from;
  
  clientData.rents.push(rent);
  clientData.status = 'booked';
  
  const div = this.putBookedOnMap(clientData, rent);
  const scheduleCell = this.scheduleCellByRowAndCollumn(carId, from);
  scheduleCell.append(div);
} 