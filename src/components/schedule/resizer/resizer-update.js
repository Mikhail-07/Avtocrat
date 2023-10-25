export default function (appointment){
  const resizerWidth = 6

  const paid = appointment.querySelector(`[data-filling="paid"]`);
  if (!paid) return;
  const resizer = appointment.querySelector('.resizer');
  if (!paid || !resizer) return
  
  const { width } = paid.getBoundingClientRect();
  resizer.style.left = width - resizerWidth + 'px';
}