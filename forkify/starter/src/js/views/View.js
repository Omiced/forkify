import icons from "url:../../img/icons.svg";

export default class View {
  _data;
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  update(data) {
    this._data = data;
    //nuevo makup para comparar con el viejo y actualizar diferencias
    const newMarkup = this._generateMarkup();
    //guardando el nuevo markup como un objeto del doom para poder comparar
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll("*"));
    const currentElements = Array.from(
      this._parentElement.querySelectorAll("*")
    );
    //comparación de la lista de nodos
    newElements.forEach((newEl, i) => {
      const curEl = currentElements[i];
      //actualizando cambios en el texto
      if (
        !newEl.isEqualNode(curEl) &&
        //checamos el valor del primer nodo hijo del elemento para ver si contiene texto
        newEl.firstChild?.nodeValue.trim() !== ""
      ) {
        curEl.textContent = newEl.textContent;
      }
      //actualizando cambios de atributo
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach((attr) => {
          //actualizamos los atributos nuevos en los elementos actuales para poder seguir incrementando
          // las porciones
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }
  //spinner
  renderSpinner() {
    const markup = `
  <div class="spinner">
    <svg>
     <use href="${icons}#icon-loader"></use>
    </svg>
  </div>
  `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
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
      </div> 
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
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
      </div> 
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  addHandlerRender(handler) {
    ["hashchange", "load"].forEach((event) =>
      window.addEventListener(event, handler)
    );
  }
}
