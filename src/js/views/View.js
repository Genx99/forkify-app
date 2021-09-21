import icons from "url:../../img/icons.svg";

export default class View {
  spinner() {
    const html = `
                <div class="spinner">
                  <svg>
                    <use href="${icons}#icon-loader"></use>
                  </svg>
                </div>`;

    this._clear();

    this._parentEl.insertAdjacentHTML("afterbegin", html);
  }
}
