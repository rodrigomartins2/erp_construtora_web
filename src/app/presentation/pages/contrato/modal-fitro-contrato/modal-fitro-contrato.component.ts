import { Component, EventEmitter, Output, inject } from '@angular/core';
import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';
import { ModalRef, ModalService } from 'src/app/presentation/services-ui/modal.service';
import { FiltroModalContratoViewModel } from 'src/app/core/models/contrato.models';
import { ModalFitroContratoService } from 'src/app/presentation/pages/contrato/modal-fitro-contrato/modal-fitro-contrato.service';
import { SelectDropModel } from 'src/app/core/models/generics.models';
import { LISTA_SITUACAO_REGISTRO } from 'src/app/core/constants/listas.const';
import { ContratoFacade } from 'src/app/application/facade/contrato.facade';
import { PessoaFacade } from 'src/app/application/facade/pessoa.facade';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
    selector: 'app-modal-fitro-contrato',
    imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    RadioButtonModule
  ],
    templateUrl: './modal-fitro-contrato.component.html',
    styleUrl: './modal-fitro-contrato.component.css'
})
export class ModalFitroContratoComponent {
  form!: UntypedFormGroup;
  filtro: FiltroModalContratoViewModel;
  @Output() dadosFiltro: EventEmitter<FiltroModalContratoViewModel>;
  listaSituacao = LISTA_SITUACAO_REGISTRO;
  modalRef = inject(ModalRef);

  listClienteContrato: SelectDropModel[] = [];
  listEmpresaContrato: SelectDropModel[] = [];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private modalFiltroCategoriaService: ModalFitroContratoService,
    public modalService: ModalService,
    public pessoaFacade: PessoaFacade,
    public contratoFacade: ContratoFacade
  ) {
    this.dadosFiltro = new EventEmitter<FiltroModalContratoViewModel>();
    this.filtro = new FiltroModalContratoViewModel();
    this.form = this.montaFormGroup();
    this.onCliente();
    this.onEmpresaContratoCliente();
  }

  ngOnInit() {
    this.modalFiltroCategoriaService
      .asObservable()
      .subscribe((data: FiltroModalContratoViewModel) => {
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
      empresaPessoaID: [this.filtro.empresaPessoaID],
      dataInicioContrato: [this.filtro.dataInicioContrato],
      dataFimContrato: [this.filtro.dataFimContrato],
      situacao: [this.filtro.situacao],
    });
  }

  private atualizaFormGroup(data: FiltroModalContratoViewModel) {
    this.form.patchValue(data);
    this.form.updateValueAndValidity();
  }

  onCliente() {
     this.contratoFacade.getListClienteContrato().subscribe((response) => {
       this.listClienteContrato = response;
     });
  }

  onEmpresaContratoCliente() {
     this.pessoaFacade.getListPessoa('Empresa').subscribe((response) => {
       this.listEmpresaContrato = response;
     });
  }

  public aplicarFiltro() {
    if (this.form.invalid) {
      return;
    }
    console.log(this.f.pessoaID?.value)
    this.dadosFiltro.emit({
      pessoaID: this.f.pessoaID?.value,
      empresaPessoaID: this.f.empresaPessoaID?.value,
      dataInicioContrato: this.f.dataInicioContrato?.value,
      dataFimContrato: this.f.dataFimContrato?.value,
      situacao: this.f.situacao?.value     
    });
    this.modalRef.hide();
  }

  public limparFiltro() {
    this.filtro = new FiltroModalContratoViewModel();
    this.form.patchValue(this.filtro);
  }
}
