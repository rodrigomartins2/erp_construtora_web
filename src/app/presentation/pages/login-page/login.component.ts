import { SelectDropModel } from 'src/app/core/models/generics.models';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { AlertService } from 'src/app/presentation/services-ui/alert.service';
import { LoginFacade } from 'src/app/application/facade/login.facade';
import { Platform } from '@angular/cdk/platform';

import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Validacoes } from 'src/app/core/utils/validacoes';
import {
  AlterarSenhaViewModel,
  LoginDadosModel,
} from 'src/app/core/models/login.models';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    imports: [FormsModule, ReactiveFormsModule, ButtonModule, DialogModule, InputTextModule, SelectModule]
})
export class LoginComponent {
  formAlterarSenha!: FormGroup;
  formLogin!: FormGroup;
  mensagem!: string;
  modalPwaEvent: any;
  modalPwaPlatform: string | undefined;
  listaDadosUsuarios!: LoginDadosModel;
  listEmpresaGrupo: SelectDropModel[] = [];
  url!: string;
  login = {
    email: '',
    senha: '',
    empresa: '',
  };

  /** Diálogo de instalação do aplicativo (PWA). */
  modalPwaVisivel = false;
  /** Diálogo de troca de senha padrão. */
  modalAlterarSenhaVisivel = false;
  /** Exibe a senha digitada em texto. */
  mostrarSenha = false;
  /** Foto de fundo (assets/img/login-construcao.webp); se não existir, fica só o gradiente. */
  fundoDisponivel = true;
  /** Guarda o e-mail neste navegador para o próximo acesso. */
  lembrarAcesso = false;

