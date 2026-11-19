import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Configuracao } from 'src/app/core/utils/configuracao';
import { EnumNaturezaOperacao } from 'src/app/core/enums/enum.types';
import { SelectDropModel } from 'src/app/core/models/generics.models';
import { MaterialObraFiltroGridViewModel, MaterialObraViewModel } from 'src/app/core/models/material-obra.models';
import { ProdutoDescricaoRetornoViewModel } from 'src/app/core/models/produto-descricao.models';
import { AlertService } from 'src/app/presentation/services-ui/alert.service';
import { MaterialObraFacade } from 'src/app/application/facade/material-obra.facade';
import { ProdutoDescricaoFacade } from 'src/app/application/facade/produto-descricao.facade';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { AutocompleteComponent } from 'src/app/presentation/components/autocomplete/autocomplete.component';

@Component({
    selector: 'app-modal-cad-material-obra',
    templateUrl: './modal-cad-material-obra.component.html',
    styleUrls: ['./modal-cad-material-obra.component.css'],
    imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    AutocompleteComponent
  ]
})
export class ModalCadMaterialObraComponent {
  @Input() codigoObra: any;
  form!: FormGroup;
  dadosUsuario = new Configuracao().recuperarDados();
  pipe = new DatePipe('en-US');
  page = {
    totalRows: 0,
    offset: 0,
    orderBy: 'MaterialObraID',
    orderDir: 'desc',
    pageSize: 100,
    currentPage: 0,
  };
  displayedColumns: string[] = [
    'materialObraID',
    'produto',
    'quantidade',
    'saldoEstoque',
    'button',
  ];
  controleTable: number = 0;
  controleMovimentacao: boolean = false;
  dataSource: MaterialObraFiltroGridViewModel[] = [];
  listProduto: SelectDropModel[] = [];
  listMaterialPedido: any;
  
  constructor(
    private formBuilder: FormBuilder,
    private produtodescricaoFacade: ProdutoDescricaoFacade,
    private materialObraFacade: MaterialObraFacade,
    private alertService: AlertService
  ) {
    this.form = this.montaFormGroup();
  }

  ngOnInit(): void {
    this.reloadTable();
    this.onListProdutos();
  }

  reloadTable() {
    var dados = new MaterialObraFiltroGridViewModel(
      this.codigoObra.obraID,
      this.page.offset.toString(),
      this.page.pageSize.toString(),
      this.page.orderBy,
      this.page.orderDir
    );

    this.materialObraFacade.getConsultarGrid(dados).subscribe((response) => {        
      this.controleTable = response.result.length;
      this.dataSource = response.result;  
      this.listMaterialPedido = response.result;
      console.log(this.listMaterialPedido)
      });
  }

  private montaFormGroup() {
    return this.formBuilder.group({
      produtoDescricaoID: [{ value: '', disabled: false },[Validators.required],],      
      quantidade: [{ value: '', disabled: false }, [Validators.required]]
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
    const dados = new MaterialObraViewModel(
      '0',
      this.codigoObra.obraID,
      dadosForm.produtoDescricaoID.codigo,
      dadosForm.quantidade.toString(),               
      this.dadosUsuario.usuarioID.toString(),
      EnumNaturezaOperacao.INCLUSAO
    );    

    this.materialObraFacade.postInserir(dados).subscribe((data: any) => {
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
    this.produtodescricaoFacade
      .getListProdutoDescricaoItensObra(this.codigoObra.obraID)
      .subscribe((response) => {        
        this.listProduto = response;
      });
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
        this.materialObraFacade
          .getDeleteID(row.materialObraID)
          .subscribe((data) => {
            if (data.executouServico == false) {
              this.alertService.showAlertWarning(
                'Insumos Obra',
                data.mensagemFalha,
                '',
                '0'
              );
            } else {
              this.alertService.showAlertSuccess(
                'Insumos Obra',
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
    this.f.quantidade.reset();
    this.montaFormGroup();
    this.onListProdutos();
  }
     
  onGerarOrdemCompra(){
    this.materialObraFacade.getGerarOrdemCompra(this.codigoObra.obraID, this.dadosUsuario.usuarioID.toString())
    .subscribe((response) => {        
      if (response.executouServico == false) {
        this.alertService.showAlertWarning('', response.mensagemFalha, '', '0');
      } else {        
        this.alertService.showAlertSuccess('', response.mensagemSucesso, '', '0');        
      }
      });
  }
}
