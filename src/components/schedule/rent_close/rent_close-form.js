import cellProperties from "../tools/cellProperties.js";
import informationSeporator from "../tools/information_seporator.js";

export default function(form){ 
  const formData = Object.fromEntries(form.entries()); // преобразуем extensionForm в объект
  formData.from = new Date(formData.from).getTime() // преобразует дату и время под клиентскую БД
  formData.to = new Date(formData.to).getTime() // преобразует дату и время под клиентскую БД

  const { rentId, carId } = cellProperties(this.appointment);
  const { client } = this.findClientById(rentId)
  const { services } = informationSeporator(formData)
  
  const clientRent = client.rents.find( element => element.id === rentId); //ищем по id аренду в массиве report
  clientRent.status = "close";
  client.status = "close";

  for (const [key, value] of Object.entries(services)){
    const obj = {}
    obj.name = client.name;
    obj.id = rentId;
    obj.carId = carId;
    obj.date = new Date().getTime();
    obj.type = key;
    obj.total = value;  
    this.report.push(obj);
  };

  // const lastAppointmentCell = this.scheduleCellByRowAndCollumn(carId, new Date(formData.to));
  // const washerCell = lastAppointmentCell.nextElementSibling;
  // const washerDiv = document.createElement('div');
  // washerDiv.innerHTML = /*html*/`
  // <div class="schedule__appointmentCell">
  //   <div class="rent-wrap">
  //     <div class="schedule__fillingCell resizable" data-filling="vacant">
  //       <div class="schedule__fillingCell-sole"></div>
  //     </div>
  //   </div>
  // </div>
  // `
  // washerCell.append(washerDiv);

  const resizer = this.appointment.querySelector('.resizer')
  resizer.remove()
  if (formData.days) {
    this.getExtensionForm({ detail: form })
  }
} 