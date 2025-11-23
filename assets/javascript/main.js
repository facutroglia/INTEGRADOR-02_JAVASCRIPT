import { Catalogo } from "./data.js";
import { seleccionar, crearElemento, leer, guardar, toggle } from "./utils.js";

// ---------------------------------------- CARRITO -------------------------------------- //

//Elementos
const productos = seleccionar("#productos");
const carrito = seleccionar("#lista");
const total = seleccionar("#total");
const btncart = seleccionar("#btn-cart");
const carroCompras = seleccionar("#carrito");

// ------------------------- FUNCIONES -----------------------------//
const agregarProducto = function (evento) {
  evento.preventDefault();
  const elemento = evento.target.parentElement;
  const producto = Catalogo.find((producto) => producto.id == elemento.id);
  let cart = leer("carrito");
  const productInCart = cart.find((item) => item.id == elemento.id);
  if (!productInCart) {
    cart.push({ ...producto, cantidad: 1 });
    guardar("carrito", cart);
  }
  if (productInCart) {
    productInCart.cantidad += 1;
    guardar("carrito", cart);
  }
  return MostrarCarrito();
};
const aumentarCantidad = function (evento) {
  const elemento = evento.target.parentElement.parentElement;
  const producto = Catalogo.find(
    (producto) => producto.id == elemento.dataset.id
  );
  let cart = leer("carrito");
  const productInCart = cart.find((item) => item.id == producto.id);
  if (productInCart) {
    productInCart.cantidad += 1;
    guardar("carrito", cart);
  }
  return MostrarCarrito();
};
const reducirCantidad = function (evento) {
  const elemento = evento.target.parentElement.parentElement;
  const producto = Catalogo.find(
    (producto) => producto.id == elemento.dataset.id
  );
  let cart = leer("carrito");
  const productInCart = cart.find((item) => item.id == producto.id);
  if (productInCart) {
    productInCart.cantidad -= 1;
    if (productInCart.cantidad == 0) {
      cart = cart.filter((item) => item.id != productInCart.id);
    }
    guardar("carrito", cart);
  }
  return MostrarCarrito();
};

const MostrarCarrito = function () {
  const cart = leer("carrito");
  carrito.innerHTML = null;
  for (const item of cart) {
    const cardItem = crearElemento(
      "li",
      `<dl><dt>${item.nombre}</dt><img src="${item.imagen}"</dl>`,
      { "data-id": item.id }
    );
    const formItem = crearElemento("form", null);
    const btnAddItem = crearElemento("button", `+`, { type: "button" });
    btnAddItem.addEventListener("click", aumentarCantidad);
    const quantityItem = crearElemento(
      "output",
      `${item.cantidad} ($${item.cantidad * item.precio})`
    );
    const btnRemoveItem = crearElemento("button", `-`, { type: "button" });
    btnRemoveItem.addEventListener("click", reducirCantidad);
    formItem.append(btnAddItem, quantityItem, btnRemoveItem);
    cardItem.appendChild(formItem);
    carrito.appendChild(cardItem);
  }
  const calcTotal = cart
    .map((item) => item.cantidad * item.precio)
    .reduce((acumulado, valor) => (acumulado += valor), 0);
  total.innerHTML =
    calcTotal != 0
      ? `Total $${calcTotal} <button type="button" id="btn-comprar">Comprar</button>`
      : "No hay productos en el carrito";
};
MostrarCarrito();

const MostrarProductos = (productToShow) => {
  productos.innerHTML = null;
  for (const producto of productToShow) {
    const cardProduct = crearElemento(
      "li",
      `<dl><dt>${producto.nombre}</dt><img src="${producto.imagen}"><img><dd>${producto.descripcion}</dd><dd>$ ${producto.precio}</dd></dl>`,
      { id: producto.id }
    );
    const formProduct = crearElemento("form", `<button>agregar</button>`);
    formProduct.addEventListener("submit", agregarProducto);
    cardProduct.appendChild(formProduct);
    productos.appendChild(cardProduct);
  }
};
//---------------------------- Funcion para vaciar el carrito ----------------
const finalizarCompra = () => {
  alert("Gracias por tu compra!");
  localStorage.removeItem(`carrito`);
  window.location.reload();
};

total.addEventListener("click", finalizarCompra);

// ----------------------- FILTROS DE PRODUCTOS -------------------------- //
const btnTodos = seleccionar("#todos");
const btnInfusiones = seleccionar("#infusiones");
const btnPanaderia = seleccionar("#panaderia");

const filtrarProducto = (categoria) => {
  const productToShow = Catalogo.filter(
    (producto) => producto.categoria === categoria
  );
  MostrarProductos(productToShow);
};

btnTodos.addEventListener("click", () => {
  MostrarProductos(Catalogo);
});
btnInfusiones.addEventListener("click", () => {
  filtrarProducto("infusiones");
});
btnPanaderia.addEventListener("click", () => {
  filtrarProducto("panaderia");
});

MostrarProductos(Catalogo);

const toggleCart = () => {
  toggle(`#carrito`, `active`);
};
btncart.addEventListener(`click`, toggleCart);

//------------------------------------------- BOTON PARA DESPLEGAR NAVBAR MOVILE ---------------------------//
const btnMobileNav = seleccionar("#btn-mobile-nav");
const nav = seleccionar("#nav");

