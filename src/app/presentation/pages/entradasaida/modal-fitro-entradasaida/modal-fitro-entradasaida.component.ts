import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { AbstractControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ModalRef, ModalService } from 'src/app/presentation/services-ui/modal.service';
import { LISTA_SITUACAO_REGISTRO, LISTA_TIPO_OPERACAO } from 'src/app/core/constants/listas.const';
import { FiltroModalEntradaSaidaViewModel } from 'src/app/core/models/entrada-saida.models';
import { SelectDropModel } from 'src/app/core/models/generics.models';
import { ModalFitroEntradasaidaService } from 'src/app/presentation/pages/entradasaida/modal-fitro-entradasaida/modal-fitro-entradasaida.service';
import { PessoaFacade } from 'src/app/application/facade/pessoa.facade';
import { EnumSubTipoPessoa } from 'src/app/core/enums/enum.types';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { AutocompleteComponent } from 'src/app/presentation/components/autocomplete/autocomplete.component';

@Component({
    selector: 'app-modal-fitro-entradasaida',
    imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    RadioButtonModule,
    AutocompleteComponent
  ],
    templateUrl: './modal-fitro-entradasaida.component.html',
    styleUrl: './modal-fitro-entradasaida.component.css'
})
export class ModalFitroEntradasaidaComponent {
 form!: UntypedFormGroup; 
   filtro: FiltroModalEntradaSaidaViewModel;
   @Output() dadosFiltro: EventEmitter<FiltroModalEntradaSaidaViewModel>;
   listaSituacao = LISTA_SITUACAO_REGISTRO;
   listaTipoOperacao = LISTA_TIPO_OPERACAO;
   modalRef = inject(ModalRef);
  
   listaCliente: SelectDropModel[] = [];
 
   constructor(
     private formBuilder: UntypedFormBuilder,
     private modalFitroEntradasaidaService: ModalFitroEntradasaidaService,
     private pessoaFacade: PessoaFacade,
     public modalService: ModalService
   ) {
     this.dadosFiltro = new EventEmitter<FiltroModalEntradaSaidaViewModel>();
     this.filtro = new FiltroModalEntradaSaidaViewModel();
     this.form = this.montaFormGroup();
     this.onCliente();
   }
 
   ngOnInit() {
     this.modalFitroEntradasaidaService
       .asObservable()
       .subscribe((data: FiltroModalEntradaSaidaViewModel) => {
         this.filtro = data;
         this.atualizaFormGroup(this.filtro);
       });
   }
 
 
   get f(): { [key: string]: AbstractControl } {
     return this.form.controls;
   }
 
   private montaFormGroup() {
     return this.formBuilder.group({
      pessoaID: [this.filtro.pessoaID],
      numeroNota: [this.filtro.numeroNota],
      dataMovimentoIni: [this.filtro.dataMovimentoIni],
      dataMovimentoFim: [this.filtro.dataMovimentoFim],
      dataEmissaoIni: [this.filtro.dataEmissaoIni],
      dataEmissaoFim: [this.filtro.dataEmissaoFim],
      situacao: [this.filtro.situacao],
      operacao: [this.filtro.operacao]
     });
   }
 
   private atualizaFormGroup(data: FiltroModalEntradaSaidaViewModel) {
     this.form.patchValue(data);
     this.form.updateValueAndValidity();
   }
 
   onCliente() {
     this.pessoaFacade.getListPessoa(EnumSubTipoPessoa.TODAS).subscribe((response) => {
       this.listaCliente = response;''
     });
   }
 
   public aplicarFiltro() {
     if (this.form.invalid) {
       return;
     }
 
     this.dadosFiltro.emit({
      pessoaID: this.f.pessoaID?.value,
      numeroNota: this.f.numeroNota?.value,      
      dataMovimentoIni: this.f.dataMovimentoIni?.value,
      dataMovimentoFim: this.f.dataMovimentoFim?.value,
      dataEmissaoIni: this.f.dataEmissaoIni?.value,
      dataEmissaoFim: this.f.dataEmissaoFim?.value,
      situacao: this.f.situacao?.value,
      operacao: this.f.operacao?.value
     });
    this.modalRef.hide();
   }
 
   public limparFiltro() {
     this.filtro = new FiltroModalEntradaSaidaViewModel();
     this.form.patchValue(this.filtro);
   }
}
