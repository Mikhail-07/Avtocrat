import ClientForm from './form.js';
import cars from '../assets/lib/cars.js';

export default class ClientCard{

elem = {};
clientForm = {}

  constructor(client = {}, rent = {}){
    this.client = client;
    this.rent = rent;

    this.render();
  }

  template(){
    return /*html*/`
    <div>
      ${this.renderForm(this.client, this.rent)}
    </div>
    `
  }

  render(){
    const elem = document.createElement('div');
    elem.innerHTML = this.template();
    this.elem = elem.firstElementChild;
    document.body.append(this.elem); 
  }

  renderForm(client, rent){
    this.clientForm = new ClientForm (client, rent);   
  }
}
