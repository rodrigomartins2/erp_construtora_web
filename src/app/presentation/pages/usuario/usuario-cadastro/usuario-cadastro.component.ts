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
import { FuncaoFacade } from 'src/app/application/facade/funcao.facade';
import { AlertService } from 'src/app/presentation/services-ui/alert.service';
import { UsuarioFacade } from 'src/app/application/facade/usuario.facade';
import { UsuarioViewModel } from 'src/app/core/models/usuario.models';
import { SelectDropModel } from 'src/app/core/models/generics.models';
import { PessoaFacade } from 'src/app/application/facade/pessoa.facade';
import { Validacoes } from 'src/app/core/utils/validacoes';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { AutocompleteComponent } from 'src/app/presentation/components/autocomplete/autocomplete.component';

@Component({
    selector: 'app-usuario-cadastro',
    imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    AutocompleteComponent
  ],
    templateUrl: './usuario-cadastro.component.html',
    styleUrls: ['./usuario-cadastro.component.css']
})
export class UsuarioCadastroComponent {
  funcionalidade = FuncionalidadeEnum.CADASTRAR;
  form!: FormGroup;
  dadosUsuario = new Configuracao().recuperarDados();
  codigoRegistro: string = '';
  listFuncao: SelectDropModel[] = [];
  listPessoa: SelectDropModel[] = []; 
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private funcaoFacade: FuncaoFacade,
    private usuarioFacade: UsuarioFacade,
    private alertService: AlertService,
    private pessoaFacade: PessoaFacade,
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
    this.onFuncao();
    this.onListPessoa();
    if (
      this.funcionalidade === FuncionalidadeEnum.VISUALIZAR ||
      this.funcionalidade === FuncionalidadeEnum.EDITAR
    ) {
      this.montaDados(this.codigoRegistro);
    }
  }

  private montaFormGroup() {
    return this.formBuilder.group({
      pessoaID: [{ value: '', disabled: false }, [Validators.required]],
      funcaoID: [{ value: '', disabled: false }, [Validators.required]],      
      login: [{ value: '', disabled: false }, [Validators.required, Validators.email]],
      senha: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength, Validators.minLength]],
      confirmarSenha: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength, Validators.minLength]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  montaDados(codigo: string) {
    this.usuarioFacade.getConsultarID(codigo).subscribe((response) => {      
      if (!response) {
        this.alertService.showAlertWarning(
          'Usuário',
          'Não foi possívellocalizar os dados!.',
          'app/listmarca',
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
        'Usuário',
        'Existem campos obrigatórios não preenchidos ou com erro.',
        '',
        '0'
      );
      return;
    }

    const dadosForm = this.form.value;
    const dados = new UsuarioViewModel(
      this.codigoRegistro == '' ? '0' : this.codigoRegistro,
      dadosForm.pessoaID.codigo,
      dadosForm.funcaoID,
      dadosForm.pessoaID.descricao,
      dadosForm.login,
      dadosForm.senha,
      dadosForm.senhaPadrao,
      dadosForm.situacao
    );

    console.log(dados)

    if (this.funcionalidade === FuncionalidadeEnum.CADASTRAR) {
      this.usuarioFacade.postInserir(dados).subscribe((data: any) => {
        if (data.executouServico == false) {
          this.alertService.showAlertWarning('', data.mensagemFalha, '', '0');
        } else {
          this.onVisualizar(data.codigo);
          this.alertService.showAlertSuccess('', data.mensagemSucesso, '', '0');
        }
      });
    } else {
      this.usuarioFacade.postAtualiza(dados).subscribe((data: any) => {
        if (data.executouServico == false) {
          this.alertService.showAlertWarning('', data.mensagemFalha, '', '0');
        } else {
          this.onVisualizar(data.codigo);
          this.alertService.showAlertSuccess('', data.mensagemSucesso, '', '0');
        }
        new Configuracao().goTo(
          this.router,
          'app/listusuario/usuariocadastro/visualizar/',
          this.codigoRegistro,
          FuncionalidadeEnum.VISUALIZAR
        );
      });
    }
  }

  private atualizaFormulario(dados: any) {
    this.form.patchValue({
      descricao: dados.descricao,
      pessoaID: { codigo: dados.pessoaID, descricao: dados.nome },
      funcaoID: dados.funcaoID,   
      login: dados.login,      
      senhaPadrao: dados.senhaPadrao,
      situacao: dados.situacao,
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
    this.router.navigate(['app/listusuario/']);
  }

  onEditar() {
    return new Configuracao().goTo(
      this.router,
      'app/listusuario/usuariocadastro/editar/',
      this.codigoRegistro,
      FuncionalidadeEnum.EDITAR
    );
  }

  onVisualizar(codigo: string) {
    return new Configuracao().goTo(
      this.router,
      'app/listusuario/usuariocadastro/visualizar/',
      codigo,
      FuncionalidadeEnum.VISUALIZAR
    );
  }

  onFuncao() {
    this.funcaoFacade.getListFuncao().subscribe((response) => {
      this.listFuncao = response;
    });
  }

  onListPessoa() {
    this.pessoaFacade.getListPessoa('Colaborador').subscribe((response) => {
      this.listPessoa = response;
    });
  }
}
