import { CommonModule, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  TemplateRef,
  ViewChild,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { CheckboxModule } from 'primeng/checkbox';
import { CarouselPageEvent } from 'primeng/types/carousel';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import {
  GenericsTableAction,
  GenericsTableColumn,
} from '../../generics-table/generics-table.models';

@Component({
  selector: 'app-generics-table-base-mobile',
  standalone: true,
  imports: [
    CommonModule,
    NgTemplateOutlet,
    FormsModule,
    ButtonModule,
    CarouselModule,
    CheckboxModule,
    PaginatorModule,
    SkeletonModule,
    TooltipModule,
  ],
  templateUrl: './generics-table-base-mobile.html',
  styleUrl: './generics-table-base-mobile.css',
})
export class GenericsTableBaseMobileComponent<T> implements OnChanges {
  @Input({ required: true }) columns: GenericsTableColumn<T>[] = [];
  @Input({ required: true }) data: T[] = [];
  @Input() actions: GenericsTableAction<T>[] = [];
  @Input() cardTemplate?: TemplateRef<unknown>;
  @Input() loading = false;
  @Input() totalRecords = 0;
  @Input() rows = 5;
  @Input() first = 0;
  @Input() skeletonRowCount = 5;
  @Input() emptyMessage = 'Nenhum registro encontrado.';
  @Input() cardTitleField?: string;
  @Input() selectionEnabled = false;
  @Input() selectionMode: 'single' | 'multiple' = 'multiple';
  @Input() isRowSelected?: (row: T) => boolean;
  @Input() onToggleRow?: (row: T, checked: boolean) => void;

  @Input() getDisplayValue = (_row: T, _column: GenericsTableColumn<T>): string => '';
  @Input() getVisibleActions = (_row: T): GenericsTableAction<T>[] => [];

  @Output() pageChange = new EventEmitter<PaginatorState>();

  readonly carouselPage = signal(0);

  @ViewChild('carouselRegion') carouselRegion?: ElementRef<HTMLElement>;

  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 1,
      numScroll: 1,
    },
  ];

  ngOnChanges(): void {
    this.changeCarouselPage(Math.min(this.carouselPage(), Math.max(0, this.data.length - 1)));
  }

  onPageChange(event: PaginatorState): void {
    this.pageChange.emit(event);
  }

  onCarouselPageChange(event: CarouselPageEvent): void {
    this.changeCarouselPage(event.page ?? 0);
  }

  onCarouselKeydown(event: KeyboardEvent): void {
    const target = event.target;
    if (
      !(target instanceof HTMLElement) ||
      (target !== this.carouselRegion?.nativeElement && !target.classList.contains('card-item'))
    ) {
      return;
    }

    if (['Enter', ' ', 'ArrowRight', 'ArrowLeft'].includes(event.key)) {
      event.preventDefault();
      if (event.key === 'ArrowLeft') {
        this.goToPreviousCard();
      } else {
        this.goToNextCard();
      }
    }
  }

  private changeCarouselPage(page: number): void {
    if (page === this.carouselPage()) {
      return;
    }

    const region = this.carouselRegion?.nativeElement;
    const activeElement = region?.ownerDocument.activeElement;
    // Move focus before PrimeNG hides the outgoing slide, including swipe navigation.
    if (
      region &&
      activeElement &&
      region.contains(activeElement) &&
      activeElement.closest('.p-carousel-item')
    ) {
      region.focus({ preventScroll: true });
    }

    this.carouselPage.set(page);
  }

  onCardClick(event: MouseEvent): void {
    const cardElement = event.currentTarget as HTMLElement | null;

    if (!cardElement) {
      return;
    }

    const cardBounds = cardElement.getBoundingClientRect();
    const clickedLeftSide = event.clientX < cardBounds.left + cardBounds.width / 2;

    if (clickedLeftSide) {
      this.goToPreviousCard();
      return;
    }

    this.goToNextCard();
  }

  goToNextCard(): void {
    if (!this.canGoToNextCard) {
      return;
    }

    this.changeCarouselPage(this.carouselPage() + 1);
  }

  goToPreviousCard(): void {
    if (!this.canGoToPreviousCard) {
      return;
    }

    this.changeCarouselPage(this.carouselPage() - 1);
  }

  get canGoToPreviousCard(): boolean {
    return this.carouselPage() > 0;
  }

  get canGoToNextCard(): boolean {
    return this.carouselPage() < this.data.length - 1;
  }

  get cardTitleColumn(): GenericsTableColumn<T> | undefined {
    if (this.cardTitleField) {
      return this.columns.find((column) => column.field === this.cardTitleField);
    }

    return this.columns[0];
  }

  getCardBodyColumns(): GenericsTableColumn<T>[] {
    const titleField = this.cardTitleColumn?.field;

    if (!titleField) {
      return this.columns;
    }

    return this.columns.filter((column) => column.field !== titleField);
  }

  trackByIndex(index: number): number {
    return index;
  }
}
