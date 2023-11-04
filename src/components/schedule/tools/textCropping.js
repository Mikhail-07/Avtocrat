export default function (appointment){
  if (appointment.tagName === 'IMG') return
    const appointmentWidth = appointment.getBoundingClientRect().width;
    const textContent = appointment.querySelector('span');
    textContent.style.width = 'auto';
    const textContentWidth = textContent.getBoundingClientRect().width;
    if (textContentWidth > appointmentWidth) textContent.style.width = appointmentWidth - 20 + 'px';   
}