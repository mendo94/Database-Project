"use strict";

const modal = document.querySelector(".registration-menu");
const loginModal = document.querySelector(".login-menu");
const overlay = document.querySelector(".overlay");
const overlayLogin = document.querySelector(".login-overlay");
const btnCloseModal = document.querySelector(".close-modal");
const btnCloseLoginModal = document.querySelector(".close-login-modal");
const btnsOpenModal = document.querySelectorAll(".show-modal");
const btnLoginModal = document.querySelectorAll(".show-login-modal");

const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

const openLoginModal = function () {
  loginModal.classList.remove("hide");
  overlayLogin.classList.remove("hide");
};

const closeLoginModal = function () {
  loginModal.classList.add("hide");
  overlayLogin.classList.add("hide");
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener("click", openModal);

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

for (let i = 0; i < btnLoginModal.length; i++)
  btnLoginModal[i].addEventListener("click", openLoginModal);

btnCloseLoginModal.addEventListener("click", closeLoginModal);
overlayLogin.addEventListener("click", closeLoginModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hide")) {
    closeLoginModal();
  }
});

window.onload = openLoginModal;
