import cellProperties from "../tools/cellProperties.js";
import informationSeporator from "../../../assets/lib/information_seporator.js";
import Router from "../../../router/index.js";

export default function(form){ 
  const formData = Object.fromEntries(form.entries()); // преобразуем extensionForm в объект
  formData.from = new Date(formData.from).getTime() // преобразует дату и время под клиентскую БД
  formData.to = new Date(formData.to).getTime() // преобразует дату и время под клиентскую БД
  const { rentId, carId } = cellProperties(this.appointment);
  const { client } = this.findClientById(rentId)
  const { rentData } = informationSeporator(formData)

  rentData.type = 'extension';
  rentData.id = rentId;
  rentData.name = client.name;
  rentData.date = (new Date()).getTime();
  rentData.carId = carId;
  rentData.total = rentData.perDay * rentData.days;

  const idx = client.rents.findIndex( item => item.id === rentId)
  client.rents[idx].to = rentData.to;
  client.rents[idx].days = client.rents[idx].days + rentData.days;
  client.rents[idx].carId = carId;

  this.report.push(rentData);
  const days = parseInt(formData.days);

  const appointmentPaidCell = this.appointment.querySelector('[data-filling="paid"]');
  if (appointmentPaidCell){
    const appointmentDebtCell = this.appointment.querySelector('[data-filling="debt"]');
    const resizer = this.appointment.querySelector('.resizer')
    const wPaid = parseInt(appointmentPaidCell.style.width);
    appointmentPaidCell.style.width = `${wPaid + (this.cellWidth * days)}px`;
    if (appointmentDebtCell){ 
      if (rentData.to > this.date) appointmentDebtCell.remove()
      const wDebt = parseInt(appointmentDebtCell.style.width);
      appointmentDebtCell.style.width = `${wDebt - (this.cellWidth * days)}px`;
    }
    if (resizer) resizer.style.left = `${wPaid + (this.cellWidth * days) - this.resizerWidth}px`;
  } else {
    const router = Router.instance();
    router.navigate('/')
  }  
} 