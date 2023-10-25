import createFillingCell from "./createFillingCell";

export default function(filling, id, appointmentTextContent){
  //наполняем созданную запись (appointment)
  const appointment = document.createElement('div');
  appointment.classList.add('schedule__appointmentCell');
  if (id) appointment.dataset.id = id;
  
  const divWrap = document.createElement('div');
  divWrap.classList.add('rent-wrap');
  appointment.append(divWrap);

  // помещаем в appointment divFilling который дальше будет отображать тип заполнения paid или debt
  const divFilling = createFillingCell(filling)
  divWrap.append(divFilling);
  
  const textContentDiv = createCellTextContent(appointmentTextContent);
  appointment.append(textContentDiv); 
  
  return appointment
}

function createCellTextContent( appointmentTextContent ){
  //обертка с absolute
  const div = document.createElement('div');
  div.innerHTML = cellTextContentTemplate( appointmentTextContent );
  div.classList.add('schedule__textCell-wrapper');

  return div
}

function cellTextContentTemplate( appointmentTextContent = {} ){
  return /*html*/`
  <span class="schedule__textCell-content">
    ${appointmentTextContent.type === 'icon'
      ? `<img src="../../../assets/images/icons/${appointmentTextContent.name}-icon.svg" alt="${appointmentTextContent.name}-icon" class="schedule__services-icon"/>`
      : `${appointmentTextContent.name}, тел: +7 ${appointmentTextContent.tel}`
    }
  </span>`
}