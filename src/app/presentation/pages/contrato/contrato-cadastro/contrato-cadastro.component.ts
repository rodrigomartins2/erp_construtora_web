import { CommonModule, DatePipe } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Configuracao } from 'src/app/core/utils/configuracao';
import { EnumNaturezaOperacao, EnumSituacaoRegistro } from 'src/app/core/enums/enum.types';
import { FuncionalidadeEnum } from 'src/app/core/enums/funcionalidade.enum';
import { ContratoPostViewModel, FinalizarContratoViewModel } from 'src/app/core/models/contrato.models';
import { Imagens, SelectDropModel } from 'src/app/core/models/generics.models';
import { AlertService } from 'src/app/presentation/services-ui/alert.service';
import { ContratoFacade } from 'src/app/application/facade/contrato.facade';
import { PessoaFacade } from 'src/app/application/facade/pessoa.facade';
import { ItensEstoqueComponent } from 'src/app/presentation/pages/entradasaida/itens-estoque/itens-estoque.component';
import { ContratoDocumentosComponent } from 'src/app/presentation/pages/contrato/contrato-documentos/contrato-documentos.component';
import { ModalRef, ModalService, ModalOptions } from 'src/app/presentation/services-ui/modal.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { AutocompleteComponent } from 'src/app/presentation/components/autocomplete/autocomplete.component';

