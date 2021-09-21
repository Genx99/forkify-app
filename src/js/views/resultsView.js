import View from "./View";

import icons from "url:../../img/icons.svg";

class ResultsView extends View {
  _parentEl = document.querySelector(".search-results");
  _results = document.querySelector(".results");
  _errorMessage = "No recipes found for your query! Please try again ;)!";
  _data;

  renderResults(recArr) {
    this._clear();
    this._parentEl.querySelector(".spinner").remove();
    recArr.forEach((rec) => {
      const markup = this._generateMarkup(rec);
      this._results.insertAdjacentHTML("beforeend", markup);
    });
  }
 
  _generateMarkup(rec) {
    return `
            <li class="preview">
                <a class="preview__link ${
                  rec.id === window.location.hash.slice(1)
                    ? "preview__link--active"
                    : ""
                }" href=#${rec.id}>
                <figure class="preview__fig">
                    <img src="${rec.image_url}" alt="${
      rec.title
    }" crossorigin />
                </figure>
                <div class="preview__data">
                    <h4 class="preview__title">${rec.title}</h4>
                    <p class="preview__publisher">${rec.publisher}</p>
                    ${
                      rec.key
                        ? `
                    <div class="preview__user-generated">
                      <svg>
                        <use href="${icons}#icon-user"></use>
                      </svg>
                    </div>`
                        : ""
                    }
                </div>
                </a>
            </li>`;
  }

  _clear() {
    this._results.innerHTML = "";
  }

  update(data) {
    this._data = data;

    const newMarkup = this._data.map(this._generateMarkup).join("");

    const newDOM = document.createRange().createContextualFragment(newMarkup);

    const newElements = Array.from(newDOM.querySelectorAll("*"));

    const curElements = Array.from(this._results.querySelectorAll("*"));

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

    this._parentEl.querySelector(".spinner").remove();
    this._clear();

    this._results.insertAdjacentHTML("afterbegin", markup);
  }
}

export default new ResultsView();
