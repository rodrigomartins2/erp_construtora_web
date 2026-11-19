import { Component, Input } from '@angular/core';
import { paraNumero } from 'src/app/core/utils/numero';
import { CommonModule, DatePipe } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Configuracao } from 'src/app/core/utils/configuracao';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {
  ItemPedidoCompraFiltroGridViewModel,
  ItemPedidoCompraPostViewModel,
} from 'src/app/core/models/itempedidocompra.models';
import { SelectDropModel } from 'src/app/core/models/generics.models';
import { ItemPedidoCompraFacade } from 'src/app/application/facade/item-pedido-compra.facade';
import { ProdutoDescricaoFacade } from 'src/app/application/facade/produto-descricao.facade';
import { AlertService } from 'src/app/presentation/services-ui/alert.service';
import { EnumNaturezaOperacao } from 'src/app/core/enums/enum.types';
import { ProdutoDescricaoRetornoViewModel } from 'src/app/core/models/produto-descricao.models';

import { PedidoCompraAlterarViewModel } from 'src/app/core/models/pedidocompra.models';
import { PedidoCompraFacade } from 'src/app/application/facade/pedido-compra.facade';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';
import { AutocompleteComponent } from 'src/app/presentation/components/autocomplete/autocomplete.component';

@Component({
    selector: 'app-modal-item-pedido',
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
    templateUrl: './modal-item-pedido.component.html',
    styleUrls: ['./modal-item-pedido.component.css']
})
export class ModalItemPedidoComponent {
  @Input() dadosModal: any;
  form!: FormGroup;
  dadosUsuario = new Configuracao().recuperarDados();
  pipe = new DatePipe('en-US');
  page = {
    totalRows: 0,
    offset: 0,
    orderBy: 'ItemPedidoCompraID',
    orderDir: 'desc',
    pageSize: 100,
    currentPage: 0,
  };
  displayedColumns: string[] = [
    'itemPedidoCompraID',
    'produto',
    'quantidade',
    'valorUnitario',
    'valorTotal',
    'button',
  ];
  controleTable: number = 0;
  controleMovimentacao: boolean = false;
  dataSource: ItemPedidoCompraFiltroGridViewModel[] = [];
  listProduto: SelectDropModel[] = [];
  produto!: ProdutoDescricaoRetornoViewModel;
  valorTotalItens!: any;
  controleAprovacao: boolean = true;
  pedidoCompra: any;

  constructor(
    private formBuilder: FormBuilder,
    private itemPedidoCompraFacade: ItemPedidoCompraFacade,
    private produtodescricaoFacade: ProdutoDescricaoFacade,
    private pedidoCompraFacade: PedidoCompraFacade,
    private alertService: AlertService
  ) {
    this.form = this.montaFormGroup();
  }

  ngOnInit(): void {
    this.reloadTable();
    this.onListProdutos();
    this.onPedidoCompra();
  }

  reloadTable() {
    var dados = new ItemPedidoCompraFiltroGridViewModel(
      this.dadosModal,
      this.page.offset.toString(),
      this.page.pageSize.toString(),
      this.page.orderBy,
      this.page.orderDir
    );

    console.log(this.dadosModal);
    console.log(dados);

    this.itemPedidoCompraFacade
      .getConsultarGrid(dados)
      .subscribe((response) => {
        this.controleTable = response.result.length;
        this.dataSource = response.result;
        this.valorTotalItens = response.result;
      });
  }

  getTotalCost() {
    return this.valorTotalItens
      .map((t: any) => t.valorTotal)
      .reduce((acc: any, value: any) => acc + parseFloat(value), 0);
  }

