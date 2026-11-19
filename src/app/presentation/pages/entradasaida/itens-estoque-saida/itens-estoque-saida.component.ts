import { paraNumero } from 'src/app/core/utils/numero';
import { ItensEntradaSaidaFacade } from 'src/app/application/facade/itens-entrada-saida.facade';
import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators, } from '@angular/forms';
import { Configuracao } from 'src/app/core/utils/configuracao';
import { RouterModule } from '@angular/router';
import { AlertService } from 'src/app/presentation/services-ui/alert.service';
import { MatSortModule } from '@angular/material/sort';
import { ItensEntradaSaidaFiltroGridViewModel, ItensSaidaPostViewModel, MovimentarEstoqueViewModel,} from 'src/app/core/models/itens-entrada-saida.models';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { EnumNaturezaOperacao } from 'src/app/core/enums/enum.types';
import { SelectDropModel } from 'src/app/core/models/generics.models';
import { EntradaSaidaFacade } from 'src/app/application/facade/entrada-saida.facade';
import { EntradaSaidaRetornoViewModel } from 'src/app/core/models/entrada-saida.models';
import { EstoqueProdutoFacade } from 'src/app/application/facade/estoque-produto.facade';
import { EstoqueProdutoRetornoViewModel } from 'src/app/core/models/estoque-produto.models';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';
import { AutocompleteComponent } from 'src/app/presentation/components/autocomplete/autocomplete.component';

@Component({
    selector: 'app-itens-estoque-saida',
    imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    TooltipModule,
    AutocompleteComponent
  ],
    templateUrl: './itens-estoque-saida.component.html',
    styleUrls: ['./itens-estoque-saida.component.css']
})
export class ItensEstoqueSaidaComponent {
  @Input() dadosModal: any;
  form!: FormGroup;
  dadosUsuario = new Configuracao().recuperarDados();
  pipe = new DatePipe('en-US');
  page = {
    totalRows: 0,
    offset: 0,
    orderBy: 'ItemEntradaSaidaID',
    orderDir: 'desc',
    pageSize: 100,
    currentPage: 0,
  };
  displayedColumns: string[] = [
    'itemEntradaSaidaID',
    'descricao',
    'quantidade',
    'valorUnitario',
    'valorTotal',
    'button',
  ];
  controleTable: number = 0;
  controleMovimentacao: boolean = false;
  dataSource: ItensEntradaSaidaFiltroGridViewModel[] = [];
  listProduto: SelectDropModel[] = [];
  produto!: EstoqueProdutoRetornoViewModel;
  entradaSaida!: EntradaSaidaRetornoViewModel;
  valorTotalItens!: any;
  
  constructor(
    private formBuilder: FormBuilder,
    private itensEntradaSaidaFacade: ItensEntradaSaidaFacade,
    private estoqueProdutoFacade: EstoqueProdutoFacade,
    private entradaSaidaFacade: EntradaSaidaFacade,
    private alertService: AlertService
  ) {
    this.form = this.montaFormGroup();
  }

  ngOnInit(): void {
    this.reloadTable();
    this.onListProdutos();
    this.onEntradaSaida();
  }

  reloadTable() {
    var dados = new ItensEntradaSaidaFiltroGridViewModel(
      this.dadosModal.codigo,
      this.page.offset.toString(),
      this.page.pageSize.toString(),
      this.page.orderBy,
      this.page.orderDir
    );

    this.itensEntradaSaidaFacade
      .getConsultarGrid(dados)
      .subscribe((response) => {
        this.controleTable = response.result.length;
        this.dataSource = response.result;
        this.valorTotalItens = response.result.reduce((total, valor) => total + valor.valorTotal, 0);        
      });
  }

