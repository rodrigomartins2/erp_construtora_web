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
import { RouterModule } from '@angular/router';
import { Configuracao } from 'src/app/core/utils/configuracao';
import { ProdutoDescricaoFiltroGridViewModel } from 'src/app/core/models/produto-descricao.models';
import { ProdutoDescricaoFacade } from 'src/app/application/facade/produto-descricao.facade';
import { AlertService } from 'src/app/presentation/services-ui/alert.service';
import { SelectDropModel } from 'src/app/core/models/generics.models';
import { EllipsisPipe } from 'src/app/presentation/shared/pipes/ellipsis.pipe';
import { EstoqueProdutoFacade } from 'src/app/application/facade/estoque-produto.facade';
import { EstoquePessoaFacade } from 'src/app/application/facade/estoque-pessoa.facade';
import { EstoqueProdutoFiltroGridViewModel } from 'src/app/core/models/estoque-produto.models';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-estoque-list',
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
    SelectModule,
    TooltipModule
  ],
    templateUrl: './estoque-list.component.html',
    styleUrls: ['./estoque-list.component.css']
})
export class EstoqueListComponent {
  dadosUsuario = new Configuracao().recuperarDados();
  filtroAberto = true;
  myform!: FormGroup;
  listProduto: SelectDropModel[] = [];
  listEstoque: SelectDropModel[] = [];
  page = {
    totalRows: 0,
    offset: 0,
    orderBy: 'SubProduto',
    orderDir: 'desc',
    pageSize: 10,
    currentPage: 0,
  };

  listaSituacao: any[] = [
    { codigo: 'A', descricao: 'Ativo' },
    { codigo: 'I', descricao: 'Inativo' },
  ];

  pageSizeOptions: number[] = [5, 10, 25, 100];

  displayedColumns: string[] = [
    'estoqueProdutoID',
    'nomeEstoque',
    'marcaDescricao',    
    'produtoDescricao',
    'subProduto',
    'unidadeMedidaDescricao',
    'qtdeMinima',
    'saldo',   
    'dataUltimaCompra',
    'situacao',
    'button',
  ];

  dataSource!: MatTableDataSource<ProdutoDescricaoFiltroGridViewModel>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private estoqueProdutoFacade: EstoqueProdutoFacade,
    private estoquePessoaFacade: EstoquePessoaFacade,
    private produtoDescricaoFacade: ProdutoDescricaoFacade,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.myform = new FormGroup({
      estoqueID: new FormControl(),
      produtoDescricaoID: new FormControl(),
      situacao: new FormControl(),
    });
    this.reloadTable();   
    this.onProduto();
    this.onEstoque();
   
  }

  sortData(sort: Sort) {
    this.page.orderBy = sort.active;
    this.page.orderDir = sort.direction;
    this.reloadTable();
  }

  reloadTable() {
    const dadosFormulario = this.myform.value;
 
    console.log(dadosFormulario)

    var dados = new EstoqueProdutoFiltroGridViewModel(
      dadosFormulario.estoqueID == null ? '0' : dadosFormulario.estoqueID,
      dadosFormulario.produtoDescricaoID == null ? '0' : dadosFormulario.produtoDescricaoID,
      dadosFormulario.situacao == null ? 'A' : dadosFormulario.situacao,
      this.page.offset.toString(),
      this.page.pageSize.toString(),
      this.page.orderBy,
      this.page.orderDir
    );

    this.estoqueProdutoFacade
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
        this.estoqueProdutoFacade
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

  onProduto() {
    this.estoqueProdutoFacade.getListEstoqueProdutoItens().subscribe((response) => {
      this.listProduto = response;
    });
  }

  onEstoque() {
    this.estoquePessoaFacade.getListEstoquePessoa().subscribe((response) => {
      this.listEstoque = response;
    });
  }
}
