import View from "./View";
import icons from "url:../../img/icons.svg";

class PaginationView {
  _parentEl = document.querySelector(".pagination");

  render(state) {
    this._clear();

    const markup = this._generateMarkup(state);

    this._parentEl.insertAdjacentHTML("beforeend", markup);
  }

  _generateMarkup(state) {
    const numPages = Math.ceil(state.results.length / state.resPerPage);

    if (state.page === 1 && numPages > 1)
      return `
        <button class="btn--inline pagination__btn--next" data-page="${
          state.page + 1
        }">
            <span>Page 2</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>`;

    if (state.page === numPages && numPages > 1)
      return `
        <button class="btn--inline pagination__btn--prev" data-page="${
          state.page - 1
        }">
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${state.page - 1}</span>
        </button>`;

    if (state.page > 1 && state.page < numPages)
      return `
        <button class="btn--inline pagination__btn--prev" data-page="${
          state.page - 1
        }">
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${state.page - 1}</span>
        </button>
        <button class="btn--inline pagination__btn--next" data-page="${
          state.page + 1
        }">
            <span>Page ${state.page + 1}</span>
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button> `;

    return "";
  }

  _clear() {
    this._parentEl.innerHTML = "";
  }

  addHandlerRender(handler) {
    this._parentEl.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--inline");
      handler(Number(btn.dataset.page));
    });
  }
}

export default new PaginationView();
