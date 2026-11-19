import { take } from 'rxjs';
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
import {
  CategoriaFiltroGridViewModel,
  FiltroModalCategoriaViewModel
} from 'src/app/core/models/categoria.models';
import { CategoriaFacade } from 'src/app/application/facade/categoria.facade';
import { AlertService } from 'src/app/presentation/services-ui/alert.service';
import { BreakcrumbComponent } from 'src/app/presentation/components/breadcrumb/breakcrumb.component';
import { ModalRef, ModalService } from 'src/app/presentation/services-ui/modal.service';
import { ModalFitroCategoriaComponent } from 'src/app/presentation/pages/categoria/modal-fitro-categoria/modal-fitro-categoria.component';
import { ModalFitroCategoriaService } from 'src/app/presentation/pages/categoria/modal-fitro-categoria/modal-fitro-categoria.service';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-categoria-list',
    imports: [
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    CommonModule,
    RouterModule,
    BreakcrumbComponent,
    TooltipModule
  ],
    templateUrl: './categoria-list.component.html',
    styleUrls: ['./categoria-list.component.css']
})
export class CategoriaListComponent {
  dadosUsuario = new Configuracao().recuperarDados();
  myform!: FormGroup;  
  page = {
    totalRows: 0,
    offset: 0,
    orderBy: 'Descricao',
    orderDir: 'desc',
    pageSize: 8,
    currentPage: 0,
  };

  pageSizeOptions: number[] = [8, 10, 25, 100];
  displayedColumns: string[] = [
    'categoriaID',
    'descricaoCategoriaPrincipal',
    'descricao',
    'tipo',
    'situacao',
    'button',
  ];
  displayedColumns1: string[] = [
    'Código',
    'Categoria Principal',
    'Descrição',
    'Tipo',
    'Situação',
    'button',
  ];
  dataSource!: MatTableDataSource<CategoriaFiltroGridViewModel>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  modalFiltro? = new ModalRef<ModalFitroCategoriaComponent>();
  filtro: FiltroModalCategoriaViewModel;
  //filtroTags: any[] = [];

  constructor(
    private categoriaFacade: CategoriaFacade,
    private modalService: ModalService,
    private modalFitroCategoriaService: ModalFitroCategoriaService,
    private alertService: AlertService
  ) {
    this.filtro = new FiltroModalCategoriaViewModel();
  }

  ngOnInit(): void {
    this.myform = new FormGroup({
      descricao: new FormControl(),
      tipo: new FormControl(),
      situacao: new FormControl(),
    });
    this.reloadTable();
  }

  sortData(sort: Sort) {
    this.page.orderBy = sort.active;
    this.page.orderDir = sort.direction;
    this.reloadTable();
  }

  reloadTable() {
    var dados = new CategoriaFiltroGridViewModel(
      this.filtro.categoriaPrincipalID == null ? '' : this.filtro.categoriaPrincipalID,
      this.filtro.descricao == null ? '' : this.filtro.descricao,
      this.filtro.tipo == null ? '' : this.filtro.tipo,
      this.filtro.situacao == null ? '' : this.filtro.situacao,
      this.page.offset.toString(),
      this.page.pageSize.toString(),
      this.page.orderBy,
      this.page.orderDir
    );

    this.categoriaFacade.getConsultarGrid(dados).subscribe((response) => {
      if (response.result.length == 0) {
        this.alertService.showAlertInfo(
          'Categoria',
          'Registros não encontrados!',
          '',
          '0'
        );
      } else {
        this.modalService?.hide();
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
      tipo: '',
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
        this.categoriaFacade
          .getDeleteID(row.categoriaID, this.dadosUsuario.usuarioID)
          .subscribe((data) => {
            if (data.executouServico == false) {
              this.alertService.showAlertWarning(
                'Categoria',
                data.mensagemFalha,
                '',
                '0'
              );
            } else {
              this.alertService.showAlertSuccess(
                'Categoria',
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

  public abrirFiltro() {
    const config = {
      keyboard: false,
      class: 'modal-lg',
    };
    this.modalFiltro = this.modalService.show(
      ModalFitroCategoriaComponent,
      config
    );
    this.modalService.onShown.pipe(take(1)).subscribe(() => {
      this.modalFitroCategoriaService.setFiltro(this.filtro);
    });
    this.modalFiltro?.content?.dadosFiltro.subscribe((retorno) => {
      this.filtro.categoriaPrincipalID = retorno.categoriaPrincipalID;
      this.filtro.descricao = retorno.descricao;
      this.filtro.tipo = retorno.tipo;
      this.filtro.situacao = retorno.situacao;
      //this.filtroTags = Object.values(this.filtro).filter(value => value)      

      this.reloadTable();
    });
  }
}
