import clients from '../data/clients.js';

export default async function(path, match) {
 
  const main = document.querySelector('main');

  main.classList.add('is-loading');

  const {default: Page} = await import(`../pages/${path}/index.js`);
 
  const page = new Page(match);
  const element = await page.render();

  main.classList.remove('is-loading');

  const contentNode = document.querySelector('#content');

  contentNode.innerHTML = '';
  contentNode.append(element);

  if (path === 'schedule'){
    const schedule = page.components.schedule
    schedule.timeline();
    schedule.getAppointments(schedule.month, schedule.year); //заполняем текущий месяц
    schedule.initialScheduleState (clients, schedule.month, schedule.year);
    schedule.renderContextMenu();
    schedule.initResizer();
  }

  return page;
}
