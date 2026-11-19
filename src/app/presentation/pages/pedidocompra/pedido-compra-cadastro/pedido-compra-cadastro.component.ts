import { Component, TemplateRef, ViewChild } from '@angular/core';
import { paraNumero } from 'src/app/core/utils/numero';
import { CommonModule, DatePipe } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FuncionalidadeEnum } from 'src/app/core/enums/funcionalidade.enum';
import { Configuracao } from 'src/app/core/utils/configuracao';
import { SelectDropModel } from 'src/app/core/models/generics.models';
import { ModalRef, ModalService, ModalOptions } from 'src/app/presentation/services-ui/modal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PessoaFacade } from 'src/app/application/facade/pessoa.facade';
import { AlertService } from 'src/app/presentation/services-ui/alert.service';
import { PedidoCompraPostViewModel } from 'src/app/core/models/pedidocompra.models';
import { EnumNaturezaOperacao } from 'src/app/core/enums/enum.types';
import { EstoquePessoaFacade } from 'src/app/application/facade/estoque-pessoa.facade';
import { ObraFacade } from 'src/app/application/facade/obra.facade';
import { ModalItemPedidoComponent } from 'src/app/presentation/pages/pedidocompra/modal-item-pedido/modal-item-pedido.component';
import { PedidoCompraFacade } from 'src/app/application/facade/pedido-compra.facade';
import { RelatorioFacade } from 'src/app/application/facade/relatorio.facade';
import { FormaPagamentoFacade } from 'src/app/application/facade/forma-pagamento.facade';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { AutocompleteComponent } from 'src/app/presentation/components/autocomplete/autocomplete.component';
import { VisualizarPdfComponent } from 'src/app/presentation/components/visualizar-pdf/visualizar-pdf.component';

