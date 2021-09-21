class SearchView {
  _parentEl = document.querySelector(".search");
  _searchInput = document.querySelector(".search__field");

  getQuery() {
    return this._searchInput.value;
  }

  addHandlerRender(handler) {
    this._parentEl.addEventListener("submit", function (e) {
      e.preventDefault();

      handler();

      this.querySelector(".search__field").value = "";
      this.querySelector(".search__field").blur();
    });
  }
}

export default new SearchView();
