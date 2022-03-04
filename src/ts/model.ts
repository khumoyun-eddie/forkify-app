import axios, { AxiosPromise, AxiosResponse } from 'axios';
import { API_URL, RES_PER_PAGE } from './config';
import { getJSON } from './helpers';

export interface State {
  recipe?: Recipe;
  search?: Search;
  bookmarks?: Recipe[];
}

export interface Recipe {
  id: string;
  title: string;
  publisher: string;
  sourceUrl: string;
  image: string;
  servings: number;
  cookingTime: number;
  ingredients: ObjectOfArray;
  bookmarked?: boolean;
}

export interface Search {
  query?: string;
  results?: [];
  page?: number;
  resultsPerPage?: number;
}

type ObjectOfArray = { [key: string]: string | number }[];

export class Model {
  state: State = {
    search: {
      page: 1,
      resultsPerPage: RES_PER_PAGE,
    },
    bookmarks: [],
  };
  constructor() {
    const storage = localStorage.getItem('bookmarks');
    if (storage) this.state.bookmarks = JSON.parse(storage);
  }

  loadRecipe = async (id: string): Promise<void> => {
    try {
      const recipeReceived = await axios
        .get(`${API_URL}${id}`)
        .then((response: AxiosResponse) => {
          const { recipe } = response.data.data;
          return recipe;
        });

      this.state.recipe = {
        id: recipeReceived.id,
        title: recipeReceived.title,
        publisher: recipeReceived.publisher,
        sourceUrl: recipeReceived.source_url,
        image: recipeReceived.image_url,
        servings: recipeReceived.servings,
        cookingTime: recipeReceived.cooking_time,
        ingredients: recipeReceived.ingredients,
      };
    } catch (error) {
      console.log(`${error} 💥💥💥`);
      throw error;
    }
  };

  loadSearchResults = async (query: string): Promise<void> => {
    try {
      this.state.search.query = query;
      const { data } = await getJSON(`${API_URL}?search=${query}`);

      this.state.search.results = data.recipes.map(rec => {
        return {
          id: rec.id,
          title: rec.title,
          publisher: rec.publisher,
          image: rec.image_url,
        };
      });
    } catch (error) {
      console.error(`${error} 💥💥💥`);
      throw error;
    }
  };

  getSearchResultsPage(
    page = this.state.search.page
  ): { [key: string]: string }[] {
    this.state.search.page = page;

    const start = (page - 1) * this.state.search.resultsPerPage; // 0
    const end = page * this.state.search.resultsPerPage; // 10

    return this.state.search.results.slice(start, end); // 0, 9
  }

  updateServings(newServings: number): void {
    this.state.recipe.ingredients.forEach(ing => {
      if (typeof ing.quantity === 'number') {
        ing.quantity =
          (ing.quantity * newServings) / this.state.recipe.servings;
      }
      // newQty = oldQty * newServings / oldServings // 2 * 8 / 4 = 4
    });

    this.state.recipe.servings = newServings;
  }

  persistBookmarks = (): void => {
    localStorage.setItem('bookmarks', JSON.stringify(this.state.bookmarks));
  };

  addBookmark = (recipe: Recipe): void => {
    // Add bookmark
    this.state.bookmarks.push(recipe);

    // Mark current recipe as bookmark
    if (recipe.id === this.state.recipe.id) this.state.recipe.bookmarked = true;
    this.persistBookmarks();
  };

  deleteBookmark = (id: string): void => {
    // Delete bookmark
    const index = this.state.bookmarks.findIndex(el => el.id === id);
    this.state.bookmarks.splice(index, 1);

    // Mark current recipe as NOT bookmarked
    if (id === this.state.recipe.id) this.state.recipe.bookmarked = false;
    this.persistBookmarks();
  };
}
