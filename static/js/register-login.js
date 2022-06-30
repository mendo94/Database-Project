"use strict";

const registrationModal = document.querySelector(".registration-menu");
const loginModal = document.querySelector(".login-menu");
const overlay = document.querySelector(".overlay");
const overlayLogin = document.querySelector(".login-overlay");
const btnCloseModal = document.querySelector(".close-modal");
const btnCloseLoginModal = document.querySelector(".close-login-modal");
const btnsOpenModal = document.querySelectorAll(".show-modal");
const btnLoginModal = document.querySelectorAll(".show-login-modal");

const openModal = function (registerPageId, registerOverlayId) {
  document.getElementById(registerPageId).classList.remove("hidden");
  document.getElementById(registerOverlayId).classList.remove("hidden");
};

const closeModal = function (registerPageId, registerOverlayId) {
  document.getElementById(registerPageId).classList.add("hidden");
  document.getElementById(registerOverlayId).classList.add("hidden");
};

const openLoginModal = function (loginPageId, loginOverlayId) {
  document.getElementById(loginPageId).classList.remove("hidden");
  document.getElementById(loginOverlayId).classList.remove("hidden");
};

const closeLoginModal = function (loginPageId, loginOverlayId) {
  document.getElementById(loginPageId).classList.add("hidden");
  document.getElementById(loginOverlayId).classList.add("hidden");
};

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !document.getElementById('registrationMenu').classList.contains("hidden")) {
    closeModal('registrationMenu', 'registrationOverlay');
  }
  if (e.key === "Escape" && !document.getElementById('loginMenu').classList.contains("hidden")) {
    closeLoginModal('loginMenu', 'loginOverlay');
  }
});
