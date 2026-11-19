import { paraNumero } from 'src/app/core/utils/numero';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FuncionalidadeEnum } from 'src/app/core/enums/funcionalidade.enum';
import { Configuracao } from 'src/app/core/utils/configuracao';
import { ActivatedRoute, Router } from '@angular/router';
import { EntradaSaidaFacade } from 'src/app/application/facade/entrada-saida.facade';
import { AlertService } from 'src/app/presentation/services-ui/alert.service';
import { EntradaPostViewModel } from 'src/app/core/models/entrada-saida.models';
import {
  EnumNaturezaOperacao,
  EnumOperacaoeStoque,
  EnumSituacaoRegistro,
} from 'src/app/core/enums/enum.types';
import { SelectDropModel } from 'src/app/core/models/generics.models';
import { PessoaFacade } from 'src/app/application/facade/pessoa.facade';
import { TipoMovimentoFacade } from 'src/app/application/facade/tipo-movimento.facade';
import { ItensEstoqueComponent } from 'src/app/presentation/pages/entradasaida/itens-estoque/itens-estoque.component';
import { ModalRef, ModalService, ModalOptions } from 'src/app/presentation/services-ui/modal.service';
import { ModalDadosEstoque } from 'src/app/core/models/itens-entrada-saida.models';
import { EstoquePessoaFacade } from 'src/app/application/facade/estoque-pessoa.facade';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { AutocompleteComponent } from 'src/app/presentation/components/autocomplete/autocomplete.component';

