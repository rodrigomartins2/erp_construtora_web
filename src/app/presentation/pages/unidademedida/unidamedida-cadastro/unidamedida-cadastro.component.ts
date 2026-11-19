import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuncionalidadeEnum } from 'src/app/core/enums/funcionalidade.enum';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UnidadeMedidaFacade } from 'src/app/application/facade/unidade-medida.facade';
import { UnidadesMedidaViewModel } from 'src/app/core/models/unidade-medida.models';
import { Configuracao } from 'src/app/core/utils/configuracao';
import { AlertService } from 'src/app/presentation/services-ui/alert.service';
import {
  EnumNaturezaOperacao,
  EnumSituacaoRegistro,
} from 'src/app/core/enums/enum.types';
import { switchMap, take } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-unidamedida-cadastro',
    imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule
  ],
    templateUrl: './unidamedida-cadastro.component.html',
    styleUrls: ['./unidamedida-cadastro.component.css']
})
export class UnidamedidaCadastroComponent {
  funcionalidade = FuncionalidadeEnum.CADASTRAR;
  form!: FormGroup;
  dadosUsuario = new Configuracao().recuperarDados();
  codigoRegistro: string = '';

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private unidadesmedidaFacade: UnidadeMedidaFacade,
    private alertService: AlertService,
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
  }

  montaDados(codigo: string) {
    this.unidadesmedidaFacade.getConsultarID(codigo).subscribe((response) => {
      if (!response) {
        this.alertService.showAlertWarning(
          'Unidade Medida',
          'Não foi possívellocalizar os dados!.',
          'app/listunidademedida',
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
        'Unidade Medida',
        'Existem campos obrigatórios não preenchidos ou com erro.',
        '',
        '0'
      );
      return;
    }

    const dadosForm = this.form.value;
    const dados = new UnidadesMedidaViewModel(
      this.codigoRegistro == '' ? '0' : this.codigoRegistro,
      dadosForm.descricao,
      dadosForm.abreviacao,
      EnumSituacaoRegistro.ATIVO,
      this.dadosUsuario.usuarioID.toString(),
      this.funcionalidade === FuncionalidadeEnum.CADASTRAR
        ? EnumNaturezaOperacao.INCLUSAO
        : EnumNaturezaOperacao.ALTERACAO
    );

    if (this.funcionalidade === FuncionalidadeEnum.CADASTRAR) {
      this.unidadesmedidaFacade.postInserir(dados).subscribe((data: any) => {
        if (data.executouServico == false) {
          this.alertService.showAlertWarning('', data.mensagemFalha, '', '0');
        } else {
          this.onVisualizar(data.codigo);
          this.alertService.showAlertSuccess('', data.mensagemSucesso, '', '0');
        }
      });
    } else {
      this.unidadesmedidaFacade.postAtualiza(dados).subscribe((data: any) => {
        if (data.executouServico == false) {
          this.alertService.showAlertWarning('', data.mensagemFalha, '', '0');
        } else {
          this.onVisualizar(data.codigo);
          this.alertService.showAlertSuccess('', data.mensagemSucesso, '', '0');
        }
        new Configuracao().goTo(
          this.router,
          'app/listunidademedida/unidademedidacadastro/visualizar/',
          this.codigoRegistro,
          FuncionalidadeEnum.VISUALIZAR
        );
      });
    }
  }

  private montaFormGroup() {
    return this.formBuilder.group({
      descricao: [{ value: '', disabled: false }, [Validators.required]],
      abreviacao: [{ value: '', disabled: false }, [Validators.required]],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  private atualizaFormulario(dados: any) {
    this.form.patchValue({
      descricao: dados.descricao,
      abreviacao: dados.abreviacao,
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
    this.router.navigate(['app/listunidademedida/']);
  }

  onEditar() {
    return new Configuracao().goTo(
      this.router,
      'app/listunidademedida/unidademedidacadastro/editar/',
      this.codigoRegistro,
      FuncionalidadeEnum.EDITAR
    );
  }

  onVisualizar(codigo: string) {
    return new Configuracao().goTo(
      this.router,
      'app/listunidademedida/unidademedidacadastro/visualizar/',
      codigo,
      FuncionalidadeEnum.VISUALIZAR
    );
  }
}
