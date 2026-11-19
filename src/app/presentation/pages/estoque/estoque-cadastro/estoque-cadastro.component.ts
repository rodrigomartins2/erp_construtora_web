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
import { AlertService } from 'src/app/presentation/services-ui/alert.service';
import {
  EnumNaturezaOperacao,
  EnumSituacaoRegistro,
} from 'src/app/core/enums/enum.types';
import { SelectDropModel } from 'src/app/core/models/generics.models';
import { EstoqueProdutoFacade } from 'src/app/application/facade/estoque-produto.facade';
import { EstoqueProdutoViewModel } from 'src/app/core/models/estoque-produto.models';
import { EstoquePessoaFacade } from 'src/app/application/facade/estoque-pessoa.facade';
import { ProdutoDescricaoFacade } from 'src/app/application/facade/produto-descricao.facade';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AutocompleteComponent } from 'src/app/presentation/components/autocomplete/autocomplete.component';

@Component({
    selector: 'app-estoque-cadastro',
    imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    AutocompleteComponent
  ],
    templateUrl: './estoque-cadastro.component.html',
    styleUrls: ['./estoque-cadastro.component.css']
})
export class EstoqueCadastroComponent {
  funcionalidade = FuncionalidadeEnum.CADASTRAR;
  form!: FormGroup;
  dadosUsuario = new Configuracao().recuperarDados();
  codigoRegistro: string = '';  
  listEstoque: SelectDropModel[] = [];
  listProduto: SelectDropModel[] = [];

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private estoqueProdutoFacade: EstoqueProdutoFacade,
    private alertService: AlertService,
    private estoquePessoaFacade: EstoquePessoaFacade,
    private produtoDescricaoFacade: ProdutoDescricaoFacade,
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
    
    this.onEstoque();
  }

  private montaFormGroup() {
    return this.formBuilder.group({
      estoqueID: [{ value: '', disabled: false }, [Validators.required]],
      produtoDescricaoID: [{ value: '', disabled: false }, [Validators.required]],
      qtdeMinima: [{ value: '', disabled: false }, [Validators.required]],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  montaDados(codigo: string) {
    this.estoqueProdutoFacade
      .getConsultarID(codigo)
      .subscribe((response) => {
        if (!response) {
          this.alertService.showAlertWarning(
            'Estoque Produto',
            'Não foi possível localizar os dados!.',
            'app/listEstoque',
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
    const dados = new EstoqueProdutoViewModel(
      this.codigoRegistro,
      dadosForm.estoqueID.codigo == null ? dadosForm.estoqueID : dadosForm.estoqueID.codigo,
      dadosForm.produtoDescricaoID.codigo == null ? dadosForm.produtoDescricaoID : dadosForm.produtoDescricaoID.codigo,
      dadosForm.qtdeMinima,
      EnumSituacaoRegistro.ATIVO,
      this.dadosUsuario.usuarioID.toString(),
      this.funcionalidade === FuncionalidadeEnum.CADASTRAR ? EnumNaturezaOperacao.INCLUSAO : EnumNaturezaOperacao.ALTERACAO
    );
    
    if (this.funcionalidade === FuncionalidadeEnum.CADASTRAR) {
      this.estoqueProdutoFacade.postInserir(dados).subscribe((data: any) => {
        if (data.executouServico == false) {
          this.alertService.showAlertWarning('', data.mensagemFalha, '', '0');
        } else {
          this.onVisualizar(data.codigo);
          this.alertService.showAlertSuccess('', data.mensagemSucesso, '', '0');
        }
      });
    } else {
      this.estoqueProdutoFacade
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
            'app/listestoque/estoquecadastro/visualizar/',
            this.codigoRegistro,
            FuncionalidadeEnum.VISUALIZAR
          );
        });
    }
  }

  private atualizaFormulario(dados: any) {
    this.form.patchValue({
      estoqueID: { codigo: dados.estoqueID, descricao: dados.nomeEstoque },      
      produtoDescricaoID: { codigo: dados.produtoDescricaoID, descricao: dados.produtoDescricao },
      categoriaID: { codigo: dados.categoriaID, descricao: dados.categoriaDescricao },      
      qtdeMinima: dados.qtdeMinima,
      
    });
  }

  private habilitaCampos() {
    if (this.funcionalidade === FuncionalidadeEnum.VISUALIZAR) {
      return;
    }

    this.form.enable();   
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
    this.router.navigate(['app/listestoque/']);
  }

  onEditar() {
    return new Configuracao().goTo(
      this.router,
      'app/listestoque/estoquecadastro/editar/',
      this.codigoRegistro,
      FuncionalidadeEnum.EDITAR
    );
  }

  onVisualizar(codigo: string) {
    return new Configuracao().goTo(
      this.router,
      'app/listestoque/estoquecadastro/visualizar/',
      codigo,
      FuncionalidadeEnum.VISUALIZAR
    );
  }

  onProduto(estoqueID: string) {
    this.produtoDescricaoFacade.getListSSelectProdutoDescricaoSemEstoque(estoqueID).subscribe((response) => {
      this.listProduto = response;
    });
  }

  onEstoque() {
    this.estoquePessoaFacade.getListEstoquePessoa().subscribe((response) => {
      this.listEstoque = response;
    });
  }

  selectEvent(item: any) {
    this.listProduto = [];
    this.onProduto(item.codigo);
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
