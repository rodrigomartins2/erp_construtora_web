import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SelectDropModel } from 'src/app/core/models/generics.models';
import { RelatorioFacade } from 'src/app/application/facade/relatorio.facade';
import { PessoaFacade } from 'src/app/application/facade/pessoa.facade';
import { AlertService } from 'src/app/presentation/services-ui/alert.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
    selector: 'app-contrato-vencimentos',
    imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    RadioButtonModule
  ],
    templateUrl: './contrato-vencimentos.component.html',
    styleUrls: ['./contrato-vencimentos.component.css']
})
export class ContratoVencimentosComponent {
  myform!: FormGroup;
  listEmpresaPessoa: SelectDropModel[] = [];
  pdfData!: string;
  nomeArquivo!: string;

  listaSituacao: any[] = [
    { codigo: 'T', descricao: 'Todos' },
    { codigo: 'A', descricao: 'Ativo' },
    { codigo: 'I', descricao: 'Finalizado' },
  ];

  constructor(
    private relatorioFacade: RelatorioFacade,
    private pessoaFacade: PessoaFacade,
    private alertService: AlertService
  ) {
    this.onEmpresaPessoa();
  }

  ngOnInit(): void {
    this.myform = new FormGroup({
      dataInicio: new FormControl(),
      dataFim: new FormControl(),
      empresaID: new FormControl(),
      situacao: new FormControl(),
    });
    this.f.situacao.setValue('T');
  }

  get f(): { [key: string]: AbstractControl } {
    return this.myform.controls;
  }

  onRelatorio() {
    const dadosFormulario = this.myform.value;
    this.relatorioFacade
      .getRelContratoVencimento(
        dadosFormulario.dataInicio == null ? '0' : dadosFormulario.dataInicio,
        dadosFormulario.dataFim == null ? '0' : dadosFormulario.dataFim,
        dadosFormulario.empresaID == null ? '0' : dadosFormulario.empresaID,
        dadosFormulario.situacao
      )
      .subscribe((response) => {
        this.nomeArquivo = 'ContratosComVencimentos' + '.pdf';
        this.pdfData = window.URL.createObjectURL(response);
        window.open(this.pdfData);
      });
  }

  onResetCampos() {
    this.myform.reset({
      descricao: '',
      situacao: 'T',
      dataInicio: '',
      dataFim: '',
    });
  }

  onEmpresaPessoa() {
    this.pessoaFacade.getListPessoa('Propria').subscribe((response) => {
      this.listEmpresaPessoa = response;
    });
  }
}
