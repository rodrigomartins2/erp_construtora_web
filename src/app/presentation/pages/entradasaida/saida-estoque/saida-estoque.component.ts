import { paraNumero } from 'src/app/core/utils/numero';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FuncionalidadeEnum } from 'src/app/core/enums/funcionalidade.enum';
import { Configuracao } from 'src/app/core/utils/configuracao';
import { ModalRef, ModalService, ModalOptions } from 'src/app/presentation/services-ui/modal.service';
import { ModalDadosEstoque } from 'src/app/core/models/itens-entrada-saida.models';
import { ActivatedRoute, Router } from '@angular/router';
import { EntradaSaidaFacade } from 'src/app/application/facade/entrada-saida.facade';
import { TipoMovimentoFacade } from 'src/app/application/facade/tipo-movimento.facade';
import { AlertService } from 'src/app/presentation/services-ui/alert.service';
import { SaidaPostViewModel } from 'src/app/core/models/entrada-saida.models';
import { EnumNaturezaOperacao, EnumOperacaoeStoque, EnumSituacaoRegistro } from 'src/app/core/enums/enum.types';
import { ObraFacade } from 'src/app/application/facade/obra.facade';
import { RelatorioFacade } from 'src/app/application/facade/relatorio.facade';
import { SelectDropModel } from 'src/app/core/models/generics.models';
import { PessoaFacade } from 'src/app/application/facade/pessoa.facade';
import { ItensEstoqueSaidaComponent } from "src/app/presentation/pages/entradasaida/itens-estoque-saida/itens-estoque-saida.component";
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { AutocompleteComponent } from 'src/app/presentation/components/autocomplete/autocomplete.component';
import { VisualizarPdfComponent } from 'src/app/presentation/components/visualizar-pdf/visualizar-pdf.component';

