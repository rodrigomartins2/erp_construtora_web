import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { Router, RouterModule } from '@angular/router';
import { Configuracao } from 'src/app/core/utils/configuracao';
import { SelectDropModel } from 'src/app/core/models/generics.models';
import { PessoaFiltroGridViewModel } from 'src/app/core/models/pessoa.models';
import { PessoaFacade } from 'src/app/application/facade/pessoa.facade';
import { AlertService } from 'src/app/presentation/services-ui/alert.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { MaskDirective } from 'src/app/presentation/shared/directives/mask.directive';

@Component({
    selector: 'app-pessoa-list',
    imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    MaskDirective
  ],
    templateUrl: './pessoa-list.component.html',
    styleUrls: ['./pessoa-list.component.css']
})
export class PessoaListComponent {
  dadosUsuario = new Configuracao().recuperarDados();
  filtroAberto = true;
  myform!: FormGroup;
  listPessoa: SelectDropModel[] = [];
  page = {
    totalRows: 0,
    offset: 0,
    orderBy: 'Nome',
    orderDir: 'desc',
    pageSize: 5,
    currentPage: 0
  };

  listaSituacao: any[] = [
    { codigo: 'Ativo', descricao: 'Ativo' },
    { codigo: 'Inativo', descricao: 'Inativo' }
  ];

  pageSizeOptions: number[] = [5, 10, 25, 100];

  displayedColumns: string[] = ['pessoaID', 'cpfcnpj', 'nome','nomeFantasia', 'telefone', 'nomeDoMunicipio', 'button' ];

  dataSource!: MatTableDataSource<PessoaFiltroGridViewModel>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
 
  constructor(private pessoaFacade: PessoaFacade, private router: Router, 
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.myform = new FormGroup({              
      nome: new FormControl(),
      cPFCNPJ: new FormControl()
    });      
    this.reloadTable();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.myform.controls;
  }

  sortData(sort: Sort) {    
    this.page.orderBy = sort.active;
    this.page.orderDir = sort.direction;
    this.reloadTable();
  }

  reloadTable() {
    const dadosFormulario = this.myform.value;  
    var dados = new PessoaFiltroGridViewModel(      
      dadosFormulario.tipoPessoa,
      dadosFormulario.nome,
      dadosFormulario.cPFCNPJ,
      this.page.offset.toString(),
      this.page.pageSize.toString(),
      this.page.orderBy,
      this.page.orderDir 
    )

    this.pessoaFacade.getConsultarGrid(dados).subscribe(
      (response) => {   
        console.log(response) 
        if (response.result.length == 0) {
        
          this.alertService.showAlertInfo('Pessoa', 'Registros não encontrados!', '', '0');
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
        this.pessoaFacade.getDeleteID(row.PessoaID, this.dadosUsuario.usuarioID).subscribe(
          (data) => {         
            if (data.executouServico == false) {
              this.alertService.showAlertWarning('Pessoa', data.mensagemFalha, '', '0');
            }
            else {
              this.alertService.showAlertSuccess('Pessoa', data.mensagemSucesso, '', '0');
              this.reloadTable();
            }
          });
      }
    });
  }
}
