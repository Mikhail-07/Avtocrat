import cellProperties from "../tools/cellProperties.js";

export default function(){
  const { dateCell } = cellProperties(this.td);
  const { rentId } = cellProperties(this.appointment);
  const { client } = this.findClientById(rentId);
  const personalRent = client.rents.find(item => item.id === rentId);
  
  const tdDate = new Date (dateCell.dataset.year, dateCell.dataset.month, dateCell.dataset.day); //дата ячейки
  const days = Math.ceil(((tdDate.getTime() - personalRent.to)/3600000)/24);
  const appointmentPaidCell = this.appointment.querySelector('[data-filling="paid"]');
  const appointmentDebtCell = this.appointment.querySelector('[data-filling="debt"]');
  const resizer = this.appointment.querySelector('.resizer');
  this.initExtensionModal({ detail: {days, appointmentPaidCell, appointmentDebtCell, resizer} });
}