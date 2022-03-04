import View from './View';
import icons from '../../img/icons.svg';
import { Search } from '../model';

export class PaginationView extends View<Search> {
  protected parentElement: Element = document.querySelector('.pagination');
  private curPage: number;

  addHandlerClick(handler: Function) {
    this.parentElement.addEventListener('click', function (e: Event) {
      const target = e.target as Element;
      const btn = target.closest('.btn--inline')! as HTMLButtonElement;

      if (!btn) return;

      const goto: number = +btn.dataset.goto;

      handler(goto);
    });
  }

  protected generateMarkup(): string {
    this.curPage = this.data.page;
    const numPages = Math.ceil(
      this.data.results.length / this.data.resultsPerPage
    );
    // console.log('numPages:', numPages);

    // Page 1, and there are other pages
    if (this.curPage === 1 && numPages > 1) {
      // return 'page 1, others
      return this.renderNextBtn();
    }

    // Last page
    if (this.curPage === numPages && numPages > 1) {
      // return 'last page'
      return this.renderPrevBtn();
    }

    // Other page
    if (this.curPage < numPages && this.curPage > 1) {
      // return 'other page'
      return `
          ${this.renderPrevBtn()}
          ${this.renderNextBtn()}
      `;
    }

    // Page 1, and there NO other pages
    // return 'only 1 page';
    return '';
  }

  private renderPrevBtn(): string {
    return `
    <button class="btn--inline pagination__btn--prev" data-goto="${
      this.curPage - 1
    }">
      <svg class="searchicon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${this.curPage - 1}</span>
    </button>
  `;
  }

  private renderNextBtn(): string {
    return `
        <button class="btn--inline pagination__btn--next" data-goto="${
          this.curPage + 1
        }">
          <span>Page ${this.curPage + 1}</span>
          <svg class="searchicon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
      `;
  }
}
