import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { Router, RouterModule } from '@angular/router';
import { Configuracao } from 'src/app/core/utils/configuracao';
import { PedidoCompraFiltroGridViewModel } from 'src/app/core/models/pedidocompra.models';
import { PedidoCompraFacade } from 'src/app/application/facade/pedido-compra.facade';
import { AlertService } from 'src/app/presentation/services-ui/alert.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-pedido-compra-list',
    imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    TooltipModule
  ],
    templateUrl: './pedido-compra-list.component.html',
    styleUrls: ['./pedido-compra-list.component.css']
})
export class PedidoCompraListComponent {
  dadosUsuario = new Configuracao().recuperarDados();
  filtroAberto = true;
  myform!: FormGroup;
  page = {
    totalRows: 0,
    offset: 0,
    orderBy: 'DataPedido',
    orderDir: 'desc',
    pageSize: 5,
    currentPage: 0
  };

  pageSizeOptions: number[] = [5, 10, 25, 100];

  displayedColumns: string[] = ['pedidoCompraID','clienteFornecedor','dataPedido','dataAprovacao',
                                'dataCotacao','valorTotal','totalItens', 'button' ];

  dataSource!: MatTableDataSource<PedidoCompraFiltroGridViewModel>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
 
  constructor(private PedidoCompraFacade: PedidoCompraFacade, private router: Router, 
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.myform = new FormGroup({
      pessoaID: new FormControl(),
      numeroPedido: new FormControl(),
      estoqueID: new FormControl(),
      obraID: new FormControl(),
      dataPedidoInicio: new FormControl(),
      dataPedidoFim: new FormControl(),
      dataAprovacaoInicio: new FormControl(),
      dataAprovacaoFim: new FormControl()
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
    var dados = new PedidoCompraFiltroGridViewModel(      
      dadosFormulario.pessoaID == null ? '' : dadosFormulario.pessoaID,      
      dadosFormulario.numeroPedido == null ? '' : dadosFormulario.numeroPedido,
      dadosFormulario.estoqueID == null ? '' : dadosFormulario.estoqueID,
      dadosFormulario.obraID == null ? '' : dadosFormulario.obraID,
      dadosFormulario.dataPedidoInicio == null ? '' : dadosFormulario.dataPedidoInicio,
      dadosFormulario.dataPedidoFim == null ? '' : dadosFormulario.dataPedidoFim,
      dadosFormulario.dataAprovacaoInicio == null ? '' : dadosFormulario.dataAprovacaoInicio,
      dadosFormulario.dataAprovacaoFim == null ? '' : dadosFormulario.dataAprovacaoFim,
      this.page.offset.toString(),
      this.page.pageSize.toString(),
      this.page.orderBy,
      this.page.orderDir 
    )

    this.PedidoCompraFacade.getConsultarGrid(dados).subscribe(
      (response) => {        
        if (response.result.length == 0) {
          this.alertService.showAlertInfo('PedidoCompra', 'Registros não encontrados!', '', '0');
          // this.onResetCampos();
          // this.reloadTable();
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
        this.PedidoCompraFacade.getDeleteID(row.PedidoCompraID, this.dadosUsuario.usuarioID).subscribe(
          (data) => {         
            if (data.executouServico == false) {
              this.alertService.showAlertWarning('PedidoCompra', data.mensagemFalha, '', '0');
            }
            else {
              this.alertService.showAlertSuccess('PedidoCompra', data.mensagemSucesso, '', '0');
              this.reloadTable();
            }
          });
      }
    });
  }
}
