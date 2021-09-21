import View from "./View";
import icons from "url:../../img/icons.svg";
import { Fraction } from "fractional";

class RecipeView extends View {
  _parentEl = document.querySelector(".recipe");
  _data;
  _errorMessage = "We couldn not find this recipe. Please try another one!";
  _message = "";

  render(data) {
    this._data = data;

    this._clear();

    const markup = this._generateMarkup();
    this._parentEl.insertAdjacentHTML("beforeend", markup);
  }

  addHandlerRender(handler) {
    ["hashchange", "load"].forEach((ev) =>
      window.addEventListener(ev, handler)
    );
  }

  addHandlerUpdServ(handler) {
    this._parentEl.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--tiny");

      if (!btn) return;
      if (btn.dataset.srvs === "0") return;

      handler(Number(btn.dataset.srvs));
    });
  }

  addHandlerBook(handler) {
    this._parentEl.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--round");

      if (!btn) return;

      handler();
    });
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>`;

    this._clear();

    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>`;

    this._clear();

    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }

  update(data) {
    this._data = data;

    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);

    const newElements = Array.from(newDOM.querySelectorAll("*"));

    const curElements = Array.from(this._parentEl.querySelectorAll("*"));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ""
      )
        curEl.textContent = newEl.textContent;

      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach((attr) =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  _clear() {
    this._parentEl.innerHTML = "";
  }

  _generatePropIconMarkup() {
    return `
      <svg>
        <use href="${icons}#icon-user"></use>
      </svg>
    `;
  }

  _generateMarkup() {
    return `
    <figure class="recipe__fig">
        <img src=${this._data.image_url} crossorigin="anonymous" alt=${
      this._data.title
    } class="recipe__img" />
        <h1 class="recipe__title">
        <span>${this._data.title}</span>
        </h1>
    </figure>

    <div class="recipe__details">
      <div class="recipe__info">
        <svg class="recipe__info-icon">
            <use href="${icons}#icon-clock"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">45</span>
        <span class="recipe__info-text">minutes</span>
      </div>
      
      <div class="recipe__info">
        <svg class="recipe__info-icon">
            <use href="${icons}#icon-users"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${
          this._data.servings
        }</span>
        <span class="recipe__info-text">servings</span>

        <div class="recipe__info-buttons">
          <button class="btn--tiny btn--update-servings" data-srvs = "${
            this._data.servings - 1
          }">
            <svg>
              <use href="${icons}#icon-minus-circle"></use>
            </svg>
          </button>
          <button class="btn--tiny btn--update-servings" data-srvs = "${
            this._data.servings + 1
          }">
            <svg>
                <use href="${icons}#icon-plus-circle"></use>
            </svg>
          </button>
        </div>
      </div>

        <div class="recipe__user-generated ${this._data.key ? "" : "hidden"}">
          ${this._data.key ? this._generatePropIconMarkup() : ""}
        </div>
        <button class="btn--round">
        <svg class="">
            <use href="${icons}#icon-bookmark${
      this._data.bookmarked === true ? "-fill" : ""
    }"></use>
        </svg>
        </button>
    </div>

    <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">
        ${this._generateMarkupIng()}
        </ul>
    </div>

    <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__publisher">${
          this._data.publisher
        }</span>. Please check out
        directions at their website.
        </p>
        <a
        class="btn--small recipe__btn"
        href=${this._data.source_url}
        target="_blank"
        >
        <span>Directions</span>
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
        </svg>
        </a>
    </div>`;
  }

  _generateMarkupIng() {
    return this._data.ingredients
      .map((ing) => {
        return `
      <li class="recipe__ingredient">
          <svg class="recipe__icon">
          <use href="${icons}#icon-check"></use>
          </svg>
          <div class="recipe__quantity">${
            ing.quantity ? new Fraction(ing.quantity).toString() : ""
          }</div>
          <div class="recipe__description">
          <span class="recipe__unit">${ing.unit}</span>
          ${ing.description}
          </div>
      </li>
  `;
      })
      .join("")
      .replaceAll(null, "");
  }

  _generatePreviews() {
    return `<li class="preview">
              <a class="preview__link preview__link--active" href=#${recipe.id}>
                <figure class="preview__fig">
                  <img src=${recipe.image_url} crossorigin="anonymous" alt="${recipe.title}" />
                </figure>
                <div class="preview__data">
                  <h4 class="preview__title">${recipe.title}</h4>
                  <p class="preview__publisher">${recipe.publisher}</p>
                  <div class="preview__user-generated">
                    <svg>
                      <use href="${icons}#icon-user"></use>
                    </svg>
                  </div>
                </div>
              </a>
            </li>`;
  }
}

export default new RecipeView();
