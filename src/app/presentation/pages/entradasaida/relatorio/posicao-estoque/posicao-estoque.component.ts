import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ModalRef, ModalService, ModalOptions } from 'src/app/presentation/services-ui/modal.service';
import { SelectDropModel } from 'src/app/core/models/generics.models';
import { AlertService } from 'src/app/presentation/services-ui/alert.service';
import { EstoquePessoaFacade } from 'src/app/application/facade/estoque-pessoa.facade';
import { RelatorioFacade } from 'src/app/application/facade/relatorio.facade';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { VisualizarPdfComponent } from 'src/app/presentation/components/visualizar-pdf/visualizar-pdf.component';

@Component({
    selector: 'app-posicao-estoque',
    templateUrl: './posicao-estoque.component.html',
    styleUrls: ['./posicao-estoque.component.css'],
    imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    ButtonModule,
    SelectModule,
    VisualizarPdfComponent
  ]
})
export class PosicaoEstoqueComponent {
  myform!: FormGroup;
  pdfData!: string;
  nomeArquivo!: string;
  modalRef!: ModalRef;
  listEstoque: SelectDropModel[] = [];
  @ViewChild('templateModalRelPosicaoEstoque')
  modalRelPosicaoEstoque!: TemplateRef<any>;
  estoque: string = '';
  dateNow = new Date();
  listTipoRelatorios: any[] = [
    { codigo: 'PE', descricao: 'Posição Geral do Estoque' },
    { codigo: 'ME', descricao: 'Movimentação de Entrada e Saída do Estoque' },
  ];

  constructor(
    private relatorioFacade: RelatorioFacade,
    private alertService: AlertService,
    private estoquePessoaFacade: EstoquePessoaFacade,
    private modalService: ModalService
  ) {
    this.onListEstoquePessoa();
  }

  ngOnInit(): void {
    this.myform = new FormGroup({
      estoqueID: new FormControl(),
      tipoRelatorio: new FormControl(),
    });
  }

  modalEstoque() {
    const dadosFormulario = this.myform.value;    

    if(dadosFormulario.tipoRelatorio != null){
    // this.openModalWithClass(this.modalRelPosicaoEstoque);
   
    let nEstoqueID = dadosFormulario.estoqueID == null ? '0' : dadosFormulario.estoqueID;
    this.pdfData = '';
    if (
      nEstoqueID != '0' &&
      dadosFormulario.tipoRelatorio == 'PE'
    ) {
      let nomeEstoque = this.listEstoque.filter(
        (a) => a.codigo == nEstoqueID
      );
      this.estoque =
        nomeEstoque[0].descricao + ', ' + this.dateNow.toLocaleDateString();
    } else this.estoque = 'Estoque Geral,' + this.dateNow.toLocaleDateString();

    if (dadosFormulario.tipoRelatorio == 'PE') {
      this.relatorioFacade
        .getRelPosicaoEstoque(nEstoqueID)
        .subscribe({
          next: (response) => {
            console.log(response);
            this.abrirRelatorio(response, 'PosicaoEstoque_' + '.pdf');
          },
          error: () => this.avisarRelatorioNaoEncontrado(),
        });
        return;
    }
    if (dadosFormulario.tipoRelatorio == 'ME') {
      this.relatorioFacade
        .getRelMovimentacaoEstoque(nEstoqueID)
        .subscribe({
          next: (response) => {
            console.log(response);
            this.abrirRelatorio(response, 'MovimentacaoEstoque' + '.pdf');
          },
          error: () => this.avisarRelatorioNaoEncontrado(),
        });
        return;
    }} else {
      this.alertService.showAlertInfo('Relatório de Estoque', 'Selecione o Tipo de Relatório!', '', '0');
    }

  }

  private abrirRelatorio(response: Blob | null, nomeArquivo: string) {
    if (response == null || response.size === 0) {
      this.avisarRelatorioNaoEncontrado();
      return;
    }

    this.nomeArquivo = nomeArquivo;
    this.pdfData = window.URL.createObjectURL(response);
    window.open(this.pdfData);
  }

  private avisarRelatorioNaoEncontrado() {
    this.alertService.showAlertInfo('Relatório de Estoque', 'Não há relatório para os filtros informados!', '', '0');
  }

  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
  }

  config: ModalOptions = {
    backdrop: 'static',
    keyboard: false,
    animated: true,
    ignoreBackdropClick: true,
    class: 'modal-xl',
  };

  onListEstoquePessoa() {
    this.estoquePessoaFacade.getListEstoquePessoa().subscribe((response) => {
      this.listEstoque = response;
    });
  }

  onResetCampos() {
    this.myform.reset({
      estoqueID: '',
      dataInicio: '',
      dataFim: '',
    });
  }
}
