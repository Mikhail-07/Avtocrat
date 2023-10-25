export default function (filling){
  const width = 40;
  const div = document.createElement('div');
  div.style.width = width + 'px'; 
  div.classList.add('schedule__fillingCell', 'resizable');
  div.dataset.filling = `${filling}`;

  const sole = document.createElement('div');
  sole.classList.add('schedule__fillingCell-sole');
  div.append(sole)

  return div
}