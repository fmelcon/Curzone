// =============================================================================
// Variables globales
// =============================================================================

const carrito = document.querySelector("#carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const listaCursos = document.querySelector("#lista-cursos");
const lista = document.querySelector(".lista");
const form = document.querySelector(".form");
const input = document.querySelector("#name");
const heroTextName = document.querySelector(".name");
let articulosCarrito = [];

cargarEventListeners();

function cargarEventListeners() {
  //Agrega un curso cuando apretas agregar al carrito
  listaCursos.addEventListener("click", agregarCurso);
  //Elimina un curso no deseado
  carrito.addEventListener("click", eliminarCurso);
  //pega la navigation bar
  window.addEventListener("scroll", stickyElement);
  //saluda si pones nombre
  form.addEventListener("submit", addName);

  //recupera datos del carrito 
  document.addEventListener("DOMContentLoaded", () => {
    articulosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];

    carritoHTML();
  });
}

$(".herotext").hide();
// jQuery(".herotext").hide(() => {
//   jQuery(".herotext").fadeIn(8000, () => {
//     jQuery(".herotext").fadeOut(10000);
//   });
// });

// =============================================================================
// Funciones
// =============================================================================

consoleText(
  [
    "Welcome Aboard",
    "Learn code with us", //Texto del HeroText
    "Best courses online",
    "What do you waiting for?",
    "HTML CSS JavaScript And More...",
  ],
  "text", // ID
  ["#ffc927"] //color
);

function consoleText(words, id, colors) {
  if (colors === undefined) colors = ["#fff"];
  let visible = true;
  let con = document.getElementById("console");
  let letterCount = 1;
  let x = 1;
  let waiting = false;
  let target = document.getElementById(id);
  target.setAttribute("style", "color:" + colors[0]);
  window.setInterval(function () {
    if (letterCount === 0 && waiting === false) {
      waiting = true;
      target.innerHTML = words[0].substring(0, letterCount);
      window.setTimeout(function () {
        let usedColor = colors.shift();
        colors.push(usedColor);
        let usedWord = words.shift();
        words.push(usedWord);
        x = 1;
        target.setAttribute("style", "color:" + colors[0]);
        letterCount += x;
        waiting = false;
      }, 600);//velocidad de espera luego de borrar y tipear denuevo
    } else if (letterCount === words[0].length + 1 && waiting === false) {
      waiting = true;
      window.setTimeout(function () {
        x = -1;
        letterCount += x;
        waiting = false;
      }, 2000);//tiempo de espera luego de tipear
    } else if (waiting === false) {
      target.innerHTML = words[0].substring(0, letterCount);
      letterCount += x;
    }
  }, 80);//velocidad de tipado
  window.setInterval(function () {
    if (visible === true) {
      con.className = "console-underscore hidden";
      visible = false;
    } else {
      con.className = "console-underscore";

      visible = true;
    }
  }, 400);
}

function addName(e) {
  e.preventDefault();
  heroTextName.innerText = input.value;
  input.value = "";
}

function stickyElement() {
  const navbar = document.querySelector("#headfix");
  const navbarHeight = getComputedStyle(navbar).height.split("px")[0];
  const scrollValue = window.scrollY;

  if (scrollValue > navbarHeight) {
    navbar.classList.add("is-fixed");
  } else if (scrollValue < navbarHeight) {
    navbar.classList.remove("is-fixed");
  }
}

function eliminarCurso(e) {
  e.preventDefault();
  if (e.target.classList.contains("borrar-curso")) {
    const cursoId = e.target.getAttribute("data-id");

    articulosCarrito = articulosCarrito.filter((curso) => curso.id !== cursoId);

    carritoHTML();
  }
}

function agregarCurso(e) {
  e.preventDefault();

  if (e.target.classList.contains("agregar-carrito")) {
    const cursoSeleccionado = e.target.parentElement.parentElement;
    leerDatosCurso(cursoSeleccionado);
  }
}

//Lee el HTML  y extrae el curso que le des click

function leerDatosCurso(curso) {
  //Crear  un objeto con el contenido del curso actual
  const infoCurso = {
    imagen: curso.querySelector("img").src,
    titulo: curso.querySelector("h4").textContent,
    precio: curso.querySelector(".precio").textContent.replace("$", ""),
    id: curso.querySelector("a").getAttribute("data-id"),
    cantidad: 1,
  };
  //Revisa si un elemento ya existe en el carrito
  const siExiste = articulosCarrito.some((curso) => curso.id === infoCurso.id);
  if (siExiste) {
    //actualiza la cantidad
    const cursos = articulosCarrito.forEach((curso) => {
      if (curso.id === infoCurso.id) {
        curso.cantidad++;
        return curso;
      } else {
        return curso;
      }
    });
  } else {
    //sino agrega el objeto al carrito
    articulosCarrito = [...articulosCarrito, infoCurso];
  }
  carritoHTML();
}

//imprime carrito en el HTML

function carritoHTML() {
  //limpia html antes de imprimir
  limpiarHTML();
  let totalCarrito = 0.0;
  articulosCarrito.forEach((curso) => {
    const row = document.createElement("tr");
    const total = curso.precio * curso.cantidad;
    const { imagen, titulo, precio, cantidad, id } = curso;
    row.innerHTML = `
            <td><img src="${imagen}"</td>
            <td>${titulo}</td>
            <td>$${precio}</td>
            <td>${cantidad}</td>
            <td>
                <a href="#" class="borrar-curso" data-id="${id}">X </a>
            </td>
            <td>
            $${total}
            </td>
            `;
    //agrega el HTML del carrito
    totalCarrito += total;
    contenedorCarrito.appendChild(row);
  });
  document.querySelector(
    "#totalCarrito"
  ).textContent = `$ ${totalCarrito.toFixed(2)}`;
  //agregar local storage
  sincronizarStorage();
}

function sincronizarStorage() {
  localStorage.setItem("carrito", JSON.stringify(articulosCarrito));
}

// Itera sobre el padre y va borrando los hijos 1 a 1 para luego imprimir
function limpiarHTML() {
  while (contenedorCarrito.firstChild) {
    contenedorCarrito.removeChild(contenedorCarrito.firstChild);
  }
}

//Llamar a la API

$.get("https://jsonplaceholder.typicode.com/posts/1/comments", (datos) => {
  for (let post of datos) {
    $("#comentarios").append(`<h2>${post.email}</h2>`);
  }
});

//Boton mostrar/ocultar con Jquery
$(document).ready(function () {
  $("#ocultarmails").click(function () {
    $("#comentarios").hide();
  });
  $("#vermails").click(function () {
    $("#comentarios").show();
  });
});
