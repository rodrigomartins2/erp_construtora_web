import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Configuracao } from 'src/app/core/utils/configuracao';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Imagens, SelectDropModel } from 'src/app/core/models/generics.models';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DocumentoContrato, DocumentosContratoFiltroGridViewModel, DocumentosContratoPostViewModel } from 'src/app/core/models/documentocontrato.models';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { DocumentosContratoFacade } from 'src/app/application/facade/documentos-contrato.facade';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AlertService } from 'src/app/presentation/services-ui/alert.service';
import { BreakcrumbComponent } from 'src/app/presentation/components/breadcrumb/breakcrumb.component';
import { VisualizarPdfComponent } from 'src/app/presentation/components/visualizar-pdf/visualizar-pdf.component';
import { ModalRef, ModalService, ModalOptions } from 'src/app/presentation/services-ui/modal.service';
import { ModalCadastroDocumentoComponent } from 'src/app/presentation/pages/contrato/modal-cadastro-documento/modal-cadastro-documento.component';
import { FuncionalidadeEnum } from 'src/app/core/enums/funcionalidade.enum';
import { EnumNaturezaOperacao } from 'src/app/core/enums/enum.types';
import { TipoDocumentoContratoFacade } from 'src/app/application/facade/tipo-documento-contrato.facade';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-contrato-documentos',
    imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    RouterModule,
    BreakcrumbComponent,
    VisualizarPdfComponent,
    ButtonModule,
    InputTextModule,
    SelectModule,
    TooltipModule
  ],
    templateUrl: './contrato-documentos.component.html',
    styleUrls: ['./contrato-documentos.component.css']
})
export class ContratoDocumentosComponent {
  pipe = new DatePipe('en-US');
  dadosUsuario = new Configuracao().recuperarDados();
  listPessoa: SelectDropModel[] = [];
  page = {
    totalRows: 0,
    offset: 0,
    orderBy: 'TipoDocumentoContratoID',
    orderDir: 'desc',
    pageSize: 5,
    currentPage: 0
  };
  pageSizeOptions: number[] = [5, 10, 25, 100];  
  displayedColumns: string[] = ['documentosContratoID','tipoDocumento','numeroContrato','dataDocumento','dataValidade', 'button' ];
  dataSource!: MatTableDataSource<DocumentosContratoFiltroGridViewModel>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort; 
  filtro!: DocumentoContrato;
  form!: FormGroup;
  modalRef!: ModalRef;
  @ViewChild("templateModalDocumentos") modalDocumentos!: TemplateRef<any>;
  @ViewChild("templateModalForm") modalForm!: TemplateRef<any>;
  funcionalidade = FuncionalidadeEnum.CADASTRAR;
  modalCadastroDocumentos? = new ModalRef<ModalCadastroDocumentoComponent>();
  documetosContratoID!: string;
  listTipoDocumentoContrato: SelectDropModel[] = [];  
  contratoID: string = '';
  documento: Imagens = new Imagens();
  numeroContraroTitulo: string = '';

  listaSituacao: any[] = [
    { codigo: 'F', descricao: 'Falta' },
    { codigo: 'FA', descricao: 'Falta Assinar' },
    { codigo: 'OK', descricao: 'Pronto' }
  ];
  
  constructor(private documentosContratoFacade: DocumentosContratoFacade, 
    private formBuilder: FormBuilder,        
    private alertService: AlertService,
    public modalService: ModalService,
    private tipoDocumentoContrato: TipoDocumentoContratoFacade,
    private route: ActivatedRoute,
    private router: Router) {     
      this.contratoID = this.route.snapshot.paramMap.get('codigo') || '';    
     }

  ngOnInit(): void {       
    this.form = this.montaFormGroup();   
    this.reloadTable();
    this.onTipoDocumentoContrato();
  }

  sortData(sort: Sort) {    
    this.page.orderBy = sort.active;
    this.page.orderDir = sort.direction;
    this.reloadTable();
  }

