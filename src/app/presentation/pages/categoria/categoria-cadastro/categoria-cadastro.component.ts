import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FuncionalidadeEnum } from 'src/app/core/enums/funcionalidade.enum';
import { Configuracao } from 'src/app/core/utils/configuracao';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriaFacade } from 'src/app/application/facade/categoria.facade';
import { AlertService } from 'src/app/presentation/services-ui/alert.service';
import { CategoriaViewModel } from 'src/app/core/models/categoria.models';
import { EnumNaturezaOperacao, EnumSituacaoRegistro } from 'src/app/core/enums/enum.types';
import { SelectDropModel } from 'src/app/core/models/generics.models';
import { CategoriaPrincipalFacade } from 'src/app/application/facade/categoria-principal.facade';
import { LISTA_TIPO_CATEGORIA } from 'src/app/core/constants/listas.const';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { AutocompleteComponent } from 'src/app/presentation/components/autocomplete/autocomplete.component';

@Component({
    selector: 'app-categoria-cadastro',
    imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    RadioButtonModule,
    AutocompleteComponent
  ],
    templateUrl: './categoria-cadastro.component.html',
    styleUrls: ['./categoria-cadastro.component.css']
})
export class CategoriaCadastroComponent {
  funcionalidade = FuncionalidadeEnum.CADASTRAR;
  form!: FormGroup;
  dadosUsuario = new Configuracao().recuperarDados();
  codigoRegistro: string = '';
  categoriaPrincipalIDUpdate: string = '';
  listCategoriaPrincipal: SelectDropModel[] = [];
  listaTipo = LISTA_TIPO_CATEGORIA;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private categoriaFacade: CategoriaFacade,
    private categoriaPrincipalFacade: CategoriaPrincipalFacade,
    private alertService: AlertService,
    private router: Router
  ) {
    const func = this.route.snapshot.paramMap.get('funcionalidade');

    if (func) {
      this.funcionalidade = parseInt(func);
    }
    this.form = this.montaFormGroup();
    this.onCategoriaPrincipal();
  }

  ngOnInit(): void {
    this.codigoRegistro = this.route.snapshot.paramMap.get('codigo') || '';
   
    if (
      this.funcionalidade === FuncionalidadeEnum.VISUALIZAR ||
      this.funcionalidade === FuncionalidadeEnum.EDITAR
    ) {
      this.montaDados(this.codigoRegistro);
    }
  }

  private montaFormGroup() {
    return this.formBuilder.group({
      categoriaPrincipalID: [{ value: '', disabled: false }, [Validators.required]],
      descricao: [{ value: '', disabled: false }, [Validators.required]],
      tipo: [{ value: '', disabled: false }, [Validators.required]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  montaDados(codigo: string) {
    this.categoriaFacade.getConsultarID(codigo).subscribe((response) => {
      if (!response) {
        this.alertService.showAlertWarning(
          'Categoria',
          'Não foi possívellocalizar os dados!.',
          'app/listCategoria',
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
        'Categoria',
        'Existem campos obrigatórios não preenchidos ou com erro.',
        '',
        '0'
      );
      return;
    }

    const dadosForm = this.form.value;
    const dados = new CategoriaViewModel(
      this.codigoRegistro == '' ? '0' : this.codigoRegistro,      
      dadosForm.categoriaPrincipalID.codigo == null ? dadosForm.categoriaPrincipalID : dadosForm.categoriaPrincipalID.codigo,
      this.categoriaPrincipalIDUpdate,
      dadosForm.descricao,
      dadosForm.tipo,
      EnumSituacaoRegistro.ATIVO,
      this.dadosUsuario.usuarioID.toString(),
      this.funcionalidade === FuncionalidadeEnum.CADASTRAR
        ? EnumNaturezaOperacao.INCLUSAO
        : EnumNaturezaOperacao.ALTERACAO
    );
   
    if (this.funcionalidade === FuncionalidadeEnum.CADASTRAR) {
      this.categoriaFacade.postInserir(dados).subscribe((data: any) => {
        if (data.executouServico == false) {          
          this.alertService.showAlertWarning('', data.mensagemFalha, '', '0');
        } else {        
          this.onVisualizar(data.codigo)
          this.alertService.showAlertSuccess('', data.mensagemSucesso, '', '0');
        }
      });
    } else {
      this.categoriaFacade.postAtualiza(dados).subscribe((data: any) => {
        if (data.executouServico == false) {
          this.alertService.showAlertWarning('', data.mensagemFalha, '', '0');
        } else {
          this.onVisualizar(data.codigo)
          this.alertService.showAlertSuccess('', data.mensagemSucesso, '', '0');
        }       
        new Configuracao().goTo(
          this.router,
          'app/listcategoria/categoriacadastro/visualizar/',
          this.codigoRegistro,
          FuncionalidadeEnum.VISUALIZAR
        );
      });
    }
    
  }

  private atualizaFormulario(dados: any) {
    this.categoriaPrincipalIDUpdate = dados.categoriaPrincipalID,
    this.form.patchValue({
      categoriaPrincipalID: { codigo: dados.categoriaPrincipalID, descricao: dados.descCategoriaPrincipal },
      descricao: dados.descricao,
      tipo: dados.tipo
      //situacao: dados.situacao == "A" ? true : false,
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
    this.router.navigate(['app/listcategoria/']);
  }

  onEditar() {
    return new Configuracao().goTo(
      this.router,
      'app/listcategoria/categoriacadastro/editar/',
      this.codigoRegistro,
      FuncionalidadeEnum.EDITAR
    );
  }

  onVisualizar(codigo: string) {
    return new Configuracao().goTo(
      this.router,
      'app/listcategoria/categoriacadastro/visualizar/',
      codigo,
      FuncionalidadeEnum.VISUALIZAR
    );
  }

  onCategoriaPrincipal() {
    this.categoriaPrincipalFacade.getListCategoria().subscribe((response) => {
      this.listCategoriaPrincipal = response;
    });
  }
}
