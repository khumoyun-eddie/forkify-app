import View from "./View";
import { RecipeShort } from "../model";

class ResultsView extends View<RecipeShort[]> {
  protected parentElement: HTMLUListElement =
    document.querySelector(".results");
  protected errorMessage: string =
    "No recipes found for your query! Please try again ;)";
  protected message: string = "";

  protected generateMarkup(): string {
    return this.data.map(this.generateMarkupPreview).join("");
  }

  protected generateMarkupPreview(result: RecipeShort): string {
    return `
    <li class="preview">
      <a class="preview__link" href="#${result.id}">
        <figure class="preview__fig">
          <img src="${result.image}" alt="${result.title}" />
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">${result.title}</h4>
          <p class="preview__publisher">${result.publisher}</p>
        </div>
      </a>
    </li>
  `;
  }
}

export default ResultsView;
