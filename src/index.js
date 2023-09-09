import "./style.css"
import "./assets/styles/common.css"
import "./components/schedule/context/style.css"
import "./components/schedule/booking/style.css"
import "./assets/styles/style.css"

import Router from './router/index.js';
// import tooltip from './components/tooltip/index.js';

// const URL_PATH = process.env.URL_PATH;

export default class MainPage {
  constructor () {
    // tooltip.initialize();

    this.router = Router.instance();
    this.render();

    this.addEventListeners();
  }

  get template () {
    return `
    <main class="main">
    <div class="progress-bar">
      <div class="progress-bar__line"></div>
    </div>
    <aside class="sidebar">
      <h2 class="sidebar__title">
        <a href="/">Автократ</a>
      </h2>
      <ul class="sidebar__nav">
        <li>
          <a href="/" data-page="schedule">
            <i class="icon-schedule"></i> <span>График</span>
          </a>
        </li>
        <li>
          <a href="/report" data-page="report">
            <i class="icon-report"></i> <span>Отчет</span>
          </a>
        </li>
        <li>
          <a href="/clients" data-page="report">
            <i class="icon-report"></i> <span>Клиенты</span>
          </a>
        </li>
        <li>
          <a href="/cars" data-page="report">
            <i class="icon-report"></i> <span>Автомобили</span>
          </a>
        </li>
      </ul>
      <ul class="sidebar__nav sidebar__nav_bottom">
        <li>
          <button type="button" class="sidebar__toggler">
            <i class="icon-toggle-sidebar"></i> <span>Скрыть панель</span>
          </button>
        </li>
      </ul>
    </aside>
    <section class="content" id="content">
  
    </section>
  </main>
    `;
  }

  render () {
    const element = document.createElement('div');
    element.innerHTML = this.template;

    this.element = element.firstElementChild;
    document.body.append(this.element);
  }

  initializeRouter() {
    this.router
      .addRoute(/^$/, 'schedule')
      .addRoute(/^report$/, 'rental-report/list')
      .addRoute(/^clients$/, 'clients/list')
      .addRoute(`^clients/add$`, 'clients/edit')
      .addRoute(`^clients/([\\w()-]+)$`, 'clients/edit')
      .addRoute(/^cars$/, 'cars/list')
      // .addRoute(new RegExp(`^${URL_PATH}sales$`), 'sales')
      // .addRoute(new RegExp(`^${URL_PATH}categories$`), 'categories')
      // .addRoute(/404\/?$/, 'error404')
      // .setNotFoundPagePath('error404')
      .listen();
  }

  addEventListeners() {
    const sidebarToggle = this.element.querySelector('.sidebar__toggler');

    sidebarToggle.addEventListener('click', event => {
      event.preventDefault();
      document.body.classList.toggle('is-collapsed-sidebar');
    });
  }
}

const mainPage = new MainPage();

document.body.append(mainPage.element);

mainPage.initializeRouter();