import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FuncionalidadeEnum } from 'src/app/core/enums/funcionalidade.enum';
import { Configuracao } from 'src/app/core/utils/configuracao';
import { ActivatedRoute, Router } from '@angular/router';
import { ProdutoDescricaoFacade } from 'src/app/application/facade/produto-descricao.facade';
import { AlertService } from 'src/app/presentation/services-ui/alert.service';
import { ProdutoDescricaoViewModel } from 'src/app/core/models/produto-descricao.models';
import {
  EnumNaturezaOperacao,
  EnumSituacaoRegistro,
} from 'src/app/core/enums/enum.types';
import { SelectDropModel } from 'src/app/core/models/generics.models';
import { CategoriaFacade } from 'src/app/application/facade/categoria.facade';
import { UnidadeMedidaFacade } from 'src/app/application/facade/unidade-medida.facade';
import { MarcaFacade } from 'src/app/application/facade/marca.facade';
import { ProdutoFacade } from 'src/app/application/facade/produto.facade';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { AutocompleteComponent } from 'src/app/presentation/components/autocomplete/autocomplete.component';

@Component({
    selector: 'app-produtodescricao-cadastro',
    imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    TextareaModule,
    AutocompleteComponent
  ],
    templateUrl: './produtodescricao-cadastro.component.html',
    styleUrls: ['./produtodescricao-cadastro.component.css']
})
export class ProdutodescricaoCadastroComponent {
  funcionalidade = FuncionalidadeEnum.CADASTRAR;
  form!: FormGroup;
  dadosUsuario = new Configuracao().recuperarDados();
  codigoRegistro: string = '';
  listCategoria: SelectDropModel[] = [];
  listMarca: SelectDropModel[] = [];
  listProduto: SelectDropModel[] = [];
  listUnidadeMedida: SelectDropModel[] = [];

