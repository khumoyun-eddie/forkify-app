import { Model } from './model';
import { BookmarksView } from './views/bookmarksView';
import { PaginationView } from './views/pagination';
import { RecipeView } from './views/recipeView';
import ResultsView from './views/resultsView';
import { SearchView } from './views/searchView';

export class Controller {
  model: Model;
  recipeView: RecipeView;
  resultsView: ResultsView;
  searchView: SearchView;
  paginationView: PaginationView;
  bookmarksView: BookmarksView;

  constructor() {
    this.model = new Model();
    this.recipeView = new RecipeView();
    this.resultsView = new ResultsView();
    this.searchView = new SearchView();
    this.paginationView = new PaginationView();
    this.bookmarksView = new BookmarksView();

    this.bookmarksView.addHandlerRender(this.controlBookmarks);
    this.recipeView.addHandlerRender(this.controlRecipes);
    this.recipeView.addHandlerUpdateServings(this.controlServings);
    this.recipeView.addHandlerAddBookmark(this.controlAddBookmark);

    this.searchView.addHandlerSearch(this.controlSearchResults);
    this.paginationView.addHandlerClick(this.controlPagination);
  }
  controlRecipes = async (): Promise<void> => {
    try {
      const id: string = window.location.hash.slice(1);

      if (!id) return;
      this.recipeView.renderSpinner();

      await this.model.loadRecipe(id);

      this.recipeView.render(this.model.state.recipe);
    } catch (error) {
      console.log(`controller.ts - ${error}`);
    }
  };

  controlSearchResults = async (): Promise<void> => {
    try {
      this.resultsView.renderSpinner();
      // 1) Get search query
      const query: string = this.searchView.getQuery();

      if (!query) return;

      // 2) Load search results
      await this.model.loadSearchResults(query);

      // 3) Render result
      this.resultsView.render(this.model.getSearchResultsPage());

      this.paginationView.render(this.model.state.search);
    } catch (error) {
      console.log(error);
    }
  };

  controlPagination = (gotoPage: number): void => {
    this.resultsView.render(this.model.getSearchResultsPage(gotoPage));
    this.paginationView.render(this.model.state.search);
  };

  controlServings = (newServings: number): void => {
    // Update the recipe servings (in state)
    this.model.updateServings(newServings);

    // Update the recipe view
    // recipeView.render(model.state.recipe);
    this.recipeView.update(this.model.state.recipe);
  };

  controlAddBookmark = (): void => {
    // Add/remove bookmark
    if (!this.model.state.recipe.bookmarked)
      this.model.addBookmark(this.model.state.recipe);
    else this.model.deleteBookmark(this.model.state.recipe.id);
    // console.log(model.state.recipe);

    // 2) Update recipe view
    this.recipeView.update(this.model.state.recipe);

    // 3) Render bookmarks
    this.bookmarksView.render(this.model.state.bookmarks);
  };

  controlBookmarks = (): void => {
    this.bookmarksView.render(this.model.state.bookmarks);
  };
}

new Controller();
