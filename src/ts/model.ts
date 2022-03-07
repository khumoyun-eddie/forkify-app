import { API_KEY, API_URL, RES_PER_PAGE } from "./config";
import { getJSON } from "./helpers";

export interface State {
  recipe?: Recipe;
  search?: Search;
  bookmarks?: RecipeShort[];
}

export interface Recipe {
  id?: string;
  title: string;
  publisher: string;
  sourceUrl?: string;
  image?: string;
  servings: number;
  cookingTime?: number;
  ingredients: ObjectOfArray;
  bookmarked?: boolean;
  key?: string;
}

export interface RecipeShort {
  id?: string;
  title: string;
  publisher: string;
  image?: string;
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
      results: [],
      resultsPerPage: RES_PER_PAGE,
    },
    bookmarks: [],
  };
  constructor() {
    const storage = localStorage.getItem("bookmarks");
    if (storage) this.state.bookmarks = JSON.parse(storage);
  }

  private createRecipeObject = (data) => {
    const recipe = data;

    return {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
      ...(recipe.key && { key: recipe.key }),
    };
  };

  loadRecipe = async (id: string): Promise<void> => {
    try {
      const data = await getJSON(`${API_URL}${id}?key=${API_KEY}`, undefined);

      this.state.recipe = this.createRecipeObject(data.data.recipe);
    } catch (error) {
      console.log(`${error} 💥💥💥`);
      throw error;
    }
  };

  loadSearchResults = async (query: string): Promise<void> => {
    try {
      this.state.search.query = query;
      const { data } = await getJSON(
        `${API_URL}?search=${query}&key=${API_KEY}`,
        undefined
      );

      this.state.search.results = data.recipes.map((rec) => {
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

  getSearchResultsPage = (page = this.state.search.page): RecipeShort[] => {
    this.state.search.page = page;

    const start = (page - 1) * this.state.search.resultsPerPage; // 0
    const end = page * this.state.search.resultsPerPage; // 10

    return this.state.search.results.slice(start, end); // 0, 9
  };

  updateServings(newServings: number): void {
    this.state.recipe.ingredients.forEach((ing) => {
      if (typeof ing.quantity === "number") {
        ing.quantity =
          (ing.quantity * newServings) / this.state.recipe.servings;
      }
    });

    this.state.recipe.servings = newServings;
  }

  persistBookmarks = (): void => {
    localStorage.setItem("bookmarks", JSON.stringify(this.state.bookmarks));
  };

  addBookmark = (recipe: RecipeShort): void => {
    // Add bookmark
    this.state.bookmarks.push(recipe);

    // Mark current recipe as bookmark
    if (recipe.id === this.state.recipe.id) this.state.recipe.bookmarked = true;
    this.persistBookmarks();
  };

  deleteBookmark = (id: string): void => {
    // Delete bookmark
    const index = this.state.bookmarks.findIndex((el) => el.id === id);
    this.state.bookmarks.splice(index, 1);

    // Mark current recipe as NOT bookmarked
    if (id === this.state.recipe.id) this.state.recipe.bookmarked = false;
    this.persistBookmarks();
  };

  uploadRecipe = async (newRecipe: Recipe): Promise<void> => {
    try {
      const ingredients = Object.entries(newRecipe)
        .filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
        .map((ing) => {
          const ingArr = ing[1].split(",").map((el: string) => el.trim());
          if (ingArr.length !== 3)
            throw new Error(
              "Wrong ingredient format! Please use the correct format"
            );

          const [quantity, unit, description] = ingArr;

          return { quantity: quantity ? +quantity : null, unit, description };
        });

      const recipe = {
        title: newRecipe.title,
        source_url: newRecipe.sourceUrl,
        image_url: newRecipe.image,
        publisher: newRecipe.publisher,
        cooking_time: +newRecipe.cookingTime,
        servings: +newRecipe.servings,
        ingredients,
      };

      const data = await getJSON(`${API_URL}?key=${API_KEY}`, recipe);
      console.log("data:", data.data.recipe);

      this.state.recipe = this.createRecipeObject(data.data.recipe);
      // console.log(this.state.recipe);

      this.addBookmark(this.state.recipe);
    } catch (error) {
      throw error;
    }
  };
}
