import { Callback } from '../config';

export class SearchView {
  protected parentElement: Element = document.querySelector('.search');

  getQuery(): string {
    const searchField = this.parentElement.querySelector(
      '.search__field'
    ) as HTMLInputElement;
    const query: string = searchField.value;

    this.clearInput();
    return query;
  }

  protected clearInput(): void {
    const searchField = this.parentElement.querySelector(
      '.search__field'
    ) as HTMLInputElement;
    searchField.value = '';
  }

  addHandlerSearch(handler: Callback): void {
    this.parentElement.addEventListener('submit', e => {
      e.preventDefault();
      handler();
    });
  }
}
