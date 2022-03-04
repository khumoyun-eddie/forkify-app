import icons from '../../img/icons.svg'; // Parcel 1

export default abstract class View<T> {
  protected data!: T;
  protected abstract generateMarkup(): string;
  protected abstract parentElement: Element;
  protected errorMessage: string;
  protected message: string;

  protected clear(markup: string): void {
    this.parentElement.innerHTML = '';
    this.parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(updatedData: T): void {
    if (
      !updatedData ||
      (Array.isArray(updatedData) && updatedData.length === 0)
    )
      return this.renderError();

    this.data = updatedData;
    const newMarkup = this.generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);

    const newElements = Array.from(newDOM.querySelectorAll('*'));

    const curElements = Array.from(this.parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // Update changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      // Update changed ATTRIBUTE
      if (!newEl.isEqualNode(curEl)) {
        // console.log(Array.from(newEl.attributes));
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  render(recipeData: T, render: Boolean = true): void | string {
    if (!recipeData || (Array.isArray(recipeData) && recipeData.length === 0))
      return this.renderError();
    this.data = recipeData;

    const markup = this.generateMarkup();
    if (!render) return markup;

    this.clear(markup);
  }

  renderSpinner(): void {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `;
    this.clear(markup);
  }

  renderError(message = this.errorMessage): void {
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

    this.clear(markup);
  }

  renderMessage(message = this.message): void {
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

    this.clear(markup);
  }
}
