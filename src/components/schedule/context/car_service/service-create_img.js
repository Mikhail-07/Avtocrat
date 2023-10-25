export default function createImg (service){
  const div = document.createElement('div');
  div.innerHTML = `<img src="../../../assets/images/icons/${service}-icon.svg" alt="${service}-icon" class="schedule__services-icon"/>`;
  return div.firstElementChild;
}