@Component({
    selector: 'app-saida-estoque',
    imports: [
    CommonModule,
    ReactiveFormsModule,
    ItensEstoqueSaidaComponent,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    TextareaModule,
    AutocompleteComponent,
    VisualizarPdfComponent
  ],
    templateUrl: './saida-estoque.component.html',
    styleUrls: ['./saida-estoque.component.css']
})
export class SaidaEstoqueComponent {
  pipe = new DatePipe("en-US");
  funcionalidade = FuncionalidadeEnum.CADASTRAR;
  form!: FormGroup;
  dadosUsuario = new Configuracao().recuperarDados();
  codigoRegistro: string = '';
  dataEmissao: string = '';
  listaTipo: any[] = [
    { codigo: 'S', descricao: 'Serviço' },
    { codigo: 'P', descricao: 'Produto' },
  ];
  //listPessoa: SelectDropModel[] = [];
  listTipoMovimento:any;
  listObra: any;
  modalRef!: ModalRef;
  @ViewChild("templateModalItensEstoque") modalItensEstoque!: TemplateRef<any>;
  @ViewChild("templateModalRelatorioExpedicao") modalRelatorioExpedicao!: TemplateRef<any>;
  dadosModal!: ModalDadosEstoque;
  pdfData!: string;
  nomeArquivo!: string;
  listPessoa: SelectDropModel[] = [];

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private entradaSaidaFacade: EntradaSaidaFacade,
    private modalService: ModalService,
    private pessoaFacade: PessoaFacade,
    private tipoMovimentoFacade: TipoMovimentoFacade,
    private obraFacade: ObraFacade,
    private alertService: AlertService,
    private router: Router,
    private relatoriosFacade: RelatorioFacade 
  ) {
    const func = this.route.snapshot.paramMap.get('funcionalidade');

    if (func) {
      this.funcionalidade = parseInt(func);
    }
    this.form = this.montaFormGroup();
  }

  ngOnInit(): void {
    this.codigoRegistro = this.route.snapshot.paramMap.get('codigo') || '';

    if (
      this.funcionalidade === FuncionalidadeEnum.VISUALIZAR ||
      this.funcionalidade === FuncionalidadeEnum.EDITAR
    ) {
      this.montaDados(this.codigoRegistro);
    }
    this.onListPessoa();
    this.onListTipoMovimento();
    this.onListObra();
  }

  private montaFormGroup() {
    return this.formBuilder.group({
      tipoMovimentoID: [{ value: '', disabled: false }, [Validators.required]],
      pessoaID: [{ value: '', disabled: false }],
      obraID: [{ value: '', disabled: false }],
      dataMovimento: [{ value: '', disabled: false }, [Validators.required]],
      descricao: [{ value: '', disabled: false }],
      observacao: [{ value: '', disabled: false }]     
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  montaDados(codigo: string) {
    this.entradaSaidaFacade.getConsultarID(codigo).subscribe((response) => {      
      if (!response) {
        this.alertService.showAlertWarning(
          'Entrada Estoque',
          'Não foi possível localizar os dados!.',
          'app/listentradasaida',
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
        'Saída Estoque',
        'Existem campos obrigatórios não preenchidos ou com erro.',
        '',
        '0'
      );
      return;
    }
    
    const dadosForm = this.form.value;       
    if(dadosForm.pessoaID != '' && dadosForm.obraID != ''){
      this.alertService.showAlertWarning(
        'Saída Estoque',
        'A movimentação do Estoque só pode ser para Cliente ou para Obra!',
        '',
        '0'
      );
      return;
    }

    const dados = new SaidaPostViewModel(
      this.codigoRegistro == '' ? '0' : this.codigoRegistro,
      dadosForm.tipoMovimentoID,
      dadosForm.pessoaID.codigo,
      dadosForm.obraID,
      dadosForm.dataMovimento,
      dadosForm.descricao,
      dadosForm.observacao,
      EnumSituacaoRegistro.ATIVO,
      EnumOperacaoeStoque.SAIDA,
      this.funcionalidade === FuncionalidadeEnum.CADASTRAR
        ? EnumNaturezaOperacao.INCLUSAO
        : EnumNaturezaOperacao.ALTERACAO,
      this.dadosUsuario.usuarioID.toString()
    );

    if (this.funcionalidade === FuncionalidadeEnum.CADASTRAR) {
      this.entradaSaidaFacade.postSaidaInserir(dados).subscribe((data: any) => {
        if (data.executouServico == false) {
          this.alertService.showAlertWarning('', data.mensagemFalha, '', '0');
        } else {
          this.onVisualizar(data.codigo);
          this.alertService.showAlertSuccess('', data.mensagemSucesso, '', '0');
        }
      });
    } else {
      this.entradaSaidaFacade.postSaidaAtualiza(dados).subscribe((data: any) => {
        if (data.executouServico == false) {
          this.alertService.showAlertWarning('', data.mensagemFalha, '', '0');
        } else {
          this.onVisualizar(data.codigo);
          this.alertService.showAlertSuccess('', data.mensagemSucesso, '', '0');
        }
      });
    }
  }

  private atualizaFormulario(dados: any) {   
    this.dadosModal = new ModalDadosEstoque();
    this.dadosModal.codigo = this.codigoRegistro;
    this.dadosModal.estoqueID = dados.estoqueID;
    this.dadosModal.operacao = EnumOperacaoeStoque.SAIDA;
    this.dadosModal.data =  dados.dataEmissao;
    this.dadosModal.numeroNota = dados.numeroNota;
    this.dadosModal.valorTotal = dados.valorTotal;
    this.dadosModal.movimentacaoRealizada = dados.movimentacaoRealizada == 'True' ? true : false;
    
    this.form.patchValue({
      tipoMovimentoID: dados.tipoMovimentoID,
      pessoaID:  { codigo: dados.pessoaID, descricao: dados.nomeCliente },
      obraID: dados.obraID,      
      dataMovimento: this.pipe.transform(dados.dataMovimento, "yyyy-MM-dd"),
      descricao: dados.descricao,
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

    //this.form.reset();
  }

  onConsultar() {
    this.router.navigate(['app/listentradasaida/']);
  }

  onEditar() {
    return new Configuracao().goTo(
      this.router,
      'app/listentradasaida/saidaestoque/editar/',
      this.codigoRegistro,
      FuncionalidadeEnum.EDITAR
    );
  }

  onVisualizar(codigo: string) {
    return new Configuracao().goTo(
      this.router,
      'app/listentradasaida/saidaestoque/visualizar/',
      codigo,
      FuncionalidadeEnum.VISUALIZAR
    );
  }

  //onListPessoa() {
    // this.pessoaFacade.getListPessoa().subscribe((response) => {
    //   this.listPessoa = response;
    // });
  //}

  onListObra() {
    this.obraFacade.getListObra().subscribe((response) => {
      this.listObra = response;
    });
  }

  onListTipoMovimento() {
    this.tipoMovimentoFacade.getListTipoMovimento('S').subscribe((response) => {
      this.listTipoMovimento = response;
    });
  }

  onCalculaValorTotal(valor: string, acrescimo: string, desconto: string) {
    let nValor = paraNumero(valor);
    let nAcrescimo = paraNumero(acrescimo);
    let nDesconto = paraNumero(desconto);
    let soma = nValor - nDesconto + nAcrescimo;
    this.f.valorTotal.setValue(soma);
  }
 
  public abrirModalItens() {        
    this.openModalWithClass(this.modalItensEstoque);
  }

  public abrirModalRelExpedicao() {   
    this.onRelatorio();     
    //this.openModalWithClass(this.modalRelatorioExpedicao);
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

  onCancelarNota(){
    
  } 

  onListPessoa() {
    this.pessoaFacade.getListPessoa('Todas').subscribe((response) => {
      this.listPessoa = response;
    });
  }

  onRelatorio(){
    this.codigoRegistro
    this.relatoriosFacade.getRelExpedicaoDocumento(this.codigoRegistro).subscribe((response) => {      
        this.nomeArquivo = "ExpediçãoMaterial_" + this.dadosModal.numeroNota + '_' + this.dadosModal.data + ".pdf";
        this.pdfData = window.URL.createObjectURL(response);
        window.open(this.pdfData);
    });
  }
}

