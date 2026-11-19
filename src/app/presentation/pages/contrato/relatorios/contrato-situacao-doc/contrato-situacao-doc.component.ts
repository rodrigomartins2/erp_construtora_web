import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { SelectDropModel } from 'src/app/core/models/generics.models';
import { PessoaFacade } from 'src/app/application/facade/pessoa.facade';
import { AlertService } from 'src/app/presentation/services-ui/alert.service';
import { RouterModule } from '@angular/router';
import { RelatorioFacade } from 'src/app/application/facade/relatorio.facade';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
    selector: 'app-contrato-situacao-doc',
    imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    SelectModule,
    RadioButtonModule
  ],
    templateUrl: './contrato-situacao-doc.component.html',
    styleUrls: ['./contrato-situacao-doc.component.css']
})
export class ContratoSituacaoDocComponent {
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
        .getRelSituacaoDocContrato(
          dadosFormulario.empresaID == null ? '0' : dadosFormulario.empresaID,
          dadosFormulario.situacao
        )
        .subscribe((response) => {
          this.nomeArquivo = 'ContratosSituaçãoDocumentos' + '.pdf';
          this.pdfData = window.URL.createObjectURL(response);
          window.open(this.pdfData);
        });
   
  }

  onResetCampos() {
    this.myform.reset({
      descricao: '',
      situacao: 'T',
    });
  }

  onEmpresaPessoa() {
    this.pessoaFacade.getListPessoa('Propria').subscribe((response) => {
      this.listEmpresaPessoa = response;
    });
  }
}
