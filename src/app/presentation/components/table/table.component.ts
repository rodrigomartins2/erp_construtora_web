import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { Tabela } from 'src/app/presentation/components/table/models/tabela.model';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  @Input({ required: true }) origem!: Tabela<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort; 
  dataSource!: MatTableDataSource<any>;

  page = {
    totalRows: 0,
    offset: 0,
    orderBy: 'Descricao',
    orderDir: 'desc',
    pageSize: 8,
    currentPage: 0
  };

    protected colunas: string[] = [];

    public ngOnChanges(): void {      
        this.colunas = this.origem.colunas.map((coluna) => coluna.nome);

       



        // setTimeout(() => {
        //       this.paginator.pageIndex = this.page.currentPage;
        //       this.paginator.length = this.origem.dados.length;
        //     });
        //     this.dataSource.paginator = this.paginator;
        //     this.dataSource.sort = this.sort;
            
        
    }

      pageChanged(event: PageEvent) {
        this.page.pageSize = event.pageSize;
        this.page.currentPage = event.pageIndex;
        this.page.offset = event.pageIndex;
        //this.reloadTable();
      }

      sortData(sort: Sort) {    
        this.page.orderBy = sort.active;
        this.page.orderDir = sort.direction;
        //this.reloadTable();
      }

}
