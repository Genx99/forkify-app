import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";
import View from "./views/View.js";

import "core-js/stable";
import "regenerator-runtime/runtime";

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.spinner();

    resultsView.update(model.getSearchResultsPage());

    await model.loadRecipe(id);

    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;

    resultsView.spinner();

    await model.loadSearchResults(query);

    if (model.state.search.results.length === 0) throw new Error("error");

    model.state.search.page = 1;

    resultsView.renderResults(model.getSearchResultsPage());

    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError();
  }
};

const controlPagination = function (n) {
  resultsView.spinner();
  resultsView.renderResults(model.getSearchResultsPage(n));
  paginationView.render(model.state.search);
};

const controlServings = function (updateTo) {
  model.updateServings(updateTo);

  recipeView.update(model.state.recipe);
};

const controlBookmarks = function () {
  if (!model.state.recipe.bookmarked || model.state.recipe.bookmarked === false)
    model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);

  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
};

const controlUpload = async function (recipe) {
  await model.uploadRecipe(recipe);
  recipeView.render(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
  window.history.pushState(null, "", `#${model.state.recipe.id}`);
  addRecipeView.toggleWindow();
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerRender(controlSearchResults);
  paginationView.addHandlerRender(controlPagination);
  recipeView.addHandlerUpdServ(controlServings);
  recipeView.addHandlerBook(controlBookmarks);
  addRecipeView.addHandlerUpload(controlUpload);
  bookmarksView.render(model.state.bookmarks);
};
init();
