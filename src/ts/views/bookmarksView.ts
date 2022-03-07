import { Callback } from "../config";
import { RecipeShort } from "../model";
import { PreviewView } from "./previewView";
import View from "./View";

export class BookmarksView extends View<RecipeShort[]> {
  protected parentElement: Element = document.querySelector(".bookmarks__list");
  protected errorMessage: string =
    "No bookmarks yet, Find a nice recipe and bookmark it ;)";
  protected message: string = "";

  previewView: PreviewView = new PreviewView();

  addHandlerRender(handler: Callback): void {
    window.addEventListener("load", handler);
  }

  protected generateMarkup(): string {
    // return this._data.map(this._generateMarkupPreview).join('');
    return this.data
      .map((bookmark) => this.previewView.render(bookmark, false))
      .join("");
  }
}