const mostrarMobileNav = () => {
  toggle(`#nav`, `active`);
};

btnMobileNav.addEventListener("click", mostrarMobileNav);

// ------------------------------------------- FORMULARIO DE REGISTRO ------------------------------------------//
const registerForm = seleccionar("#form-reserva");
const inputName = seleccionar("#Name");
const inputLastName = seleccionar("#LastName");
const inputEmail = seleccionar("#Email");
const inputPass = seleccionar("#Password");
const inputTel = seleccionar("#Telefono");

// Funcion para guardar a los usuarios en el localStorage
const saveUsers = (user) => {
  let users = JSON.parse(localStorage.getItem("usuarios")) || [];
  localStorage.setItem("usuarios", JSON.stringify([...users, user]));
  return user;
};

// Funcion para verificar que el input no este vacio
const isEmpty = (input) => {
  let value = input.value.trim();
  return value.length == 0;
};

// Funcion para determinar el largo del valor del input
const isBetween = (input, min, max) => {
  let value = input.value.trim();
  return value.length >= min && value.length <= max;
};

// Funcion para validar el email
const emailValid = (email = "") => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
};
// Funcion para ver si ya existe ese usuario
const existingUsers = (email) => {
  let users = JSON.parse(localStorage.getItem("usuarios")) || [];
  return users.some((user) => user.email == email.trim());
};

// Funcion para validar la contraseña
const passValid = (Password) => {
  const re =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/;
  return re.test(Password);
};

// funcion para validar el telefono
const phoneValid = (telefono) => {
  const re = /^[0-9]{10}$/;
  return re.test(telefono);
};

// Funcion de mostrar error
const showError = (input, menssage) => {
  const fieldset = input.parentElement;
  const error = fieldset.querySelector("span");
  fieldset.classList.remove("success");
  fieldset.classList.add("error");
  error.style.display = "block";
  error.innerText = menssage;
};

//funcion para mostrar valido el input
const showSuccess = (input) => {
  const fieldset = input.parentElement;
  const error = fieldset.querySelector("span");
  fieldset.classList.add("success");
  fieldset.classList.remove("error");
  error.style.display = "none";
  error.innerText = "";
};

// ---------------------- VALIDACIONES DE INPUTS -------------------------  //
// funcion para validar inputs tipo texto

const checkTextInput = (input) => {
  const minimo = 3;
  const maximo = 20;

  if (isEmpty(input)) {
    showError(input, "este campo es obligatorio");
    return false;
  }
  if (!isBetween(input, minimo, maximo)) {
    showError(
      input,
      `este campo debe tener entre ${minimo} y ${maximo} caracteres`
    );
    return false;
  }
  showSuccess(input);
  return true;
};

// funcion para validar email

const checkEmail = (input) => {
  false;
  if (isEmpty(input)) {
    showError(input, "Este campo es obligatorio");
    return false;
  }
  if (!emailValid(input.value)) {
    showError(input, "El email no es valido");
    return false;
  }
  if (existingUsers(input.value)) {
    showError(input, "Este email ya esta registrado");
    return false;
  }
  showSuccess(input);
  return true;
};

// Funcion para validar la contraseña
const checkPass = (input) => {
  if (isEmpty(input)) {
    showError(input, "Este campo es obligatorio");
    return false;
  }
  if (!passValid(input.value)) {
    showError(input, "la contraseña no cumple los requisitos");
    return false;
  }
  showSuccess(input);
  return true;
};

//Funcion para validar telefono
const checkPhone = (input) => {
  if (isEmpty(input)) {
    showError(input, "este campo es obligatorio");
    return false;
  }
  if (!phoneValid(input.value)) {
    showError(input, "el telefono no es valido");
    return false;
  }
  showSuccess(input);
  return true;
};
const clearStyles = () => {
  const fieldsets = [
    inputName.parentElement,
    inputLastName.parentElement,
    inputEmail.parentElement,
    inputPass.parentElement,
    inputTel.parentElement,
  ];

  fieldsets.forEach((fieldset) => {
    fieldset.classList.remove("success");
    fieldset.classList.remove("error");
  });
};

//funcion inicializadora para agregar los listener a los input
const validateForm = (e) => {
  e.preventDefault();
  let isNameValid = checkTextInput(inputName);
  let isLastNameValid = checkTextInput(inputLastName);
  let isEmailValid = checkEmail(inputEmail);
  let ispassValid = checkPass(inputPass);
  let isPhoneValid = checkPhone(inputTel);

  let isValidForm =
    isNameValid &&
    isLastNameValid &&
    isEmailValid &&
    ispassValid &&
    isPhoneValid;

  if (isValidForm) {
    saveUsers({
      name: inputName.value,
      lastName: inputLastName.value,
      email: inputEmail.value,
      password: inputPass.value,
      phone: inputTel.value,
    });
    alert(
      "te has registrado con exito, en unos minutos te enviaremos un mensaje"
    );
    registerForm.reset();
    clearStyles();
  }
};

registerForm.addEventListener("submit", validateForm);

inputName.addEventListener("input", () => checkTextInput(inputName));
inputLastName.addEventListener("input", () => checkTextInput(inputLastName));
inputEmail.addEventListener("input", () => checkEmail(inputEmail));
inputPass.addEventListener("input", () => checkPass(inputPass));
inputTel.addEventListener("input", () => checkPhone(inputTel));
