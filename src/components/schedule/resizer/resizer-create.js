import resizerUpdate from "./resizer-update";

export default function (appointment){
  const resizer = document.createElement('div');
  resizer.innerHTML = resizerTemplate();
  resizer.classList.add('resizer', 'resizer-r', 'container');
  resizer.dataset.resizable  = 'true';
  appointment.append(resizer);
  resizerUpdate(appointment);
}

function resizerTemplate(){
  return /*html*/`
  <div class="line line-1"></div>
  <div class="line line-2"></div>
  `
}