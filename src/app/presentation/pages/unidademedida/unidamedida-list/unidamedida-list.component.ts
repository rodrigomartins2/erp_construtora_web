import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatSort, MatSortModule, Sort} from '@angular/material/sort';
import { Configuracao } from 'src/app/core/utils/configuracao';
import { UnidadesMedidaFiltroGridViewModel } from 'src/app/core/models/unidade-medida.models';
import { AlertService } from 'src/app/presentation/services-ui/alert.service';
import { Router, RouterModule } from '@angular/router';
import { UnidadeMedidaFacade } from 'src/app/application/facade/unidade-medida.facade';
import { BreakcrumbComponent } from 'src/app/presentation/components/breadcrumb/breakcrumb.component';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-unidamedida-list',
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
    templateUrl: './unidamedida-list.component.html',
    styleUrls: ['./unidamedida-list.component.css']
})
export class UnidamedidaListComponent implements  OnInit {
  dadosUsuario = new Configuracao().recuperarDados();
  form!: FormGroup;
  page = {
    totalRows: 0,
    offset: 0,
    orderBy: 'Descricao',
    orderDir: 'desc',
    pageSize: 10,
    currentPage: 0
  };

  listaSituacao: any[] = [
    { codigo: 'A', descricao: 'Ativo' },
    { codigo: 'I', descricao: 'Inativo' }
  ];

  pageSizeOptions: number[] = [5, 10, 25, 100];

  displayedColumns: string[] = ['unidadeMedidaID', 'descricao', 'abreviacao', 'situacao', 'button' ];

  dataSource!: MatTableDataSource<UnidadesMedidaFiltroGridViewModel>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
 
  constructor(private unidadesMedidaFacade: UnidadeMedidaFacade, private router: Router, 
     private formBuilder: FormBuilder,
    private alertService: AlertService) {
      this.form = this.montaFormGroup();
     }

  ngOnInit(): void {
    this.reloadTable(); 
  }

    private montaFormGroup() {
      return this.formBuilder.group({
        descricao: [{ value: null, disabled: false}],
        situacao: [{ value: null, disabled: false}]
      });
    }

  sortData(sort: Sort) {    
    this.page.orderBy = sort.active;
    this.page.orderDir = sort.direction;
    this.reloadTable();
  }

  reloadTable() {
    const dadosFormulario = this.form.value;  
    var dados = new UnidadesMedidaFiltroGridViewModel(      
      dadosFormulario.descricao == null ? '' : dadosFormulario.descricao,
      dadosFormulario.situacao == null ? '' : dadosFormulario.situacao,
      this.page.offset.toString(),
      this.page.pageSize.toString(),
      this.page.orderBy,
      this.page.orderDir 
    )

    this.unidadesMedidaFacade.getConsultarGrid(dados).subscribe(
      (response) => {        
        if (response.result.length == 0) {
          this.alertService.showAlertInfo('Unidade Medida', 'Registros não encontrados!', '', '0');
          this.onResetCampos();
          this.reloadTable();
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
    this.form.reset({
      descricao: ''
    });

    this.reloadTable();
  }

  onExcluir(row: any) {
    const msg = row.status == 'Ativo' ? 'Inativar' : 'Ativar';
    const result$ = this.alertService.showConfirm('Atenção', 'Deseja ' + msg + ' o registro?', '', 'Não', 'Sim');

    result$.asObservable().subscribe(dados => {
      if (dados) {
        this.unidadesMedidaFacade.getDeleteID(row.unidadeMedidaID, this.dadosUsuario.usuarioID).subscribe(
          (data) => {         
            if (data.executouServico == false) {
              this.alertService.showAlertWarning('Unidade Medida', data.mensagemFalha, '', '0');
            }
            else {
              this.alertService.showAlertSuccess('Unidade Medida', data.mensagemSucesso, '', '0');
              this.reloadTable();
            }
          });
      }
    });
  }
}
