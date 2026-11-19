import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule, PaginatorModule],
  templateUrl: './app-paginator.html',
  styleUrl: './app-paginator.css',
})
export class AppPaginator {
  @Input() rows = 10;
  @Input() totalRecords = 0;
  @Input() rowsPerPageOptions = [10, 20, 30, 50];
  @Input() first = 0;
  @Input() dropdownAppendTo = 'body';
  @Input() showCurrentPageReport = true;
  @Input() currentPageReportTemplate = '{first} - {last} de {totalRecords}';

  @Output() pageChange = new EventEmitter<PaginatorState>();

  handlePageChange(event: PaginatorState) {
    this.pageChange.emit(event);
  }
}
