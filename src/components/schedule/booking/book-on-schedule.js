export default function(client, rent, cellWidth){
  const date = new Date (rent.from);
  const d = ("0" + date.getDate()).slice(-2);
  const m = ("0" + (date.getMonth() + 1)).slice(-2);
  const hh = ("0" + date.getHours()).slice(-2);
  const mm = ("0" + date.getMinutes()).slice(-2);

  const div = document.createElement('div');
  div.innerHTML = `
  <div class="schedule__appointmentCell" data-id="${rent.id}" style="width: ${cellWidth}px;">
    <div class="schedule__fillingCell" data-filling="book">
      <div class="schedule__fillingCell-sole"></div>
    </div>
    <div class="schedule__textCell-wrapper">
      <span class="schedule__textCell-content">${d}.${m}, ${hh}:${mm}, ${client.name}, тел: +7 ${client.tel}, ${rent.days} дня, ${rent.rate} км.</span>
    </div>
  </div>`

  return div.firstElementChild
}