import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import {  RouterModule } from '@angular/router';
import { Configuracao } from 'src/app/core/utils/configuracao';
import { ProdutoDescricaoFiltroGridViewModel } from 'src/app/core/models/produto-descricao.models';
import { ProdutoDescricaoFacade } from 'src/app/application/facade/produto-descricao.facade';
import { AlertService } from 'src/app/presentation/services-ui/alert.service';
import { CategoriaFacade } from 'src/app/application/facade/categoria.facade';
import { SelectDropModel } from 'src/app/core/models/generics.models';
import { UnidadeMedidaFacade } from 'src/app/application/facade/unidade-medida.facade';
import { MarcaFacade } from 'src/app/application/facade/marca.facade';

import { ProdutoFacade } from 'src/app/application/facade/produto.facade';
import { EllipsisPipe } from 'src/app/presentation/shared/pipes/ellipsis.pipe';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-produtodescricao-list',
    imports: [
    FormsModule,
    EllipsisPipe,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    CommonModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    TooltipModule
  ],
    templateUrl: './produtodescricao-list.component.html',
    styleUrls: ['./produtodescricao-list.component.css']
})
export class ProdutodescricaoListComponent {
  dadosUsuario = new Configuracao().recuperarDados();
  filtroAberto = true;
  myform!: FormGroup;
  listCategoria: SelectDropModel[] = [];
  listMarca: SelectDropModel[] = [];
  listProduto: SelectDropModel[] = [];
  listUnidadeMedida: SelectDropModel[] = [];
  page = {
    totalRows: 0,
    offset: 0,
    orderBy: 'SubProduto',
    orderDir: 'desc',
    pageSize: 5,
    currentPage: 0,
  };

  listaSituacao: any[] = [
    { codigo: 'A', descricao: 'Ativo' },
    { codigo: 'I', descricao: 'Inativo' },
  ];

  pageSizeOptions: number[] = [5, 10, 25, 100];

  displayedColumns: string[] = [
    'produtoDescricaoID',
    'marcaDescricao',
    'unidadeMedidaDescricao',
    'produtoDescricao',
    'subProduto',
    'qtdeMinima',
    'saldo',
    'situacao',
    'dataUltimaCompra',
    'button',
  ];

  dataSource!: MatTableDataSource<ProdutoDescricaoFiltroGridViewModel>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private produtoDescricaoFacade: ProdutoDescricaoFacade,
    private categoriaFacade: CategoriaFacade,
    private unidadeMedidaFacade: UnidadeMedidaFacade,
    private marcaFacade: MarcaFacade,
    private produtoFacade: ProdutoFacade,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.myform = new FormGroup({
      marcaID: new FormControl(),
      produtoID: new FormControl(),
      categoriaID: new FormControl(),
      unidadeMedidaID: new FormControl(),
      subProduto: new FormControl(),
      situacao: new FormControl(),
    });
    this.reloadTable();
    this.onCategoria();
    this.onMarca();
    this.onProduto();
    this.onUnidadeMedida();
  }

  sortData(sort: Sort) {
    this.page.orderBy = sort.active;
    this.page.orderDir = sort.direction;
    this.reloadTable();
  }

  reloadTable() {
    const dadosFormulario = this.myform.value;
    var dados = new ProdutoDescricaoFiltroGridViewModel(
      dadosFormulario.marcaID == null ? '0' : dadosFormulario.marcaID,
      dadosFormulario.produtoID == null ? '0' : dadosFormulario.produtoID,
      dadosFormulario.categoriaID == null ? '0' : dadosFormulario.categoriaID,
      dadosFormulario.subProduto,
      dadosFormulario.situacao == null ? 'A' : dadosFormulario.situacao,
      this.page.offset.toString(),
      this.page.pageSize.toString(),
      this.page.orderBy,
      this.page.orderDir
    );

    this.produtoDescricaoFacade
      .getConsultarGrid(dados)
      .subscribe((response) => {
        if (response.result.length == 0) {
          this.alertService.showAlertInfo(
            'ProdutoDescricao',
            'Registros não encontrados!',
            '',
            '0'
          );
          // this.onResetCampos();
          // this.reloadTable();
        } else {          
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
      situacao: '',
    });

    this.reloadTable();
  }

  onExcluir(row: any) {
    const msg = row.status == 'Ativo' ? 'Inativar' : 'Ativar';
    const result$ = this.alertService.showConfirm(
      'Atenção',
      'Deseja ' + msg + ' o registro?',
      '',
      'Não',
      'Sim'
    );

    result$.asObservable().subscribe((dados) => {
      if (dados) {
        this.produtoDescricaoFacade
          .getDeleteID(row.ProdutoDescricaoID, this.dadosUsuario.usuarioID)
          .subscribe((data) => {
            if (data.executouServico == false) {
              this.alertService.showAlertWarning(
                'ProdutoDescricao',
                data.mensagemFalha,
                '',
                '0'
              );
            } else {
              this.alertService.showAlertSuccess(
                'ProdutoDescricao',
                data.mensagemSucesso,
                '',
                '0'
              );
              this.reloadTable();
            }
          });
      }
    });
  }

  onCategoria() {
    this.categoriaFacade.getListCategoria().subscribe((response) => {;
      this.listCategoria = response;
    });
  }

  onProduto() {
    this.produtoFacade.getListProduto().subscribe((response) => {
      this.listProduto = response;
    });
  }

  onUnidadeMedida() {
    this.unidadeMedidaFacade.getListUnidadeMedida().subscribe((response) => {
      this.listUnidadeMedida = response;
    });
  }

  onMarca() {
    this.marcaFacade.getListMarca().subscribe((response) => {
      this.listMarca = response;
    });
  } 
}