  categoriaResult: any;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private produtoDescricaoFacade: ProdutoDescricaoFacade,
    private alertService: AlertService,
    private categoriaFacade: CategoriaFacade,
    private unidadeMedidaFacade: UnidadeMedidaFacade,
    private marcaFacade: MarcaFacade,
    private produtoFacade: ProdutoFacade,
    private router: Router
  ) {
    const func = this.route.snapshot.paramMap.get('funcionalidade');

    if (func) {
      this.funcionalidade = parseInt(func);
    }
    this.form = this.montaFormGroup();
  }

  ngOnInit(): void {
    this.codigoRegistro = this.route.snapshot.paramMap.get('codigo') || '';

    if (
      this.funcionalidade === FuncionalidadeEnum.VISUALIZAR ||
      this.funcionalidade === FuncionalidadeEnum.EDITAR
    ) {
      this.montaDados(this.codigoRegistro);
    }
    this.onCategoria();
    this.onMarca();
    this.onProduto();
    this.onUnidadeMedida();
  }

  private montaFormGroup() {
    return this.formBuilder.group({
      marcaID: [{ value: '', disabled: false }, [Validators.required]],
      unidadeMedidaID: [{ value: '', disabled: false }, [Validators.required]],
      produtoID: [{ value: '', disabled: false }, [Validators.required]],
      categoriaID: [{ value: '', disabled: false }, [Validators.required]],
      subProduto: [{ value: '', disabled: false }, [Validators.required]],
      descricaoProduto: [{ value: '', disabled: false }, [Validators.required]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  montaDados(codigo: string) {
    this.produtoDescricaoFacade
      .getConsultarID(codigo)
      .subscribe((response) => {
        if (!response) {
          this.alertService.showAlertWarning(
            'Produto',
            'Não foi possívellocalizar os dados!.',
            'app/listProdutoDescricao',
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
        'Produto',
        'Existem campos obrigatórios não preenchidos ou com erro.',
        '',
        '0'
      );
      return;
    }

    const dadosForm = this.form.value;
    const dados = new ProdutoDescricaoViewModel(
      this.codigoRegistro == '' ? '0' : this.codigoRegistro,
      dadosForm.marcaID.codigo == null ? dadosForm.marcaID : dadosForm.marcaID.codigo,
      dadosForm.unidadeMedidaID,
      dadosForm.produtoID.codigo == null ? dadosForm.produtoID : dadosForm.produtoID.codigo,
      dadosForm.categoriaID.codigo == null ? dadosForm.categoriaID : dadosForm.categoriaID.codigo,
      dadosForm.subProduto,
      dadosForm.descricaoProduto,
      '0',
      EnumSituacaoRegistro.ATIVO,
      this.dadosUsuario.usuarioID.toString(),
      this.funcionalidade === FuncionalidadeEnum.CADASTRAR
        ? EnumNaturezaOperacao.INCLUSAO
        : EnumNaturezaOperacao.ALTERACAO
    );
    
    if (this.funcionalidade === FuncionalidadeEnum.CADASTRAR) {
      this.produtoDescricaoFacade.postInserir(dados).subscribe((data: any) => {
        if (data.executouServico == false) {
          this.alertService.showAlertWarning('', data.mensagemFalha, '', '0');
        } else {
          this.onVisualizar(data.codigo);
          this.alertService.showAlertSuccess('', data.mensagemSucesso, '', '0');
        }
      });
    } else {
      this.produtoDescricaoFacade
        .postAtualiza(dados)
        .subscribe((data: any) => {
          if (data.executouServico == false) {
            this.alertService.showAlertWarning('', data.mensagemFalha, '', '0');
          } else {
            this.onVisualizar(data.codigo);
            this.alertService.showAlertSuccess(
              '',
              data.mensagemSucesso,
              '',
              '0'
            );
          }
          new Configuracao().goTo(
            this.router,
            'app/listprodutodescricao/produtodescricaocadastro/visualizar/',
            this.codigoRegistro,
            FuncionalidadeEnum.VISUALIZAR
          );
        });
    }
  }

  private atualizaFormulario(dados: any) {
    this.form.patchValue({
      marcaID: { codigo: dados.marcaID, descricao: dados.marcaDescricao },
      unidadeMedidaID: dados.unidadeMedidaID,
      produtoID: { codigo: dados.produtoID, descricao: dados.produtoDescricao },
      categoriaID: { codigo: dados.categoriaID, descricao: dados.categoriaDescricao },
      subProduto: dados.subProduto,
      descricaoProduto: dados.descricaoProduto     
    });
  }

  private habilitaCampos() {
    if (this.funcionalidade === FuncionalidadeEnum.VISUALIZAR) {
      return;
    }

    this.form.enable();
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
    this.router.navigate(['app/listprodutodescricao/']);
  }

  onEditar() {
    return new Configuracao().goTo(
      this.router,
      'app/listprodutodescricao/produtodescricaocadastro/editar/',
      this.codigoRegistro,
      FuncionalidadeEnum.EDITAR
    );
  }

  onVisualizar(codigo: string) {
    return new Configuracao().goTo(
      this.router,
      'app/listprodutodescricao/produtodescricaocadastro/visualizar/',
      codigo,
      FuncionalidadeEnum.VISUALIZAR
    );
  }

  onCategoria() {
    this.categoriaFacade.getListCategoria().subscribe((response) => {
      this.listCategoria = response;
    });
  }

  onProduto() {
    this.produtoFacade.getListProduto().subscribe((response) => {
      this.listProduto = response;
    });
  }

  onUnidadeMedida() {
    this.unidadeMedidaFacade.getListUnidadeMedida().subscribe((response) => {
      this.listUnidadeMedida = response;
    });
  }

  onMarca() {
    this.marcaFacade.getListMarca().subscribe((response) => {
      this.listMarca = response;
    });
  }

  selectEvent(item: any) {
    // do something with selected item
    console.log(item)
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    console.log(val)
  }
  
  onFocused(e: any){
    // do something when input is focused
    console.log(e)
  }

  
}
