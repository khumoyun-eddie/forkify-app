import { Recipe } from '../model';
import View from './View';

export class PreviewView extends View<Recipe> {
  protected parentElement: Element;
  generateMarkup(): string {
    const id = window.location.hash.slice(1);
    return ` 
    <li class="preview">
      <a class="preview__link ${
        this.data.id === id ? 'preview__link--active' : ''
      }" href="#${this.data.id}">
        <figure class="preview__fig">
          <img src="${this.data.image}" alt="${this.data.title}" />
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">${this.data.title}</h4>
          <p class="preview__publisher">${this.data.publisher}</p>
        </div>
      </a>
    </li>
  `;
  }
}
