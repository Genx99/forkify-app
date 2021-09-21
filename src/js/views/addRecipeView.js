import icons from "url:../../img/icons.svg";

class AddRecipeView {
  _parentEl = document.querySelector(".upload");
  _window = document.querySelector(".add-recipe-window");
  _overlay = document.querySelector(".overlay");
  _btnOpen = document.querySelector(".nav__btn--add-recipe");
  _btnClose = document.querySelector(".btn--close-modal");
  _btnUpload = document.querySelector(".upload__btn");

  constructor() {
    this._addHandlerBtnOpen();
    this._addHandlerBtnClose();
  }

  _clearForm() {
    this._window.querySelectorAll("input").forEach((inp) => (inp.value = ""));
  }

  toggleWindow() {
    this._window.classList.toggle("hidden");
    this._overlay.classList.toggle("hidden");
    //this._clearForm();
  }

  _addHandlerBtnOpen() {
    this._btnOpen.addEventListener("click", this.toggleWindow.bind(this));
  }

  _addHandlerBtnClose() {
    this._btnClose.addEventListener("click", this.toggleWindow.bind(this));
    this._overlay.addEventListener("click", this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentEl.addEventListener("submit", function (e) {
      e.preventDefault();

      const dataArr = [...new FormData(this)];

      const data = Object.fromEntries(dataArr);

      handler(data);
    });
  }
}

export default new AddRecipeView();
