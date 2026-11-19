import { ContratoRetornoViewModel } from 'src/app/core/models/contrato.models';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BreakcrumbComponent } from 'src/app/presentation/components/breadcrumb/breakcrumb.component';
import { Configuracao } from 'src/app/core/utils/configuracao';
import { SelectDropModel } from 'src/app/core/models/generics.models';
import { ObraFiltroGridViewModel, ObraPostViewModel } from 'src/app/core/models/obra.models';
import { ModalRef, ModalService, ModalOptions } from 'src/app/presentation/services-ui/modal.service';
import { FuncionalidadeEnum } from 'src/app/core/enums/funcionalidade.enum';
import { AlertService } from 'src/app/presentation/services-ui/alert.service';
import { ObraFacade } from 'src/app/application/facade/obra.facade';
import { EnumNaturezaOperacao, EnumSituacaoRegistro } from 'src/app/core/enums/enum.types';
import { PessoaFacade } from 'src/app/application/facade/pessoa.facade';
import { ContratoFacade } from 'src/app/application/facade/contrato.facade';
import { ModalCadMaterialObraComponent } from 'src/app/presentation/pages/contrato/modal-cad-material-obra/modal-cad-material-obra.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { AutocompleteComponent } from 'src/app/presentation/components/autocomplete/autocomplete.component';

@Component({
    selector: 'app-obra-list',
    imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    RouterModule,
    BreakcrumbComponent,
    ModalCadMaterialObraComponent,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    TooltipModule,
    AutocompleteComponent
  ],
    templateUrl: './obra-list.component.html',
    styleUrls: ['./obra-list.component.css']
})
export class ObraListComponent {
  pipe = new DatePipe('en-US');
  dadosUsuario = new Configuracao().recuperarDados();
  listPessoa: SelectDropModel[] = [];
  page = {
    totalRows: 0,
    offset: 0,
    orderBy: 'obraID',
    orderDir: 'desc',
    pageSize: 5,
    currentPage: 0
  };
  pageSizeOptions: number[] = [5, 10, 25, 100];  
  displayedColumns: string[] = [ 'obraID','numeroContrato','nomeDaObra','nomeResponsavel','dataInicioObra','dataFimObra',
                                 'situacao', 'button' ];
  dataSource!: MatTableDataSource<ObraFiltroGridViewModel>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort; 
  form!: FormGroup;
  modalRef!: ModalRef;  
  @ViewChild("templateModalForm") modalForm!: TemplateRef<any>;
  funcionalidade = FuncionalidadeEnum.CADASTRAR;
  //modalCadastroDocumentos? = new ModalRef<ModalCadastroDocumentoComponent>();
  documetosContratoID!: string;
  listTipoDocumentoContrato: SelectDropModel[] = [];  
  contratoID: string = '';  
  numeroContraroTitulo: string = '';
  obraID: string = '0';
  contrato!: ContratoRetornoViewModel;
  @ViewChild("templateModalInsumosObra") modalInsumosObra!: TemplateRef<any>;
  
  constructor(private obraFacade: ObraFacade, 
    private formBuilder: FormBuilder,        
    private alertService: AlertService,
    public modalService: ModalService,  
    private contratoFacade: ContratoFacade,  
    private route: ActivatedRoute,
    private pessoaFacade: PessoaFacade,
    private router: Router) {     
      this.contratoID = this.route.snapshot.paramMap.get('codigo') || '';    
      this.onDadosContratos(this.contratoID)
     }

  ngOnInit(): void {      
    this.onListPessoa(); 
    this.form = this.montaFormGroup();   
    this.reloadTable();
  }

  sortData(sort: Sort) {    
    this.page.orderBy = sort.active;
    this.page.orderDir = sort.direction;
    this.reloadTable();
  }