@Component({
    selector: 'app-pedido-compra-cadastro',
    imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalItemPedidoComponent,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    TextareaModule,
    AutocompleteComponent,
    VisualizarPdfComponent
  ],
    templateUrl: './pedido-compra-cadastro.component.html',
    styleUrls: ['./pedido-compra-cadastro.component.css']
})
export class PedidoCompraCadastroComponent {
  pipe = new DatePipe("en-US");
  funcionalidade = FuncionalidadeEnum.CADASTRAR;
  form!: FormGroup;
  dadosUsuario = new Configuracao().recuperarDados();
  codigoRegistro: string = '';
  dataEmissao: string = '';
  listPessoa: SelectDropModel[] = [];
  listObra: SelectDropModel[] = [];
  listEstoque: SelectDropModel[] = [];
  listFormaPagamento: SelectDropModel[] = [];
  modalRef!: ModalRef;
  @ViewChild("templateModalItensEstoque") modalItensEstoque!: TemplateRef<any>;
  @ViewChild("templateModalOrdemCompra") modalOrdemCompra!: TemplateRef<any>;
  dadosModal!: any;
  nomeModal!: any;
  pdfData!: string;
  nomeArquivo!: string;
  totalItens!: string;
  controleAprovacao: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private pedidoCompraFacade: PedidoCompraFacade,
    private modalService: ModalService,
    private pessoaFacade: PessoaFacade,
    private alertService: AlertService,
    private estoquePessoaFacade: EstoquePessoaFacade,
    private obraFacade: ObraFacade,
    private relatoriosFacade: RelatorioFacade,
    private formaPagamentoFacade: FormaPagamentoFacade,
    private router: Router
  ) {
    const func = this.route.snapshot.paramMap.get('funcionalidade');
    this.codigoRegistro = this.route.snapshot.paramMap.get('codigo') || '';
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

    this.onListPessoa();   
    this.onListObra();
    this.onListEstoquePessoa();   
    this.onListFormaPagamento(); 
  }

  private montaFormGroup() {
    return this.formBuilder.group({
      pedidoCompraID: [{ value: '', disabled: false }],
      pessoaID: [{ value: '', disabled: false }, [Validators.required]],
      estoqueID: [{ value: '', disabled: false }],
      obraID: [{ value: '', disabled: false }],
      dataPedido: [{ value: '', disabled: false }, [Validators.required]],
      valorFretes: [{ value: '', disabled: false }],   
      dataCotacao: [{ value: '', disabled: false }],     
      dataEntrega: [{ value: '', disabled: false }],      
      formaPagamentoID: [{ value: '', disabled: false }],
      observacao: [{ value: '', disabled: false }],

      usuarioAprovacao: [{ value: '', disabled: true }],
      dataAprovacao: [{ value: '', disabled: true }],
      usuarioComprador: [{ value: '', disabled: true }],
      valor: [{ value: '', disabled: true }],
      valorTotal:  [{ value: '', disabled: true }],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  montaDados(codigo: string) {
    this.pedidoCompraFacade.getConsultarID(codigo).subscribe((response) => {      
      if (!response) {
        this.alertService.showAlertWarning(
          'Pedido Compra',
          'Não foi possível localizar os dados!.',
          'app/listpedido',
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
        'Pedido Compra',
        'Existem campos obrigatórios não preenchidos ou com erro.',
        '',
        '0'
      );
      return;
    }

    const dadosForm = this.form.value;   
    const dados = new PedidoCompraPostViewModel(
      this.codigoRegistro == '' ? '0' : this.codigoRegistro,
      dadosForm.pessoaID.codigo,
      dadosForm.estoqueID,   
      dadosForm.obraID,   
      dadosForm.dataPedido,
      dadosForm.valorFretes.toString(),
      this.dadosUsuario.usuarioID.toString(),
      dadosForm.dataCotacao,
      dadosForm.dataEntrega,
      dadosForm.formaPagamentoID,
      dadosForm.observacao,     
      this.funcionalidade === FuncionalidadeEnum.CADASTRAR
        ? EnumNaturezaOperacao.INCLUSAO
        : EnumNaturezaOperacao.ALTERACAO,
      this.dadosUsuario.usuarioID.toString()
    );

    if (this.funcionalidade === FuncionalidadeEnum.CADASTRAR) {
      this.pedidoCompraFacade.postInserir(dados).subscribe((data: any) => {
        if (data.executouServico == false) {
          this.alertService.showAlertWarning('', data.mensagemFalha, '', '0');
        } else {
          this.onVisualizar(data.codigo);
          this.alertService.showAlertSuccess('', data.mensagemSucesso, '', '0');
        }
      });
    } else {
      this.pedidoCompraFacade.postAtualiza(dados).subscribe((data: any) => {
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
    this.nomeModal = 'Pedido Nro.: ' + dados.pedidoCompraID+', Empresa: '+dados.clienteFornecedor+', '+
                     'de ' + this.pipe.transform(dados.dataPedido, "dd/MM/yyyy");
    
    this.totalItens =  dados.totalItens;
     this.controleAprovacao = dados.dataAprovacao != null? false : true; 
    this.form.patchValue({
      pedidoCompraID: dados.pedidoCompraID,
      pessoaID: { codigo: dados.pessoaID, descricao: dados.clienteFornecedor },
      estoqueID: dados.estoqueID,
      obraID: dados.obraID,
      dataPedido: this.pipe.transform(dados.dataPedido, "yyyy-MM-dd"),
      valorFretes: dados.valorFrete == null ? '0' : dados.valorFrete,
      dataCotacao: this.pipe.transform(dados.dataCotacao, "yyyy-MM-dd"),
      dataEntrega: this.pipe.transform(dados.dataEntrega, "yyyy-MM-dd"),
      formaPagamentoID: dados.formaPagamentoID,
      observacao: dados.observacao,
      usuarioAprovacao: dados.usuarioAprovacao,
      dataAprovacao: this.pipe.transform(dados.dataAprovacao, "yyyy-MM-dd"),
      usuarioComprador: dados.usuarioComprador,
      valor: dados.valor == null ? '0' : dados.valor,
      valorTotal: dados.valorTotal == null ? '0' : dados.valorTotal
    });
  }

  private habilitaCampos() {
    if (this.funcionalidade === FuncionalidadeEnum.VISUALIZAR) {
      return;
    }

    //this.form.enable();
    this.f.pessoaID?.enable();
    this.f.estoqueID?.enable();
    this.f.obraID?.enable();
    this.f.dataPedido?.enable();
    this.f.valorFretes?.enable();
    this.f.dataCotacao?.enable();
    this.f.dataEntrega?.enable();
    this.f.formaPagamento?.enable();
    this.f.observacao?.enable();
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
    this.router.navigate(['app/listpedido/']);
  }

  onAtualizaValorTotal(valor: any, valorFrete: any, valorTotal: any) {
    let nValor = paraNumero(valor);
    let nValorFrete = paraNumero(valorFrete);
    let nValorTotal = paraNumero(valorTotal);
    let soma = nValor + nValorFrete + nValorTotal;
   
    this.f.valorTotal.setValue(soma);
  }

  onEditar() {
    return new Configuracao().goTo(
      this.router,
      'app/listpedido/pedidocadastro/editar/',
      this.codigoRegistro,
      FuncionalidadeEnum.EDITAR
    );
  }

  onVisualizar(codigo: string) {
    return new Configuracao().goTo(
      this.router,
      'app/listpedido/pedidocadastro/visualizar/',
      codigo,
      FuncionalidadeEnum.VISUALIZAR
    );
  }

  onListPessoa() {
    this.pessoaFacade.getListPessoa('Todas').subscribe((response) => {
      this.listPessoa = response;
    });
  }

  onListObra() {
    this.obraFacade.getListObra().subscribe((response) => {
      this.listObra = response;
    });
  }

  onListFormaPagamento() {
    this.formaPagamentoFacade.getListFormaPagamento().subscribe((response) => {
      this.listFormaPagamento = response;
    });
  }

  onListEstoquePessoa() {
    this.estoquePessoaFacade.getListEstoquePessoa().subscribe((response) => {      
      this.listEstoque = response;
    });
  }
 
  public abrirModalItens() {   
    this.dadosModal  =  this.codigoRegistro; 
    this.openModalWithClass(this.modalItensEstoque);
  }

  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
  }

  config: ModalOptions = {
    backdrop: 'static',
    keyboard: false,
    ignoreBackdropClick: true,
    class: "modal-xl",
  };


  public abrirModalOrdemCompra() {   
    this.onRelatorio();     
    this.openModalWithClass(this.modalOrdemCompra);
    this.modalRef.onHidden.subscribe((result: any) => {
      console.log('results', result);
    });
  }

  onRelatorio(){
    this.codigoRegistro
    this.pdfData = ''; 
    this.relatoriosFacade.getRelOrdemCompra(this.codigoRegistro).subscribe((response) => {      
        this.nomeArquivo = "OrdemCompra" + this.dadosModal + '_' + this.dadosModal + ".pdf";
        this.pdfData = window.URL.createObjectURL(response);
    });
  }

}