@Component({
    selector: 'app-entrada-estoque',
    imports: [
    CommonModule,
    ReactiveFormsModule,
    ItensEstoqueComponent,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    TextareaModule,
    AutocompleteComponent
  ],
    templateUrl: './entrada-estoque.component.html',
    styleUrls: ['./entrada-estoque.component.css']
})
export class EntradaEstoqueComponent {
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
  listPessoa: SelectDropModel[] = []; 
  listTipoMovimento: SelectDropModel[] = [];
  listEstoque: SelectDropModel[] = [];
  modalRef!: ModalRef;
  @ViewChild("templateModalItensEstoque") modalItensEstoque!: TemplateRef<any>;
  dadosModal!: ModalDadosEstoque;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private entradaSaidaFacade: EntradaSaidaFacade,
    private modalService: ModalService,
    private pessoaFacade: PessoaFacade,
    private tipoMovimentoFacade: TipoMovimentoFacade,
    private alertService: AlertService,
    private estoquePessoaFacade: EstoquePessoaFacade,
    private router: Router
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
    this.onListEstoquePessoa();
  }

  private montaFormGroup() {
    return this.formBuilder.group({
      tipoMovimentoID: [{ value: '', disabled: false }, [Validators.required]],
      pessoaID: [{ value: '', disabled: false }, [Validators.required]],
      estoqueID:  [{ value: '', disabled: false }, [Validators.required]],
      serie: [{ value: '', disabled: false }],
      numeroNota: [{ value: '', disabled: false }],
      dataEmissao: [{ value: '', disabled: false }, [Validators.required]],
      dataMovimento: [{ value: '', disabled: false }, [Validators.required]],
      valor: [{ value: '', disabled: false }, [Validators.required]],
      valorDesconto: [{ value: '', disabled: false }],
      valorAcrescimo: [{ value: '', disabled: false }],
      descricao: [{ value: '', disabled: false }],
      observacao: [{ value: '', disabled: false }],
      valorFrete: [{ value: '', disabled: false }],
      valorICMSSubstituicao: [{ value: '', disabled: false }],
      valorIPI: [{ value: '', disabled: false }],
      valorTotal: [{ value: '', disabled: false }]   
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
          'Não foi possívellocalizar os dados!.',
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
        'Entrada Estoque',
        'Existem campos obrigatórios não preenchidos ou com erro.',
        '',
        '0'
      );
      return;
    }

    const dadosForm = this.form.value;   
    const dados = new EntradaPostViewModel(
      this.codigoRegistro == '' ? '0' : this.codigoRegistro,
      dadosForm.tipoMovimentoID,
      dadosForm.pessoaID.codigo,   
      dadosForm.estoqueID,   
      dadosForm.serie,
      dadosForm.numeroNota,
      dadosForm.dataMovimento,
      dadosForm.dataEmissao,
      dadosForm.valor == ''
        ? '0'
        : dadosForm.valor.toString().replace('.', ','),
      dadosForm.valorDesconto == ''
        ? '0'
        : dadosForm.valorDesconto.toString().replace('.', ','),
      dadosForm.valorAcrescimo == ''
        ? '0'
        : dadosForm.valorAcrescimo.toString().replace('.', ','),
      dadosForm.descricao,
      dadosForm.observacao,
      dadosForm.valorFrete == ''
        ? '0'
        : dadosForm.valorFrete.toString().replace('.', ','),
      dadosForm.valorICMSSubstituicao == ''
        ? '0'
        : dadosForm.valorICMSSubstituicao.toString().replace('.', ','),
      dadosForm.valorIPI == ''
        ? '0'
        : dadosForm.valorIPI.toString().replace('.', ','),
      dadosForm.valorTotal == ''
        ? '0'
        : dadosForm.valorTotal.toString().replace('.', ','),
        EnumSituacaoRegistro.ATIVO,
        EnumOperacaoeStoque.ENTRADA,
      this.funcionalidade === FuncionalidadeEnum.CADASTRAR
        ? EnumNaturezaOperacao.INCLUSAO
        : EnumNaturezaOperacao.ALTERACAO,
      this.dadosUsuario.usuarioID.toString()
    );

    if (this.funcionalidade === FuncionalidadeEnum.CADASTRAR) {
      this.entradaSaidaFacade.postEntradaInserir(dados).subscribe((data: any) => {
        if (data.executouServico == false) {
          this.alertService.showAlertWarning('', data.mensagemFalha, '', '0');
        } else {
          this.onVisualizar(data.codigo);
          this.alertService.showAlertSuccess('', data.mensagemSucesso, '', '0');
        }
      });
    } else {
      this.entradaSaidaFacade.postEntradaAtualiza(dados).subscribe((data: any) => {
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
    this.dadosModal.operacao = EnumOperacaoeStoque.ENTRADA;
    this.dadosModal.data =  dados.dataEmissao;
    this.dadosModal.numeroNota = dados.numeroNota;
    this.dadosModal.valorTotal = dados.valorTotal;
    this.dadosModal.movimentacaoRealizada = dados.movimentacaoRealizada == 'True' ? true : false;
    
    this.form.patchValue({
      tipoMovimentoID: dados.tipoMovimentoID,
      pessoaID: { codigo: dados.pessoaID, descricao: dados.nomeCliente },
      estoqueID: dados.estoqueID,
      serie: dados.serie,
      numeroNota: dados.numeroNota,
      dataEmissao: this.pipe.transform(dados.dataEmissao, "yyyy-MM-dd"),
      dataMovimento: this.pipe.transform(dados.dataMovimento, "yyyy-MM-dd"),
      valor: dados.valor,
      valorDesconto: dados.valorDesconto,
      valorAcrescimo: dados.valorAcrescimo,
      descricao: dados.descricao,
      observacao: dados.observacao,
      valorFrete: dados.valorFrete,
      valorICMSSubstituicao: dados.valorICMSSubstituicao,
      valorIPI: dados.valorIPI,
      valorTotal: dados.valorTotal
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
      'app/listentradasaida/entradaestoque/editar/',
      this.codigoRegistro,
      FuncionalidadeEnum.EDITAR
    );
  }

  onVisualizar(codigo: string) {
    return new Configuracao().goTo(
      this.router,
      'app/listentradasaida/entradaestoque/visualizar/',
      codigo,
      FuncionalidadeEnum.VISUALIZAR
    );
  }

  onListPessoa() {
    this.pessoaFacade.getListPessoa('Todas').subscribe((response) => {
      this.listPessoa = response;
    });
  }

  onListEstoquePessoa() {
    this.estoquePessoaFacade.getListEstoquePessoa().subscribe((response) => {      
      this.listEstoque = response;
    });
  }

  onListTipoMovimento() {
    this.tipoMovimentoFacade.getListTipoMovimento('E').subscribe((response) => {
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
}
