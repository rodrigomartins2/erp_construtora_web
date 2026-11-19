import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { Router, RouterModule } from '@angular/router';
import { Configuracao } from 'src/app/core/utils/configuracao';
import { UsuarioFiltroGridViewModel } from 'src/app/core/models/usuario.models';
import { UsuarioFacade } from 'src/app/application/facade/usuario.facade';
import { AlertService } from 'src/app/presentation/services-ui/alert.service';
import { SelectDropModel } from 'src/app/core/models/generics.models';
import { FuncaoFacade } from 'src/app/application/facade/funcao.facade';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-usuario-list',
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
    SelectModule,
    TooltipModule
  ],
    templateUrl: './usuario-list.component.html',
    styleUrls: ['./usuario-list.component.css']
})
export class UsuarioListComponent {
  dadosUsuario = new Configuracao().recuperarDados();
  filtroAberto = true;
  myform!: FormGroup;
  page = {
    totalRows: 0,
    offset: 0,
    orderBy: 'Nome',
    orderDir: 'desc',
    pageSize: 5,
    currentPage: 0
  };

  listaSituacao: any[] = [
    { codigo: 'A', descricao: 'Ativo' },
    { codigo: 'I', descricao: 'Inativo' }
  ];
  listFuncao: SelectDropModel[] = [];
  pageSizeOptions: number[] = [5, 10, 25, 100];
  displayedColumns: string[] = ['usuarioID', 'funcaoDescricao','nome','login','senhaPadrao','situacao', 'button' ];
  dataSource!: MatTableDataSource<UsuarioFiltroGridViewModel>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
 
  constructor(private usuarioFacade: UsuarioFacade, private router: Router, 
    private alertService: AlertService, private funcaoFacade: FuncaoFacade) { }

  ngOnInit(): void {
    this.myform = new FormGroup({
      funcaoID: new FormControl(),
      nome: new FormControl(),
      situacao: new FormControl()
    });
    this.reloadTable();
    this.onFuncao();
  }

  sortData(sort: Sort) {    
    this.page.orderBy = sort.active;
    this.page.orderDir = sort.direction;
    this.reloadTable();
  }

  reloadTable() {
    const dadosFormulario = this.myform.value;  
    var dados = new UsuarioFiltroGridViewModel(      
      dadosFormulario.funcaoID == null ? '' : dadosFormulario.funcaoID,
      dadosFormulario.nome == null ? '' : dadosFormulario.nome,
      dadosFormulario.situacao == null ? '' : dadosFormulario.situacao,
      this.page.offset.toString(),
      this.page.pageSize.toString(),
      this.page.orderBy,
      this.page.orderDir 
    )

    this.usuarioFacade.getConsultarGrid(dados).subscribe(
      (response) => {        
        if (response.result.length == 0) {
          this.alertService.showAlertInfo('Usuario', 'Registros não encontrados!', '', '0');
          // this.onResetCampos();
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
      funcaoID: '',
      nome: '',
      situacao: ''
    });

    this.reloadTable();
  }

  onExcluir(row: any) {
    const msg = row.status == 'Ativo' ? 'Inativar' : 'Ativar';
    const result$ = this.alertService.showConfirm('Atenção', 'Deseja ' + msg + ' o registro?', '', 'Não', 'Sim');

    result$.asObservable().subscribe(dados => {
      if (dados) {
        this.usuarioFacade.getDeleteID(row.UsuarioID, this.dadosUsuario.usuarioID).subscribe(
          (data) => {         
            if (data.executouServico == false) {
              this.alertService.showAlertWarning('Usuario', data.mensagemFalha, '', '0');
            }
            else {
              this.alertService.showAlertSuccess('Usuario', data.mensagemSucesso, '', '0');
              this.reloadTable();
            }
          });
      }
    });
  }

  onFuncao() {
    this.funcaoFacade.getListFuncao().subscribe((response) => {
      this.listFuncao = response;
    });
  }

}
