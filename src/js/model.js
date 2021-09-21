import { GENERATOR } from "astring";
import { API_URL, RES_PER_PAGE, KEY } from "./config.js";
import { getJSON, sendJSON } from "./helpers.js";

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    page: 1,
    resPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

export const loadSearchResults = async function (query) {
  try {
    const data = await getJSON(`${API_URL}?search=${query}&key=${KEY}`);
    const { recipes } = data.data;

    state.search.query = query;
    state.search.results = recipes;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}?key=${KEY}`);

    const { recipe } = data.data;

    state.recipe = recipe;

    if (state.bookmarks.some((bm) => bm.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resPerPage;
  const end = page * state.search.resPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(
    (ing) =>
      (ing.quantity = (ing.quantity / state.recipe.servings) * newServings)
  );

  state.recipe.servings = newServings;
};

const setLocalStorage = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  setLocalStorage();
};

export const removeBookmark = function (id) {
  state.bookmarks = state.bookmarks.filter((bm) => bm.id !== id);

  if (id === state.recipe.id) state.recipe.bookmarked = false;

  setLocalStorage();
};

export const uploadRecipe = async function (upRecipe) {
  const ingredients = Object.entries(upRecipe)
    .filter((ent) => ent[0].startsWith("ingredient") && ent[1] !== "")
    .map((ing) => {
      const [quantity, unit, description] = ing[1]
        .replaceAll(" ", "")
        .split(",");

      return {
        quantity: quantity !== "" ? +quantity : null,
        unit,
        description,
      };
    });

  const newRecipe = {
    publisher: upRecipe.publisher,
    cooking_time: +upRecipe.cookingTime,
    image_url: upRecipe.image,
    ingredients: ingredients,
    servings: +upRecipe.servings,
    title: upRecipe.title,
    source_url: upRecipe.sourceUrl,
  };

  const data = await sendJSON(`${API_URL}?key=${KEY}`, newRecipe);

  const { recipe } = data.data;

  state.recipe = recipe;
  addBookmark(state.recipe);
};

const init = function () {
  const storage = JSON.parse(localStorage.getItem("bookmarks"));
  if (!storage) return;
  state.bookmarks = storage;
};
init();
