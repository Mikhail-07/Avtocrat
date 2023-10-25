export default function(pageX, pageY, template){
  const div = document.createElement('div');
  div.innerHTML = template;
  div.style.position = 'absolute';
  div.style.left = Math.round(pageX) + 'px';
  div.style.top = Math.round(pageY) + 'px';
  div.classList.add('menu');
  document.body.append(div);
  
  return div;
}