  private montaFormGroup() {
    return this.formBuilder.group({
      itemPedidoCompraID: [{ value: null, disabled: false }],
      produtoDescricaoID: [
        { value: '', disabled: false },
        [Validators.required],
      ],
      quantidade: [{ value: '', disabled: false }, [Validators.required]],
      valorUnitario: [{ value: '', disabled: false }, [Validators.required]],
      valorTotal: [{ value: '', disabled: false }, [Validators.required]],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.alertService.showAlertWarning(
        'Itens Pedido Compra',
        'Existem campos obrigatórios não preenchidos ou com erro.',
        '',
        '0'
      );
      return;
    }

    const dadosForm = this.form.value;
    const dados = new ItemPedidoCompraPostViewModel(
      dadosForm.itemPedidoCompraID,
      this.dadosModal,
      dadosForm.produtoDescricaoID.codigo,
      dadosForm.quantidade.toString(),
      dadosForm.valorUnitario == ''
        ? '0'
        : dadosForm.valorUnitario.toString().replace('.', ','),
      dadosForm.valorTotal == ''
        ? '0'
        : dadosForm.valorTotal.toString().replace('.', ','),
        EnumNaturezaOperacao.INCLUSAO,
      this.dadosUsuario.usuarioID.toString()
    );

    if (dados.itemPedidoCompraID != null) {
      this.itemPedidoCompraFacade
        .postAtualiza(dados)
        .subscribe((data: any) => {
          if (data.executouServico == false) {
            this.alertService.showAlertWarning('', data.mensagemFalha, '', '0');
          } else {
            this.reloadTable();
            this.onReset();
            this.onListProdutos();

            this.alertService.showAlertSuccess(
              '',
              data.mensagemSucesso,
              '',
              '0'
            );
          }
        });
    } else {
      this.itemPedidoCompraFacade.postInserir(dados).subscribe((data: any) => {
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
  }

  onAtualizaPedido() {
    const dados = new PedidoCompraAlterarViewModel(
      this.dadosModal,
      this.getTotalCost().toString().replace('.', ','),
      this.dadosUsuario.usuarioID.toString(),
      this.pipe.transform(Date.now(), 'yyyy-MM-dd') || '',
      this.valorTotalItens.length.toString(),
      EnumNaturezaOperacao.INCLUSAO,
      this.dadosUsuario.usuarioID.toString()
    );

    console.log(dados);

    this.pedidoCompraFacade
      .postAtualizaPedidoCompra(dados)
      .subscribe((data: any) => {
        if (data.executouServico == false) {
          this.alertService.showAlertWarning('', data.mensagemFalha, '', '0');
        } else {
          this.reloadTable();
          this.onReset();
          this.onListProdutos();
          this.onPedidoCompra();
          this.alertService.showAlertSuccess('', data.mensagemSucesso, '', '0');
        }
      });
  }
  onLiberarEdicaoItens() {
    const dados = new PedidoCompraAlterarViewModel(
      this.dadosModal,
      this.getTotalCost().toString().replace('.', ','),
      '',
      '',
      this.valorTotalItens.length.toString(),
      EnumNaturezaOperacao.INCLUSAO,
      this.dadosUsuario.usuarioID.toString()
    );

    console.log(dados);

    this.pedidoCompraFacade
      .postAtualizaPedidoCompra(dados)
      .subscribe((data: any) => {
        if (data.executouServico == false) {
          this.alertService.showAlertWarning('', data.mensagemFalha, '', '0');
        } else {
          this.reloadTable();
          this.onReset();
          this.onListProdutos();
          this.onPedidoCompra();
          this.alertService.showAlertSuccess('', data.mensagemSucesso, '', '0');
        }
      });
  }

  onListProdutos() {
    this.produtodescricaoFacade
      .getListSelectProdutoDescricaoItensPedidoCompra(this.dadosModal)
      .subscribe((response) => {
        this.listProduto = response;
      });
  }

  onCalculaValorTotal(valor: any, quantidada: any) {
    let nValor = paraNumero(valor);
    let nQuant = parseInt(quantidada);
    let soma = nQuant * nValor;
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
        this.itemPedidoCompraFacade
          .getDeleteID(row.itemPedidoCompraID)
          .subscribe((data) => {
            if (data.executouServico == false) {
              this.alertService.showAlertWarning(
                'Pedido Compra',
                data.mensagemFalha,
                '',
                '0'
              );
            } else {
              this.alertService.showAlertSuccess(
                'Pedido Compra',
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
    this.f.produtoDescricaoID.reset();
    this.f.itemPedidoCompraID.reset();
    this.f.quantidade.reset();
    this.f.valorUnitario.reset();
    this.f.valorTotal.reset();
    this.montaFormGroup();
  }

  onEditar(codigo: string) {
    this.itemPedidoCompraFacade
      .getConsultarID(codigo)
      .subscribe((response) => {
        this.atualizaFormulario(response);
      });
  }

  private atualizaFormulario(dados: any) {
    this.form.patchValue({
      itemPedidoCompraID: dados.itemPedidoCompraID,
      produtoDescricaoID: {
        codigo: dados.produtoDescricaoID,
        descricao: dados.produto,
      },
      quantidade: dados.quantidade,
      valorUnitario: dados.valorUnitario,
      valorTotal: dados.valorTotal,
    });
  }

  onPedidoCompra() {
    this.pedidoCompraFacade
      .getConsultarID(this.dadosModal)
      .subscribe((response) => {
        this.pedidoCompra = response;
        this.controleAprovacao = response.dataAprovacao != null ? false : true;
      });
  }
}