  reloadTable() {    
    var dados = new ObraFiltroGridViewModel(      
      this.contratoID == null ? '0' : this.contratoID.toString(),   
      this.page.offset.toString(),
      this.page.pageSize.toString(),
      this.page.orderBy,
      this.page.orderDir 
    )

    this.obraFacade.getConsultarGrid(dados).subscribe(
      (response) => {  
        if (response.result.length != 0) {                   
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
      descricao: '',
      situacao: ''
    });

    this.reloadTable();
  }

  openModalWithClass(template: TemplateRef<any>, tamanho: any) {
    const config: ModalOptions = {
      backdrop: 'static',
      keyboard: false,
      animated: true,
      ignoreBackdropClick: true,
      class: tamanho
    };

    this.modalRef = this.modalService.show(template, config);
  }

  onFecharModal() {
    this.modalRef.hide();
  }

  public inserirCadastroDocumento() {
    this.funcionalidade = FuncionalidadeEnum.CADASTRAR;   
    this.obraID = '0';    
    this.form = this.montaFormGroup();
    this.form.reset();    
    this.openModalWithClass(this.modalForm, '');
  }

  public editarCadastroDocumento(codigo: string) {  
    this.obraID = codigo;  
    this.funcionalidade = FuncionalidadeEnum.EDITAR;       
    this.montaDados(codigo);
    this.openModalWithClass(this.modalForm, '');    
  }

  private montaFormGroup() {  
      return this.formBuilder.group({                
        nomeDaObra: [{ value: '', disabled: false }, [Validators.required]],
        pessoaResponsavelID: [{ value: '', disabled: false }, [Validators.required]],       
        dataInicioObra: [{ value: '', disabled: false }, [Validators.required]],
        dataFimObra: [{ value: '', disabled: false }],
        observacao: [{ value: '', disabled: false }]
      });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  montaDados(codigo: string) {
    this.obraFacade.getConsultarID(codigo).subscribe((response) => {
      if (!response) {
        this.alertService.showAlertWarning(
          'Documento do Contrato',
          'Não foi possível localizar os dados!.',
          'app/listcontrato',
          codigo
        );
        return;
      } else if (this.funcionalidade == FuncionalidadeEnum.EDITAR) {
        this.habilitaCampos();
      }      
      this.atualizaFormulario(response);

    });
  }

  onSubmit() {
    this.form.markAllAsTouched();    
    if (this.form.invalid) {
      this.alertService.showAlertWarning('Documento do Contrato',
        'Existem campos obrigatórios não preenchidos ou com erro.' + this.form.errors,'','0');
      return;
    }

    const dadosForm = this.form.value;   
    const dados = new ObraPostViewModel(
      this.obraID,
      this.contratoID,
      dadosForm.nomeDaObra,
      dadosForm.pessoaResponsavelID.codigo,
      EnumSituacaoRegistro.ATIVO,
      dadosForm.dataInicioObra,
      dadosForm.dataFimObra,
      dadosForm.observacao,
      this.funcionalidade === FuncionalidadeEnum.CADASTRAR ? EnumNaturezaOperacao.INCLUSAO : EnumNaturezaOperacao.ALTERACAO,
      this.dadosUsuario.usuarioID.toString()
    );

    if (this.funcionalidade === FuncionalidadeEnum.CADASTRAR) {
      this.obraFacade.postInserir(dados).subscribe((data: any) => {
        if (data.executouServico == false) {
          this.alertService.showAlertWarning('', data.mensagemFalha, '', '0');
        } else {
          this.modalRef.hide();
          this.reloadTable();
          this.alertService.showAlertSuccess('', data.mensagemSucesso, '', '0');
        }
      });
    } else {
      this.obraFacade.postAtualiza(dados).subscribe((data: any) => {
        if (data.executouServico == false) {
          this.alertService.showAlertWarning('', data.mensagemFalha, '', '0');
        } else {
          this.modalRef.hide();
          this.reloadTable();
          this.alertService.showAlertSuccess('', data.mensagemSucesso, '', '0');
        }
      });
    }
  }

 
  private atualizaFormulario(dados: any) {   
    this.form.patchValue({     
      contratoID: dados.contratoID,
      nomeDaObra: dados.nomeDaObra,
      pessoaResponsavelID: { codigo: dados.pessoaResponsavelID, descricao: dados.nomeResponsavel },
      situacao: dados.situacao,
      dataInicioObra: this.pipe.transform(dados.dataInicioObra, 'yyyy-MM-dd'),
      dataFimObra:this.pipe.transform(dados.dataFimObra, 'yyyy-MM-dd'),
      observacao: dados.observacao      
    });
  }

  private habilitaCampos() {
    if (this.funcionalidade === FuncionalidadeEnum.VISUALIZAR) {
      return;
    }

    this.form.enable();
    // this.f.descricao?.disable();
    // this.f.abreviacao?.disable();
  }

  onReset() {
    const result$ = this.alertService.showConfirm(
      'Deseja saír da tela?',
      'Os dados serão descartadas',
      '',
      'Cancelar',
      'Confirmar'
    );

    result$.asObservable().subscribe((item) => {
      item ? this.onConsultar() : '';
    });

    //;
  }

  onConsultar() {
    this.modalRef.hide();
    //this.router.navigate(['app/listcontrato/']);
  }

  onEditar() {
    return new Configuracao().goTo(
      this.router,
      'app/listcontrato/contratocadastro/editar/',
      this.documetosContratoID,
      FuncionalidadeEnum.EDITAR
    );
  }

  onListPessoa() {
    this.pessoaFacade.getListPessoa('Todas').subscribe((response) => {
      this.listPessoa = response;
    });
  }

  onDadosContratos(codigo: string) {
    this.contratoFacade.getConsultarID(codigo).subscribe((response) => {
      this.contrato = response;
      this.numeroContraroTitulo = response.numeroContrato + ' - '+ response.nomePessoa;
    });
  }
 
  onLancarInsumosObra(codigo: any){
    this.obraID = codigo;
    this.openModalWithClass(this.modalInsumosObra, 'modal-xl');    
  }
}
