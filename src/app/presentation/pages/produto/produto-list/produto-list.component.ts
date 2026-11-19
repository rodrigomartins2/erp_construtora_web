import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { RouterModule } from '@angular/router';
import { Configuracao } from 'src/app/core/utils/configuracao';
import { ProdutoFiltroGridViewModel } from 'src/app/core/models/produto.models';
import { ProdutoFacade } from 'src/app/application/facade/produto.facade';
import { AlertService } from 'src/app/presentation/services-ui/alert.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-produto-list',
    imports: [
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    CommonModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    RadioButtonModule,
    TooltipModule
  ],
    templateUrl: './produto-list.component.html',
    styleUrls: ['./produto-list.component.css']
})
export class ProdutoListComponent {
  dadosUsuario = new Configuracao().recuperarDados();
  filtroAberto = true;
  myform!: FormGroup; 
  page = {
    totalRows: 0,
    offset: 0,
    orderBy: 'Descricao',
    orderDir: 'desc',
    pageSize: 5,
    currentPage: 0
  };

  listaSituacao: any[] = [
    { codigo: 'A', descricao: 'Ativo' },
    { codigo: 'I', descricao: 'Inativo' }
  ];

  pageSizeOptions: number[] = [5, 10, 25, 100];

  displayedColumns: string[] = ['produtoID','descricaoProduto','situacao','button' ];

  dataSource!: MatTableDataSource<ProdutoFiltroGridViewModel>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
 
  constructor(private produtoFacade: ProdutoFacade,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.myform = new FormGroup({
      descricao: new FormControl(),
      situacao: new FormControl()
    });
    this.reloadTable();
  }

  sortData(sort: Sort) {    
    this.page.orderBy = sort.active;
    this.page.orderDir = sort.direction;
    this.reloadTable();
  }

  reloadTable() {
    const dadosFormulario = this.myform.value;  
    var dados = new ProdutoFiltroGridViewModel(      
      dadosFormulario.categoriaID == null ? 0 : dadosFormulario.categoriaID,
      dadosFormulario.descricao == null ? '' : dadosFormulario.descricao,
      dadosFormulario.situacao == null ? '' : dadosFormulario.situacao,
      this.page.offset.toString(),
      this.page.pageSize.toString(),
      this.page.orderBy,
      this.page.orderDir 
    )

    this.produtoFacade.getConsultarGrid(dados).subscribe(
      (response) => {        
        if (response.result.length == 0) {
          this.alertService.showAlertInfo('Produto', 'Registros não encontrados!', '', '0');
          //this.onResetCampos();
          //this.reloadTable(); 
        }
        else {
          this.dataSource = new MatTableDataSource(response.result);
          setTimeout(() => {
            this.paginator.pageIndex = this.page.currentPage;
            this.paginator.length = +response.totalRegistros;
          });
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      });
  }

  pageChanged(event: PageEvent) {
    this.page.pageSize = event.pageSize;
    this.page.currentPage = event.pageIndex;
    this.page.offset = event.pageIndex;
    this.reloadTable();
  }
  
  onResetCampos() {
    this.myform.reset({
      descricao: '',
      situacao: ''
    });

    this.reloadTable();
  }

  onExcluir(row: any) {
    const msg = row.status == 'Ativo' ? 'Inativar' : 'Ativar';
    const result$ = this.alertService.showConfirm('Atenção', 'Deseja ' + msg + ' o registro?', '', 'Não', 'Sim');

    result$.asObservable().subscribe(dados => {
      if (dados) {
        this.produtoFacade.getDeleteID(row.produtoID, this.dadosUsuario.usuarioID).subscribe(
          (data) => {         
            if (data.executouServico == false) {
              this.alertService.showAlertWarning('Produto', data.mensagemFalha, '', '0');
            }
            else {
              this.alertService.showAlertSuccess('Produto', data.mensagemSucesso, '', '0');
              this.reloadTable();
            }
          });
      }
    });
  }
}
