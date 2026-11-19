import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { TipoDocumentoContratoFacade } from 'src/app/application/facade/tipo-documento-contrato.facade';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DocumentosContratoFacade } from 'src/app/application/facade/documentos-contrato.facade';
import { AlertService } from 'src/app/presentation/services-ui/alert.service';
import { ModalRef, ModalService } from 'src/app/presentation/services-ui/modal.service';
import { FuncionalidadeEnum } from 'src/app/core/enums/funcionalidade.enum';
import { Configuracao } from 'src/app/core/utils/configuracao';
import { Imagens, SelectDropModel } from 'src/app/core/models/generics.models';
import { DocumentoContrato } from 'src/app/core/models/documentocontrato.models';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

@Component({
    selector: 'app-modal-cadastro-documento',
    imports: [
    CommonModule,
    ReactiveFormsModule,

    ButtonModule,
    InputTextModule,
    SelectModule
  ],
    templateUrl: './modal-cadastro-documento.component.html',
    styleUrls: ['./modal-cadastro-documento.component.css']
})
export class ModalCadastroDocumentoComponent implements OnInit {  
  pipe = new DatePipe('en-US');
  funcionalidade = FuncionalidadeEnum.CADASTRAR;
  form!: FormGroup;
  dadosUsuario = new Configuracao().recuperarDados();
  codigoRegistro: string = '';
  listPessoa: SelectDropModel[] = [];
  documento: Imagens = new Imagens();
  listTipoDocumentoContrato: SelectDropModel[] = [];  
  modalRef!: ModalRef;
  @Input() filtro!: DocumentoContrato;

  constructor(
    private tipoDocumentoContrato: TipoDocumentoContratoFacade,
    private formBuilder: FormBuilder,
    public modalService: ModalService,
    private documentosContratoFacade: DocumentosContratoFacade,
    private alertService: AlertService,
    private router: Router
  ) {
    this.form = this.montaFormGroup();
  }

  ngOnInit() {     
    //this.f.contratoID.setValue(this.contratoID);

    if(this.funcionalidade === FuncionalidadeEnum.VISUALIZAR ||this.funcionalidade === FuncionalidadeEnum.EDITAR) {
      this.montaDados(this.codigoRegistro);     
    }      
    this.onTipoDocumentoContrato();
   
  }

  private montaFormGroup() {
    return this.formBuilder.group({
      //contratoID: [{ value: '', disabled: false }, [Validators.required]],
      tipoDocumentoContratoID: [{ value: '', disabled: false }, [Validators.required]],
      dataDocumento: [{ value: '', disabled: false }, [Validators.required]],
      dataValidade: [{ value: '', disabled: false }, [Validators.required]],
      arquivo: [{ value: '', disabled: false }, [Validators.required]]
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
    // this.form.markAllAsTouched();
    // if (this.form.invalid) {
    //   this.alertService.showAlertWarning(
    //     'Documento do Contrato',
    //     'Existem campos obrigatórios não preenchidos ou com erro.',
    //     '',
    //     '0'
    //   );
    //   return;
    // }

    // const dadosForm = this.form.value;   
    // const dados = new DocumentosContratoPostViewModel(
    //   this.codigoRegistro == '' ? '0' : this.codigoRegistro,
    //   this.filtro.contratoID,
    //   dadosForm.tipoDocumentoContratoID,
    //   this.documento.nome+'|'+this.documento.type,
    //   this.documento.caminho,
    //   dadosForm.dataDocumento,
    //   dadosForm.dataValidade,
    //   this.funcionalidade === FuncionalidadeEnum.CADASTRAR ? NaturezaOperacaoEnum.INCLUSAO : NaturezaOperacaoEnum.ALTERACAO,
    //   this.dadosUsuario.usuarioID.toString()
    // );

    // console.log(dados)

    // if (this.funcionalidade === FuncionalidadeEnum.CADASTRAR) {
    //   this.documentosContratoFacade.postInserir(dados).subscribe((data: any) => {
    //     if (data.executouServico == false) {
    //       this.alertService.showAlertWarning('', data.mensagemFalha, '', '0');
    //     } else {
    //       this.onVisualizar(data.codigo);
    //       this.alertService.showAlertSuccess('', data.mensagemSucesso, '', '0');
    //     }
    //   });
    // } else {
    //   this.documentosContratoFacade.postAtualiza(dados).subscribe((data: any) => {
    //     if (data.executouServico == false) {
    //       this.alertService.showAlertWarning('', data.mensagemFalha, '', '0');
    //     } else {
    //       this.onVisualizar(data.codigo);
    //       this.alertService.showAlertSuccess('', data.mensagemSucesso, '', '0');
    //     }
    //   });
    // }
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
      dataInicioContrato: this.pipe.transform(dados.dataInicioContrato, 'yyyy-MM-dd'),
      dataFimContrato: this.pipe.transform(dados.dataFimContrato, 'yyyy-MM-dd'),
      descricao: dados.descricao,
      observacao: dados.observacao,
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

  onTipoDocumentoContrato() {
    this.tipoDocumentoContrato.getListTipoDocumentoContrato().subscribe((response) => {
      this.listTipoDocumentoContrato = response;  
    });
  }

}
