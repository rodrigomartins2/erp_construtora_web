import { Component, effect, inject, model } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { first } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

import { LoginFacade } from 'src/app/application/facade/login.facade';
import { SessionFacade } from 'src/app/application/facade/session.facade';
import { AlterarSenhaViewModel } from 'src/app/core/models/login.models';
import { Validacoes } from 'src/app/core/utils/validacoes';
import { AlertService } from 'src/app/presentation/services-ui/alert.service';

/** Diálogo "Alterar senha" do usuário logado (aberto pelo menu do header). */
@Component({
  selector: 'app-alterar-senha-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, DialogModule, InputTextModule],
  templateUrl: './alterar-senha-dialog.html'
})
export class AlterarSenhaDialog {
  readonly visible = model(false);

  private readonly fb = inject(FormBuilder);
  private readonly loginFacade = inject(LoginFacade);
  private readonly alertService = inject(AlertService);
  readonly sessionFacade = inject(SessionFacade);

  form: FormGroup = this.criarFormulario();

  constructor() {
    // Formulário limpo a cada abertura.
    effect(() => {
      if (this.visible()) {
        this.form = this.criarFormulario();
      }
    });
  }

  get f() {
    return this.form.controls;
  }

  fechar(): void {
    this.visible.set(false);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((c) => c.markAsDirty());
      return;
    }

    const dados = new AlterarSenhaViewModel(this.sessionFacade.usuarioID(), this.form.value.novaSenha);

    this.loginFacade
      .postAlteraSenha(dados)
      .pipe(first())
      .subscribe((data: any) => {
        if (data?.executouServico == true) {
          this.fechar();
          this.alertService.showAlertSuccess('Alterar Senha Usuário', data.mensagemSucesso, '', '0');
          this.sessionFacade.logout();
        } else {
          this.alertService.showAlertWarning('Alterar Senha Usuário', data?.mensagemFalha, '', '0');
        }
      });
  }

  private criarFormulario(): FormGroup {
    return this.fb.group(
      {
        novaSenha: new FormControl('', Validators.required),
        confirmaSenha: new FormControl('', Validators.required)
      },
      { validators: Validacoes.SenhasCombinam }
    );
  }
}