  reloadTable() {    
    var dados = new DocumentosContratoFiltroGridViewModel(      
      this.contratoID == null ? '0' : this.contratoID.toString(),   
      this.page.offset.toString(),
      this.page.pageSize.toString(),
      this.page.orderBy,
      this.page.orderDir 
    )

    this.documentosContratoFacade.getConsultarGrid(dados).subscribe(
      (response) => {  
        if (response.result.length == 0) {
          this.alertService.showAlertInfo('Contrato sem Documentos Anexos', 'Registros não encontrados!', '', '0');          
        }
        else {
          this.numeroContraroTitulo = response.result[0].numeroContrato
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

  onVisualizarArquivo(row: any) {
    this.documetosContratoID = row;
    this.abrirModalDocumentos();
  }

  public abrirModalDocumentos() { 
    this.openModalWithClass(this.modalDocumentos);
  }

  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
  }

  config: ModalOptions = {
    backdrop: 'static',
    keyboard: false,
    animated: true,
    ignoreBackdropClick: true,
    class: "modal-xl",
  };

  onFecharModal() {
    this.modalRef.hide();
  }

  public inserirCadastroDocumento() {
    this.form = this.montaFormGroup();
    this.form.reset();
    this.f.contratoID.setValue(this.contratoID);  
    this.openModalWithClass(this.modalForm);
    // this.filtro = new DocumentoContrato();
    // this.filtro.contratoID = this.contratoID;
    // this.filtro.documentoContratoID = this.contratoID;
    // this.modalRef = this.modalService.show(ModalCadastroDocumentoComponent, config);
    // this.modalRef.content.filtro = this.filtro;
  }

  public editarCadastroDocumento(codigo: string) {    
    this.funcionalidade = FuncionalidadeEnum.EDITAR;    
    this.f.contratoID.setValue(this.contratoID);  
    this.f.arquivo.clearValidators();      
    this.documetosContratoID = codigo;   
    this.montaDados(codigo);
    this.openModalWithClass(this.modalForm);    
  }

  private montaFormGroup() {  
      return this.formBuilder.group({
        contratoID: [{ value: '', disabled: false }, [Validators.required]],
        tipoDocumentoContratoID: [{ value: '', disabled: false }, [Validators.required]],
        dataDocumento: [{ value: '', disabled: false }, [Validators.required]],
        dataValidade: [{ value: '', disabled: false }],
        arquivo: [{ value: '', disabled: false }],
        situacao: [{ value: '', disabled: false }, [Validators.required]],
      });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  montaDados(codigo: string) {
    this.documentosContratoFacade.getConsultarID(codigo).subscribe((response) => {
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
    console.log(this.form)
    if (this.form.invalid) {
      this.alertService.showAlertWarning(
        'Documento do Contrato',
        'Existem campos obrigatórios não preenchidos ou com erro.' + this.form.errors,
        '',
        '0'
      );
      return;
    }

    const dadosForm = this.form.value;   
    const dados = new DocumentosContratoPostViewModel(
      this.documetosContratoID == '' ? '0' : this.documetosContratoID,
      dadosForm.contratoID,
      dadosForm.tipoDocumentoContratoID,
      this.documento.caminho == null ? '' : this.documento.nome+'|'+this.documento.type,
      this.documento.caminho,
      dadosForm.dataDocumento,
      dadosForm.dataValidade,
      dadosForm.situacao,
      this.funcionalidade === FuncionalidadeEnum.CADASTRAR ? EnumNaturezaOperacao.INCLUSAO : EnumNaturezaOperacao.ALTERACAO,
      this.dadosUsuario.usuarioID.toString()
    );

    if (this.funcionalidade === FuncionalidadeEnum.CADASTRAR) {
      this.documentosContratoFacade.postInserir(dados).subscribe((data: any) => {
        if (data.executouServico == false) {
          this.alertService.showAlertWarning('', data.mensagemFalha, '', '0');
        } else {
          this.modalRef.hide();
          this.reloadTable();
          this.alertService.showAlertSuccess('', data.mensagemSucesso, '', '0');
        }
      });
    } else {
      this.documentosContratoFacade.postAtualiza(dados).subscribe((data: any) => {
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

  onFileChanges(event: any) {        
    const selectedFiles = <FileList>event.srcElement.files;
    this.documento.nome = selectedFiles[0].name;
    this.documento.type = selectedFiles[0].type;
    new Configuracao().getBase64(selectedFiles[0]).then(item => {       
        this.documento.caminho = item });
  }

  private atualizaFormulario(dados: any) {   
    this.form.patchValue({
      tipoDocumentoContratoID: dados.tipoDocumentoContratoID,
      dataValidade: this.pipe.transform(dados.dataValidade, 'yyyy-MM-dd'),
      dataDocumento: this.pipe.transform(dados.dataDocumento, 'yyyy-MM-dd'),
      contratoID: dados.contratoID,
      situacao: dados.situacao
      //arquivo: dados.arquivo
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


  onTipoDocumentoContrato() {
    this.tipoDocumentoContrato.getListTipoDocumentoContrato().subscribe((response) => {
      this.listTipoDocumentoContrato = response;  
    });
  }
}
