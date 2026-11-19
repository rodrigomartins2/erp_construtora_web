import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { ModalRef, ModalService } from 'src/app/presentation/services-ui/modal.service';
import { Configuracao } from 'src/app/core/utils/configuracao';
import {
  ContratoFiltroGridViewModel,
  FiltroModalContratoViewModel,
} from 'src/app/core/models/contrato.models';
import { SelectDropModel } from 'src/app/core/models/generics.models';
import { AlertService } from 'src/app/presentation/services-ui/alert.service';
import { ContratoFacade } from 'src/app/application/facade/contrato.facade';
import { PessoaFacade } from 'src/app/application/facade/pessoa.facade';
import { BreakcrumbComponent } from 'src/app/presentation/components/breadcrumb/breakcrumb.component';
import { ModalFitroContratoComponent } from 'src/app/presentation/pages/contrato/modal-fitro-contrato/modal-fitro-contrato.component';
import { ModalFitroContratoService } from 'src/app/presentation/pages/contrato/modal-fitro-contrato/modal-fitro-contrato.service';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-contrato-list',
    templateUrl: './contrato-list.component.html',
    styleUrls: ['./contrato-list.component.css'],
    imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    RouterModule,
    BreakcrumbComponent,
    TooltipModule
  ]
})
export class ContratoListComponent {
  dadosUsuario = new Configuracao().recuperarDados();
  myform!: FormGroup;
  listPessoa: SelectDropModel[] = [];
  listEmpresaPessoa: SelectDropModel[] = [];
  page = {
    totalRows: 0,
    offset: 0,
    orderBy: 'DataInicioContrato',
    orderDir: 'desc',
    pageSize: 8,
    currentPage: 0,
  };

  listaSituacao: any[] = [
    { codigo: 'A', descricao: 'Ativo' },
    { codigo: 'I', descricao: 'Finalizado' },
  ];

  pageSizeOptions: number[] = [5, 10, 25, 100];

  /** Colunas de situação dos documentos do contrato. */

  colunasDocumentos = [

    { campo: 'contr', titulo: 'Contr' },

    { campo: 'os', titulo: 'OS' },

    { campo: 'art', titulo: 'ART' },

    { campo: 'cno', titulo: 'CNO' },

    { campo: 'seg', titulo: 'SEG' },

    { campo: 'ta', titulo: 'TA' },

    { campo: 'fin', titulo: 'FIN' },

    { campo: 'trd', titulo: 'TRD' },

    { campo: 'ates', titulo: 'ATES' }

  ];


  displayedColumns: string[] = [
    'numeroContrato',
    'nomeEmpresa',
    'dataInicioContrato',
    'situacao',
    'dataFinalizacaoContrato',
    'contr',
    'os',
    'art',
    'cno',
    'seg',
    'ta',
    'fin',
    'trd',
    'ates',
    'button',
  ];

  dataSource!: MatTableDataSource<ContratoFiltroGridViewModel>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  modalFiltro? = new ModalRef<ModalFitroContratoComponent>();
  filtro: FiltroModalContratoViewModel;

  constructor(
    private contratoFacade: ContratoFacade,
    private modalService: ModalService,
    private modalFitroContratoService: ModalFitroContratoService,
    private pessoaFacade: PessoaFacade,
    private alertService: AlertService
  ) {
    this.filtro = new FiltroModalContratoViewModel();
  }

  ngOnInit(): void {
    this.onEmpresaPessoa();
    this.reloadTable();
  }

  sortData(sort: Sort) {
    this.page.orderBy = sort.active;
    this.page.orderDir = sort.direction;
    this.reloadTable();
  }

  reloadTable() {
    var dados = new ContratoFiltroGridViewModel(
      this.filtro.pessoaID == null  ? ''
        : this.filtro.pessoaID,
      this.filtro.empresaPessoaID == null ? ''
        : this.filtro.empresaPessoaID,
      this.filtro.dataInicioContrato == null
        ? ''
        : this.filtro.dataInicioContrato,
      this.filtro.dataFimContrato == null ? '' : this.filtro.dataFimContrato,
      this.filtro.situacao == null ? '' : this.filtro.situacao,
      this.page.offset.toString(),
      this.page.pageSize.toString(),
      this.page.orderBy,
      this.page.orderDir
    );

    this.contratoFacade.getConsultarGrid(dados).subscribe((response) => {
      this.modalService?.hide();
      if (response.result.length == 0) {
        this.alertService.showAlertInfo(
          'Contrato',
          'Registros não encontrados!',
          '',
          '0'
        );        
      }
      
      this.dataSource = new MatTableDataSource(response.result);
      setTimeout(() => {
        this.paginator.pageIndex = this.page.currentPage;
        this.paginator.length = +response.totalRegistros;
      });
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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
        this.contratoFacade
          .getDeleteID(row.ContratoID, this.dadosUsuario.usuarioID)
          .subscribe((data) => {
            if (data.executouServico == false) {
              this.alertService.showAlertWarning(
                'Contrato',
                data.mensagemFalha,
                '',
                '0'
              );
            } else {
              this.alertService.showAlertSuccess(
                'Contrato',
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

  onPessoa() {
    this.pessoaFacade.getListPessoa('Colaborador').subscribe((response) => {
      this.listPessoa = response;
    });
  }

  onEmpresaPessoa() {
    this.pessoaFacade.getListPessoa('Propria').subscribe((response) => {
      this.listEmpresaPessoa = response;
    });
  }

  public abrirFiltro() {
    const config = {
      backdrop: false,
      ignoreBackdropClick: true,
      animate: true,
      class: 'modal-lg',
    };
    this.modalFiltro = this.modalService.show(
      ModalFitroContratoComponent,
      config
    );
    this.modalService.onShown.pipe(take(1)).subscribe(() => {
      this.modalFitroContratoService.setFiltro(this.filtro);
    });
    this.modalFiltro?.content?.dadosFiltro.subscribe((retorno) => {
      this.filtro.pessoaID = retorno.pessoaID;
      this.filtro.empresaPessoaID = retorno.empresaPessoaID;
      this.filtro.dataInicioContrato = retorno.dataInicioContrato;
      this.filtro.dataFimContrato = retorno.dataFimContrato;
      this.filtro.situacao = retorno.situacao;
      
      this.reloadTable();
    });
  }
}
