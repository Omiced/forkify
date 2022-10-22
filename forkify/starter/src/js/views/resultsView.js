import View from "./View.js";
import previewView from "./previewView.js";
import icons from "url:../../img/icons.svg";

class ResultsView extends View {
  _parentElement = document.querySelector(".results");
  _errorMessage = `No recipes found for your query! Please try again.`;
  _message = "";
  _generateMarkup() {
    return (
      this._data
        //al fijar el segundo parametro de render, en false, esto devolvera un string
        // por lo que tendremos un array de strins que uniremos al final, dando
        //el mismo resultado que antes.
        .map((result) => previewView.render(result, false))
        .join("")
    );
    // return this._generateMarkupPreview();
  }
}

export default new ResultsView();
