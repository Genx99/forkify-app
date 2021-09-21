class Bookmark {
  _parentEl = document.querySelector(".bookmarks__list");
  _data;

  render(data) {
    this._data = data;

    this._clear();

    data.forEach((rec) =>
      this._parentEl.insertAdjacentHTML("afterbegin", this._generateMarkup(rec))
    );
  }

  _clear() {
    this._parentEl.innerHTML = "";
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
                </div>
                </a>
            </li>`;
  }
}

export default new Bookmark();
