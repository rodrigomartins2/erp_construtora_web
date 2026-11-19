import { Component, EventEmitter, Output, inject } from '@angular/core';
import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';
import { ModalFitroCategoriaService } from 'src/app/presentation/pages/categoria/modal-fitro-categoria/modal-fitro-categoria.service';
import { ModalRef, ModalService } from 'src/app/presentation/services-ui/modal.service';
import { CommonModule } from '@angular/common';
import {
  LISTA_SITUACAO_REGISTRO,
  LISTA_TIPO_CATEGORIA,
} from 'src/app/core/constants/listas.const';
import { CategoriaPrincipalFacade } from 'src/app/application/facade/categoria-principal.facade';
import { SelectDropModel } from 'src/app/core/models/generics.models';
import { FiltroModalCategoriaViewModel } from 'src/app/core/models/categoria.models';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
    selector: 'app-modal-fitro-categoria',
    imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    RadioButtonModule
  ],
    templateUrl: './modal-fitro-categoria.component.html',
    styleUrl: './modal-fitro-categoria.component.css'
})
export class ModalFitroCategoriaComponent {
  form!: UntypedFormGroup; 
  filtro: FiltroModalCategoriaViewModel;
  @Output() dadosFiltro: EventEmitter<FiltroModalCategoriaViewModel>;
  listaSituacao = LISTA_SITUACAO_REGISTRO;
  listaTipo = LISTA_TIPO_CATEGORIA;
  modalRef = inject(ModalRef);
 
  listCategoriaPrincipal: SelectDropModel[] = [];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private modalFiltroCategoriaService: ModalFitroCategoriaService,
    private categoriaPrincipalFacade: CategoriaPrincipalFacade,
    public modalService: ModalService
  ) {
    this.dadosFiltro = new EventEmitter<FiltroModalCategoriaViewModel>();
    this.filtro = new FiltroModalCategoriaViewModel();
    this.form = this.montaFormGroup();
    this.onCategoriaPrincipal();
  }

  ngOnInit() {
    this.modalFiltroCategoriaService
      .asObservable()
      .subscribe((data: FiltroModalCategoriaViewModel) => {
        this.filtro = data;
        this.atualizaFormGroup(this.filtro);
      });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  private montaFormGroup() {
    return this.formBuilder.group({
      categoriaPrincipalID: [this.filtro.categoriaPrincipalID],
      descricao: [this.filtro.descricao],
      tipo: [this.filtro.tipo],
      situacao: [this.filtro.situacao],
    });
  }

  private atualizaFormGroup(data: FiltroModalCategoriaViewModel) {
    this.form.patchValue(data);
    this.form.updateValueAndValidity();
  }

  onCategoriaPrincipal() {
    this.categoriaPrincipalFacade.getListCategoria().subscribe((response) => {
      this.listCategoriaPrincipal = response;
    });
  }

  public aplicarFiltro() {
    if (this.form.invalid) {
      return;
    }

    this.dadosFiltro.emit({
      categoriaPrincipalID: this.f.categoriaPrincipalID?.value,
      descricao: this.f.descricao?.value,
      tipo: this.f.tipo?.value,
      situacao: this.f.situacao?.value,
    });
    this.modalRef.hide();
  }

  public limparFiltro() {
    this.filtro = new FiltroModalCategoriaViewModel();
    this.form.patchValue(this.filtro);
  }
}
