//helpers
export const seleccionar = (selector) => document.querySelector(selector);
export const crearElemento = function (etiqueta, contenido, atributos = {}) {
  const elemento = document.createElement(etiqueta);
  elemento.innerHTML = contenido;
  for (const atributo of Object.keys(atributos)) {
    elemento.setAttribute(atributo, atributos[atributo]);
  }
  return elemento;
};
export const leer = function (key, data = []) {
  let info = localStorage.getItem(key);
  if (!info) {
    localStorage.setItem(key, JSON.stringify(data));
    return data;
  }
  return JSON.parse(info);
};
export const guardar = function (key, data) {
  localStorage.setItem(key, JSON.stringify(data));
  return leer(key);
};
export const toggle = (element = "", className = "") =>
  seleccionar(element).classList.toggle(className);
