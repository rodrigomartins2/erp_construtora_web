import { take } from 'rxjs';
import { ModalFitroEntradasaidaService } from 'src/app/presentation/pages/entradasaida/modal-fitro-entradasaida/modal-fitro-entradasaida.service';
import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Configuracao } from 'src/app/core/utils/configuracao';
import {  
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
import { EntradaSaidaFacade } from 'src/app/application/facade/entrada-saida.facade';
import { AlertService } from 'src/app/presentation/services-ui/alert.service';
import { Router, RouterModule } from '@angular/router';
import {
  EntradaSaidaFiltroGridViewModel,
  FiltroModalEntradaSaidaViewModel,
} from 'src/app/core/models/entrada-saida.models';
import { FuncionalidadeEnum } from 'src/app/core/enums/funcionalidade.enum';
import { ModalFitroEntradasaidaComponent } from 'src/app/presentation/pages/entradasaida/modal-fitro-entradasaida/modal-fitro-entradasaida.component';
import { ModalRef, ModalService } from 'src/app/presentation/services-ui/modal.service';
import { BreakcrumbComponent } from 'src/app/presentation/components/breadcrumb/breakcrumb.component';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-entradasaida-list',
    imports: [
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    CommonModule,
    RouterModule,
    BreakcrumbComponent,
    ButtonModule,
    TooltipModule
  ],
    templateUrl: './entradasaida-list.component.html',
    styleUrls: ['./entradasaida-list.component.css']
})
export class EntradasaidaListComponent {
  dadosUsuario = new Configuracao().recuperarDados();
  myform!: FormGroup;  
  page = {
    totalRows: 0,
    offset: 0,
    orderBy: 'DataEmissao',
    orderDir: 'desc',
    pageSize: 8,
    currentPage: 0,
  };

  pageSizeOptions: number[] = [5, 10, 25, 100];
  displayedColumns: string[] = [
    'entradaSaidaID',
    'operacao',
    'numeroNota',
    'clienteFornecedor',
    'dataMovimento',
    'movimentacaoRealizada',
    'valorTotal',
    'button',
  ];

  dataSource!: MatTableDataSource<EntradaSaidaFiltroGridViewModel>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  modalFiltro? = new ModalRef<ModalFitroEntradasaidaComponent>();
  filtro: FiltroModalEntradaSaidaViewModel;

  constructor(
    private entradaSaidaFacade: EntradaSaidaFacade,
    private router: Router,
    private modalService: ModalService,
    private modalFitroEntradasaidaService: ModalFitroEntradasaidaService,
    private alertService: AlertService
  ) {
    this.filtro = new FiltroModalEntradaSaidaViewModel();
  }

  ngOnInit(): void {
    this.reloadTable();
  }

  sortData(sort: Sort) {
    this.page.orderBy = sort.active;
    this.page.orderDir = sort.direction;
    this.reloadTable();
  }

  reloadTable() {    
    var dados = new EntradaSaidaFiltroGridViewModel(
      this.filtro.pessoaID.codigo == null ? '' : this.filtro.pessoaID.codigo,
      this.filtro.numeroNota == null ? '' : this.filtro.numeroNota,      
      this.filtro.dataMovimentoIni == null
        ? ''
        : this.filtro.dataMovimentoIni,
        this.filtro.dataMovimentoFim == null
        ? ''
        : this.filtro.dataMovimentoFim,
        this.filtro.dataEmissaoIni == null
        ? ''
        : this.filtro.dataEmissaoIni,
        this.filtro.dataEmissaoFim == null
        ? ''
        : this.filtro.dataEmissaoFim,
        this.filtro.situacao == null ? '' : this.filtro.situacao,
        this.filtro.operacao == null ? '' : this.filtro.operacao,
      this.page.offset.toString(),
      this.page.pageSize.toString(),
      this.page.orderBy,
      this.page.orderDir
    );

    this.entradaSaidaFacade.getConsultarGrid(dados).subscribe((response) => {
      if (response.result.length == 0) {
        this.alertService.showAlertInfo(
          'Entrada/Saída',
          'Registros não encontrados!',
          '',
          '0'
        );
        //this.onResetCampos();
        //this.reloadTable();
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
        this.entradaSaidaFacade
          .getDeleteID(row.entradaSaidaID, this.dadosUsuario.usuarioID)
          .subscribe((data) => {
            if (data.executouServico == false) {
              this.alertService.showAlertWarning(
                'Entrada/Saída',
                data.mensagemFalha,
                '',
                '0'
              );
            } else {
              this.alertService.showAlertSuccess(
                'Entrada/Saída',
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

  onVisualizar(row: any) {
    let caminho;
    if (row.operacao == 'Entrada') caminho = 'entradaestoque';
    else caminho = 'saidaestoque';

    return new Configuracao().goTo(
      this.router,
      `app/listentradasaida/${caminho}/visualizar/`,
      row.entradaSaidaID,
      FuncionalidadeEnum.VISUALIZAR
    );
  }

  public abrirFiltro() {
    const config = {
      backdrop: false,
      ignoreBackdropClick: true,
      animate: true,
      class: 'modal-lg',
    };
    this.modalFiltro = this.modalService.show(
      ModalFitroEntradasaidaComponent,
      config
    );
    this.modalService.onShown.pipe(take(1)).subscribe(() => {
      this.modalFitroEntradasaidaService.setFiltro(this.filtro);
    });
    this.modalFiltro?.content?.dadosFiltro.subscribe((retorno) => {
      this.filtro.pessoaID = retorno.pessoaID;
      this.filtro.numeroNota = retorno.numeroNota;
      this.filtro.dataMovimentoIni = retorno.dataEmissaoIni;
      this.filtro.dataMovimentoFim = retorno.dataMovimentoFim;
      this.filtro.dataEmissaoIni = retorno.dataEmissaoIni;
      this.filtro.dataEmissaoFim = retorno.dataEmissaoFim;
      this.filtro.situacao = retorno.situacao;
      this.filtro.operacao = retorno.operacao;

      this.reloadTable();
    });
  }
}
