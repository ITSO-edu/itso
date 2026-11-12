"use strict";

/* Menú móvil */
const burger = document.getElementById("burger");
const menu = document.getElementById("menu");

function alternarMenu(abrir) {
  menu.classList.toggle("abierto", abrir);
  burger.setAttribute("aria-expanded", String(abrir));
}
burger.addEventListener("click", () => alternarMenu(!menu.classList.contains("abierto")));
menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => alternarMenu(false)));

/* Carrusel de videos */
const carrusel = document.getElementById("carrusel");
document.getElementById("next").addEventListener("click", () =>
  carrusel.scrollBy({ left: carrusel.clientWidth, behavior: "smooth" }));
document.getElementById("prev").addEventListener("click", () =>
  carrusel.scrollBy({ left: -carrusel.clientWidth, behavior: "smooth" }));

/* Horario: resalta la columna del día actual (lunes a viernes) */
const dia = new Date().getDay();
if (dia >= 1 && dia <= 5) {
  document.querySelectorAll("#tabla-horario tr").forEach((fila) => {
    const celda = fila.classList.contains("receso") ? null : fila.children[dia];
    if (celda) celda.classList.add("hoy");
  });
}

/* Radio en línea */
const audio = new Audio();
audio.preload = "none";
audio.volume = 0.5;

const panel = document.getElementById("radio-panel");
const toggle = document.getElementById("radio-toggle");
const playBtn = document.getElementById("radio-play");
const vol = document.getElementById("radio-vol");
const estado = document.getElementById("radio-estado");
const emisoras = document.querySelectorAll(".emisora");
let activa = document.querySelector(".emisora.activa");

function icono(reproduciendo) {
  playBtn.innerHTML = `<i class="fas fa-${reproduciendo ? "pause" : "play"}"></i>`;
  playBtn.setAttribute("aria-label", reproduciendo ? "Pausar" : "Reproducir");
}

function reproducir() {
  if (!audio.src) audio.src = activa.dataset.src;
  estado.textContent = "Conectando…";
  audio.play().catch(() => {
    estado.textContent = "No se pudo reproducir esta emisora. Prueba con otra.";
    icono(false);
  });
}

toggle.addEventListener("click", () => {
  const abrir = panel.hidden;
  panel.hidden = !abrir;
  toggle.setAttribute("aria-expanded", String(abrir));
});

emisoras.forEach((boton) => {
  boton.addEventListener("click", () => {
    activa.classList.remove("activa");
    boton.classList.add("activa");
    activa = boton;
    audio.src = boton.dataset.src;
    reproducir();
  });
});

playBtn.addEventListener("click", () => (audio.paused ? reproducir() : audio.pause()));
vol.addEventListener("input", (e) => (audio.volume = e.target.value / 100));

audio.addEventListener("playing", () => { icono(true); estado.textContent = activa.textContent; });
audio.addEventListener("pause", () => icono(false));
audio.addEventListener("error", () => {
  if (audio.src) estado.textContent = "Emisora no disponible. Prueba con otra.";
  icono(false);
});