  private montaFormGroup() {
    return this.formBuilder.group({
      produtoDescricaoID: [{ value: '', disabled: false },[Validators.required],],
      quantidade: [{ value: '0', disabled: false }, [Validators.required]],    
      valorTotal: [{ value: '0', disabled: false }, [Validators.required]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.alertService.showAlertWarning(
        'Itens Entrada Estoque',
        'Existem campos obrigatórios não preenchidos ou com erro.',
        '',
        '0'
      );
      return;
    }

    const dadosForm = this.form.value;
    const dados = new ItensSaidaPostViewModel(   
      this.dadosModal.codigo,
      dadosForm.produtoDescricaoID.codigo,     
      dadosForm.quantidade.toString(),
      this.produto.precoMedio.toString(),
      '0',
      dadosForm.valorSubTotal == '' ? '0' : dadosForm.valorTotal.toString().replace('.', ','),
      dadosForm.valorTotal == '' ? '0' : dadosForm.valorTotal.toString().replace('.', ','), 
      EnumNaturezaOperacao.INCLUSAO,
      this.dadosUsuario.usuarioID.toString()
    ); 
   
    this.itensEntradaSaidaFacade.postInserirSaidas(dados).subscribe((data: any) => {
      if (data.executouServico == false) {
        this.alertService.showAlertWarning('', data.mensagemFalha, '', '0');
      } else {
        this.reloadTable();      
        this.onReset(); 
        this.onListProdutos();
        this.alertService.showAlertSuccess('', data.mensagemSucesso, '', '0');        
      }
    });
  }

  onListProdutos() {
    this.estoqueProdutoFacade
      .getListSelectEstoqueProdutoItens(this.dadosModal.codigo)
      .subscribe((response) => {
        this.listProduto = response;
      });
  }

  onCalculaValorTotal(valor: string, desconto: string, quantidada: string) {
    let nValor = paraNumero(valor);
    let nDesconto = paraNumero(desconto);
    let nQuant = parseInt(quantidada);
    let nUnitario = nValor - nDesconto;
    let soma = nQuant * nUnitario;
    this.f.valorTotal.setValue(soma); 
  }

  onExcluir(row: any) {
    const result$ = this.alertService.showConfirm(
      'Atenção',
      'Deseja excluir o item?',
      '',
      'Não',
      'Sim'
    );

    result$.asObservable().subscribe((dados) => {
      if (dados) {
        this.itensEntradaSaidaFacade
          .getDeleteID(row.itemEntradaSaidaID)
          .subscribe((data) => {
            if (data.executouServico == false) {
              this.alertService.showAlertWarning(
                'Entrada/Saída',
                data.mensagemFalha,
                '',
                '0'
              );
            } else {
              this.alertService.showAlertSuccess(
                'Entrada/Saída',
                data.mensagemSucesso,
                '',
                '0'
              );
              this.reloadTable();
              this.onListProdutos();
            }
          });
      }
    });
  }

  onReset() {
    this.f.produtoDescricaoID.setValue(null);        
    this.f.quantidade.setValue(null);
    this.f.valorUnitario.setValue('0');
    this.f.valorDesconto.setValue('0');
    this.f.valorTotal.setValue('0');
    
  }

  onMovimentarEstoque() {
    const result$ = this.alertService.showConfirm(
      'Atenção',
      'Deseja finalizar a inclusão os itens e movimentar o estoque?',
      '',
      'Não',
      'Sim'
    );

    result$.asObservable().subscribe((dados) => {    
        if (dados) {
          const dados = new MovimentarEstoqueViewModel(
            this.dadosModal.codigo,
            this.dadosModal.estoqueID,
            this.pipe.transform(this.dadosModal.data, 'dd/MM/yyyy') || '',
            this.dadosModal.operacao,
            EnumNaturezaOperacao.INCLUSAO,
            this.dadosUsuario.usuarioID.toString()
          );
  
          this.itensEntradaSaidaFacade.postAtualizaEstoque(dados)
            .subscribe((data) => {
              if (data.executouServico == false) {
                this.alertService.showAlertWarning('Entrada/Saída',data.mensagemFalha,'','0');
              } else {
                this.dadosModal.movimentacaoRealizada = true;
                this.alertService.showAlertSuccess('Entrada/Saída',data.mensagemSucesso,'','0');
                this.dadosModal.movimentacaoRealizada = true;
                this.reloadTable();
                this.onListProdutos();
              }
            });
        }    
    });
  }

  selectEvent(item: any) {
    if (this.dadosModal.operacao == 'S') {
      this.estoqueProdutoFacade
        .getConsultarID(item.codigo)
        .subscribe((response) => {      
          this.produto = response;          
        });
    }
  }

  onEntradaSaida() {    
      this.entradaSaidaFacade
        .getConsultarID(this.dadosModal.codigo)
        .subscribe((response) => {         
          this.entradaSaida = response;              
        });
    
  }

  onValorProduto(quantidade: any) {      
      if (parseInt(this.produto.saldo) < parseInt(quantidade)) {
        this.alertService.showAlertWarning(('Saldo Atual: '+ this.produto.saldo ), 'Produto com saldo menor que o solicitado','','0');
        this.f.quantidade.setValue('');
        this.f.valorTotal.setValue('');
        this.f.valorUnitario.setValue('');
      } else{       
        let soma = quantidade * parseFloat(this.produto.precoMedio);
        this.f.valorTotal.setValue(soma);      
      }         
  }
}