  private static readonly CHAVE_LEMBRAR_EMAIL = 'LOGIN_LEMBRAR_EMAIL';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loginFacade: LoginFacade,
    private alertService: AlertService,
    private fb: FormBuilder,
    private platform: Platform
  ) {}

  ngOnInit(): void {
    this.url = window.location.origin;
    this.loadModalPwa();

    this.formLogin = this.montaFormGroup();
    this.restaurarEmailLembrado();

    // if (environment.loginAutomatico) {
    //   this.onSubmit();
    // }
  }

  private montaFormGroup() {
    return this.fb.group({
      email: ['', [Validators.required]],
      senha: [null, Validators.required],
      empresa: [{ value: '', disabled: false }, [Validators.required]],
    });
  }

  /** Preenche o e-mail salvo em "Lembrar meu acesso" e já carrega as empresas. */
  private restaurarEmailLembrado(): void {
    const email = localStorage.getItem(LoginComponent.CHAVE_LEMBRAR_EMAIL);
    if (email) {
      this.lembrarAcesso = true;
      this.formLogin.patchValue({ email });
      this.onVerificaUsuario(email);
    }
  }

  private salvarEmailLembrado(email: string): void {
    if (this.lembrarAcesso && email) {
      localStorage.setItem(LoginComponent.CHAVE_LEMBRAR_EMAIL, email);
    } else {
      localStorage.removeItem(LoginComponent.CHAVE_LEMBRAR_EMAIL);
    }
  }

  /** Não há recuperação automática de senha: orienta o usuário a procurar o administrador. */
  onEsqueciSenha(): void {
    this.alertService.showAlertInfo(
      'Esqueci minha senha',
      'Entre em contato com o administrador do sistema para redefinir sua senha.',
      '',
      '0'
    );
  }

  get fl(): { [key: string]: AbstractControl } {
    return this.formLogin.controls;
  }

  get f(): { [key: string]: AbstractControl } {
    return this.formAlterarSenha.controls;
  }

  onEmpresaGrupo() {
    this.loginFacade.getSelectEmpresaGrupo().subscribe((dados) => {
      this.listEmpresaGrupo = dados;
    });
  }

  onVerificaUsuario(email: string) {
    if (email != '') {
      this.login.email = email;
      this.login.senha = '';
      this.login.empresa = '';
      this.loginFacade
        .verificaUsuario(this.login)
        .subscribe((dados) => {
          if (dados == true) this.onEmpresaGrupo();
          else {
            this.alertService.showAlertInfo(
              'Acessar Sistema',
              'Usuário não cadastrado! ',
              '',
              '0'
            );
            this.formLogin.controls.email.setValue('');
          }
        });
    }
  }

  onSubmit() {
    try {

      if (environment.loginAutomatico) {
        this.formLogin.patchValue({
          email: 'rodrigo.martins2@gmail.com',
          senha: '121279',
          empresa: '11'
        });
      }

      const dadosFormulario = this.formLogin.value;
      this.login.email = dadosFormulario.email;
      this.login.senha = dadosFormulario.senha;
      this.login.empresa = dadosFormulario.empresa;
      this.mensagem = '';


      if (this.formLogin.invalid) {
        this.formLogin.controls.email.setErrors(
          this.formLogin.controls.email.errors
        );
        this.formLogin.controls.email.markAsTouched();

        this.formLogin.controls.senha.setErrors(
          this.formLogin.controls.senha.errors
        );
        this.formLogin.controls.senha.markAsTouched();

        this.formLogin.controls.empresa.setErrors(
          this.formLogin.controls.empresa.errors
        );
        this.formLogin.controls.empresa.markAsTouched();

        this.formLogin.updateValueAndValidity();

        this.alertService.showAlertWarning(
          'Login',
          'Existem campos obrigatórios não preenchidos ou com erro.',
          '',
          '0'
        );
        return;
      }
      

      if (this.login.email != '') {
        //console.log(this.login);
        this.loginFacade
          .login(this.login)
          .pipe(first())
          .subscribe(
            (data) => {
              if (data.mensagem != null) {
                this.alertService.showAlertWarning(
                  'Acessar Sistema',
                  data.mensagem,
                  '',
                  '0'
                );
                return;
              }
              if (data.senhaPadrao == 'True') {
                this.criaFormularioAlteraSenha();
                this.alterarSenha();
                return;
              }
              this.getMenu();
              if (data.mensagem == null) {
                this.salvarEmailLembrado(this.login.email);
                this.router.navigate(['app/dashboard/']);
              }
            },
            (error) => {
              this.alertService.error(error);
            }
          );
      } else
        this.alertService.showAlertInfo(
          'Acessar Sistema',
          'Infome o email e senha! ',
          '',
          '0'
        );
    } catch (error) {
      console.error(error);
    }
  }

  criaFormularioAlteraSenha() {
    this.formAlterarSenha = this.fb.group(
      {
        novaSenha: new FormControl(
          '',
          Validators.compose([Validators.required])
        ),
        confirmaSenha: new FormControl(
          '',
          Validators.compose([Validators.required])
        ),
      },
      {
        validators: Validacoes.SenhasCombinam,
      }
    );
  }

  onAlterarSenha() {
    const dadosUsuario = this.loginFacade.dadosAlterarSenha();
    //console.log(dadosUsuario)
    if (this.formAlterarSenha.invalid) {
      Object.keys(this.formAlterarSenha.controls).forEach((campo) => {
        const controle = this.formAlterarSenha.get(campo);
        controle?.markAsDirty();
      });
      return;
    } else {
      const dadosFormulario = this.formAlterarSenha.value;
      const alterarSenhaViewModel = new AlterarSenhaViewModel(
        dadosUsuario.usuarioID.toString(),
        dadosFormulario.novaSenha
      );

      this.loginFacade
        .postAlteraSenha(alterarSenhaViewModel)
        .pipe(first())
        .subscribe((data: any) => {
          if (data.executouServico == true) {
            this.modalAlterarSenhaVisivel = false;
            this.alertService.showAlertSuccess(
              'Alterar Senha Usuário',
              data.mensagemSucesso,
              '',
              '0'
            );
            //this.onSubmit(dadosUsuario.login, dadosFormulario.novaSenha, '');
            this.onReset();
          } else {
            this.alertService.showAlertSuccess(
              'Alterar Senha Usuário',
              data.mensagemFalha,
              '',
              '0'
            );
          }
        });
    }
  }

  alterarSenha() {
    this.modalAlterarSenhaVisivel = true;
  }

  onReset(): void {
    this.formAlterarSenha.reset();
  }

  getMenu() {
    // localStorage.setItem('menuAppGer', JSON.stringify(this.menu));
    //localStorage.setItem('permissaoAppGer', JSON.stringify(this.permissao));
    // this.authenticationService.getListMenuSistema(codUsuario, 'App Documentos CTe').subscribe(
    //   (data) => {
    //     data.forEach(element => {
    //       localStorage.clear();
    //       element.subMenu.forEach(item => {
    //         const permissoes = new PermissoesModel(
    //           item.url,
    //           item.mostraMenu,
    //           item.acessoEspecial
    //         );
    //         this.permisao = item.url.toLowerCase();
    //         this.listPermissao.push(this.permisao);
    //         this.listPermissaoMenu.push(permissoes);
    //       })
    //     });
    //     localStorage.setItem('permissaoUsuarioDocCte', JSON.stringify(this.listPermissao));
    //     localStorage.setItem('permissoesDocCte', JSON.stringify(this.listPermissaoMenu));
    //   },
    //   (error) => {
    //     console.log(error);
    //   });
  }

  private loadModalPwa(): void {
    if (this.platform.ANDROID) {
      window.addEventListener('beforeinstallprompt', (event: any) => {
        event.preventDefault();
        this.modalPwaEvent = event;
        this.modalPwaPlatform = 'ANDROID';
        this.modalPwaVisivel = true;
      });
    }

    if (this.platform.IOS && this.platform.SAFARI) {
      const isInStandaloneMode =
        'standalone' in window.navigator &&
        (<any>window.navigator)['standalone'];
      if (!isInStandaloneMode) {
        this.modalPwaPlatform = 'IOS';
        this.modalPwaVisivel = true;
      }
    }
    //this.modalPwaVisivel = true;
  }

  public addToHomeScreen(): void {
    this.modalPwaVisivel = false;
    this.modalPwaEvent.prompt();
    this.modalPwaPlatform = undefined;
  }

  public closePwa(): void {
    this.modalPwaVisivel = false;
    setTimeout(() => {
      this.modalPwaPlatform = undefined;
    }, 600);
  }

  onFecharModal() {
    this.modalPwaVisivel = false;
  }
}
