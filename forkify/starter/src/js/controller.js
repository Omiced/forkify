import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";
import { MODAL_CLOSE_SEC } from "./config.js";
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

if (module.hot) {
  module.hot.accept();
}

//show recipe function
const controlRecipes = async function () {
  try {
    //obteniendo id del url
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    //update results view to mark selected result
    resultsView.update(model.getSearchResultsPage());
    //updating bookmark
    bookmarksView.update(model.state.bookmarks);
    //load recipe
    await model.loadRecipe(id);
    //renderin recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    //obteniendo la busqueda
    const query = searchView.getQuery();
    if (!query) return;
    resultsView.renderSpinner();
    //obteniendo resultados
    await model.loadSearchResults(query);
    //renderizando resultados
    resultsView.render(model.getSearchResultsPage());
    //renderizando la paginación inicial
    paginationView.render(model.state.search);
    //manejando eventos
  } catch (error) {
    console.log(error);
  }
};
const controlPagination = function (goToPage) {
  //renderizando nuevos resultados
  resultsView.render(model.getSearchResultsPage(goToPage));
  //renderizando nuevos botones
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //actualizar las porciones de la receta
  model.updateServings(newServings);
  //actualizar la vista
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //agregar o quitar marcador
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  //actualizar la interfaz
  recipeView.update(model.state.recipe);
  //renderizar los marcadores
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //show loading spinner
    addRecipeView.renderSpinner();
    //cargando la nueva receta
    await model.uploadRecipe(newRecipe);
    //renderizando la nueva receta
    recipeView.render(model.state.recipe);
    //success message
    addRecipeView.renderMessage();
    //render bookmarks view
    bookmarksView.render(model.state.bookmarks);
    //cambiando el id del url
    window.history.pushState(null, "", `#${model.state.recipe.id}`);
    //close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    addRecipeView.renderError(error.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHanlderSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHanlderUpload(controlAddRecipe);
};

init();