@Component({
    selector: 'app-contrato-cadastro',
    templateUrl: './contrato-cadastro.component.html',
    styleUrls: ['./contrato-cadastro.component.css'],
    imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    TextareaModule,
    AutocompleteComponent
  ]
})
export class ContratoCadastroComponent {
  pipe = new DatePipe('en-US');
  funcionalidade = FuncionalidadeEnum.CADASTRAR;
  form!: FormGroup;
  dadosUsuario = new Configuracao().recuperarDados();
  codigoRegistro: string = '';
  listPessoaContrato: SelectDropModel[] = [];
  listPessoaResponsavel: SelectDropModel[] = [];
  listEmpresaPessoa: SelectDropModel[] = [];
  documento: Imagens = new Imagens();
  @ViewChild("templateModalForm") modalForm!: TemplateRef<any>;
  modalRef!: ModalRef;  

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private contratoFacade: ContratoFacade,
    private pessoaFacade: PessoaFacade,
    private alertService: AlertService,
    private router: Router,
    public modalService: ModalService 
  ) {
    this.codigoRegistro = this.route.snapshot.paramMap.get('codigo') || '';    
    const func = this.route.snapshot.paramMap.get('funcionalidade');    
    if (func) {
      this.funcionalidade = parseInt(func);
    }
    this.form = this.montaFormGroup();
  }

  ngOnInit(): void {  
    if (
      this.funcionalidade === FuncionalidadeEnum.VISUALIZAR ||
      this.funcionalidade === FuncionalidadeEnum.EDITAR
    ) {
      this.montaDados(this.codigoRegistro);
    }

    this.onPessoaContrato();
    this.onPessoaResponsavel();
    this.onEmpresaPessoa();
  }

  private montaFormGroup() {
    return this.formBuilder.group({
      pessoaID: [{ value: '', disabled: false }, [Validators.required]],
      empresaPessoaID:  [{ value: '', disabled: false }, [Validators.required]],
      numeroContrato: [{ value: '', disabled: false }, [Validators.required]],
      valorContrato: [{ value: '', disabled: false }, [Validators.required]],
      dataInicioContrato: [{ value: '', disabled: false }, [Validators.required]],
      dataFimContrato: [{ value: '', disabled: false }, [Validators.required]],
      descricao: [{ value: '', disabled: false }],
      observacao: [{ value: '', disabled: false }],
      //arquivo: [{ value: '', disabled: false }],
      //situacaoDocumento: [{ value: '', disabled: false }, [Validators.required]],
      pessoaResponsavelContratoID: [{ value: '', disabled: false },[Validators.required]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  montaDados(codigo: string) {
    this.contratoFacade.getConsultarID(codigo).subscribe((response) => {
      if (!response) {
        this.alertService.showAlertWarning(
          'Entrada Estoque',
          'Não foi possívellocalizar os dados!.',
          'app/listcontrato',
          codigo
        );
        return;
      } else if (this.funcionalidade == FuncionalidadeEnum.EDITAR) {
        this.habilitaCampos();
      } else {
        this.funcionalidade = FuncionalidadeEnum.VISUALIZAR;
        this.form.disable({ emitEvent: true });
      }
      this.atualizaFormulario(response);
    });
  }

  onSubmit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.alertService.showAlertWarning(
        'Contratos',
        'Existem campos obrigatórios não preenchidos ou com erro.',
        '',
        '0'
      );
      return;
    }

    const dadosForm = this.form.value;
    const dados = new ContratoPostViewModel(
      this.codigoRegistro == '' ? '0' : this.codigoRegistro,
      dadosForm.pessoaID == '' ? '0' : dadosForm.pessoaID.codigo,
      dadosForm.empresaPessoaID == '' ? '0' : dadosForm.empresaPessoaID.codigo,
      dadosForm.numeroContrato,
      dadosForm.dataInicioContrato,
      dadosForm.dataFimContrato,
      dadosForm.descricao,
      dadosForm.observacao,
      EnumSituacaoRegistro.ATIVO,      
      dadosForm.valorContrato == '' ? '0' : dadosForm.valorContrato.toString().replace('.', ','), 
      dadosForm.pessoaResponsavelContratoID == '' ? '0': dadosForm.pessoaResponsavelContratoID.codigo,
      // this.documento.nome+'|'+this.documento.type,
      // this.documento.caminho,
      // dadosForm.situacaoDocumento,
      this.funcionalidade === FuncionalidadeEnum.CADASTRAR ? EnumNaturezaOperacao.INCLUSAO : EnumNaturezaOperacao.ALTERACAO,
      this.dadosUsuario.usuarioID.toString()
    );

    if (this.funcionalidade === FuncionalidadeEnum.CADASTRAR) {
      this.contratoFacade.postInserir(dados).subscribe((data: any) => {
        if (data.executouServico == false) {
          this.alertService.showAlertWarning('', data.mensagemFalha, '', '0');
        } else {
          this.onVisualizar(data.codigo);
          this.alertService.showAlertSuccess('', data.mensagemSucesso, '', '0');
        }
      });
    } else {
      this.contratoFacade.postAtualiza(dados).subscribe((data: any) => {
        if (data.executouServico == false) {
          this.alertService.showAlertWarning('', data.mensagemFalha, '', '0');
        } else {
          this.onVisualizar(data.codigo);
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
      pessoaID: { codigo: dados.pessoaID, descricao: dados.nomePessoa },
      empresaPessoaID: { codigo: dados.empresaPessoaID, descricao: dados.empresaResponsavel },
      numeroContrato: dados.numeroContrato,
      dataInicioContrato: this.pipe.transform(dados.dataInicioContrato, 'yyyy-MM-dd'),
      dataFimContrato: this.pipe.transform(dados.dataFimContrato, 'yyyy-MM-dd'),
      descricao: dados.descricao,
      observacao: dados.observacao,
      valorContrato: dados.valorContrato,
      pessoaResponsavelContratoID: { codigo: dados.pessoaResponsavelContratoID, descricao: dados.nomeResponsavel }
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

    //this.form.reset();
  }

  onConsultar() {
    this.router.navigate(['app/listcontrato/']);
  }

  onFinalizar(){
    const config: ModalOptions = {
      backdrop: 'static',
      keyboard: false,
      animated: true,
      ignoreBackdropClick: true,
      class: ''
    };

    this.modalRef = this.modalService.show(this.modalForm, config);
    
  }

  onSalvarFinalizarContrato(data: string, obsevacacao: string){
const dados = new FinalizarContratoViewModel(
      this.codigoRegistro == '' ? '0' : this.codigoRegistro,
      data,
      obsevacacao,
      this.dadosUsuario.usuarioID.toString()
    );

   
      this.contratoFacade.postFinalizaContrato(dados).subscribe((data: any) => {
        if (data.executouServico == false) {
          this.alertService.showAlertWarning('', data.mensagemFalha, '', '0');
        } else {
          this.modalService.hide();
          this.alertService.showAlertSuccess('', data.mensagemSucesso, '', '0');
        }
      });
   
  }

  onEditar() {
    return new Configuracao().goTo(
      this.router,
      'app/listcontrato/contratocadastro/editar/',
      this.codigoRegistro,
      FuncionalidadeEnum.EDITAR
    );
  }

  onVisualizar(codigo: string) {
    return new Configuracao().goTo(
      this.router,
      'app/listcontrato/contratocadastro/visualizar/',
      codigo,
      FuncionalidadeEnum.VISUALIZAR
    );
  }

  onPessoaContrato() {
    this.pessoaFacade.getListPessoa('Todas').subscribe((response) => {
      this.listPessoaContrato = response;
    });
  }

  onPessoaResponsavel() {
    this.pessoaFacade.getListPessoa('Colaborador').subscribe((response) => {
      this.listPessoaResponsavel = response;
    });
  }

  onEmpresaPessoa() {
    this.pessoaFacade.getListPessoa('Propria').subscribe((response) => {
      this.listEmpresaPessoa = response;
    });
  }

}
