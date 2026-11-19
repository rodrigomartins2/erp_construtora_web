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
import { Configuracao } from 'src/app/core/utils/configuracao';
import { FuncionalidadeEnum } from 'src/app/core/enums/funcionalidade.enum';
import {
  EnumNaturezaOperacao,
  EnumSituacaoRegistro,
} from 'src/app/core/enums/enum.types';
import { TipoMovimentoViewModel } from 'src/app/core/models/tipo-movimento.models';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/presentation/services-ui/alert.service';
import { TipoMovimentoFacade } from 'src/app/application/facade/tipo-movimento.facade';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
    selector: 'app-tipomovimento-cadastro',
    imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    RadioButtonModule,
    CheckboxModule
  ],
    templateUrl: './tipomovimento-cadastro.component.html',
    styleUrls: ['./tipomovimento-cadastro.component.css']
})
export class TipomovimentoCadastroComponent {
  funcionalidade = FuncionalidadeEnum.CADASTRAR;
  form!: FormGroup;
  dadosUsuario = new Configuracao().recuperarDados();
  codigoRegistro: string = '';
  listaOperacao: any[] = [
    { codigo: 'E', descricao: 'Entrada' },
    { codigo: 'S', descricao: 'Saída' },
  ];

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private tipoMovimentoFacade: TipoMovimentoFacade,
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

  private montaFormGroup() {
    return this.formBuilder.group({
      historico: [{ value: '', disabled: false }, [Validators.required]],
      operacao: [{ value: '', disabled: false }, [Validators.required]],
      movimentarEstoque: [{ value: '', disabled: false }],
      geraPrevisao: [{ value: '', disabled: false }],
      geraDespesa: [{ value: '', disabled: false }],
      geraReceita: [{ value: '', disabled: false }],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  montaDados(codigo: string) {
    this.tipoMovimentoFacade.getConsultarID(codigo).subscribe((response) => {
      if (!response) {
        this.alertService.showAlertWarning(
          'tipomovimento',
          'Não foi possívellocalizar os dados!.',
          'app/listtipomovimento',
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
        'tipomovimento',
        'Existem campos obrigatórios não preenchidos ou com erro.',
        '',
        '0'
      );
      return;
    }

    const dadosForm = this.form.value;
    const dados = new TipoMovimentoViewModel(
      this.codigoRegistro == '' ? '0' : this.codigoRegistro,
      dadosForm.historico,
      dadosForm.operacao,
      dadosForm.movimentarEstoque === "" ? false : dadosForm.movimentarEstoque,
      dadosForm.geraPrevisao === "" ? false : dadosForm.geraPrevisao,
      dadosForm.geraDespesa === "" ? false : dadosForm.geraDespesa,
      dadosForm.geraReceita === "" ? false : dadosForm.geraReceita,
      EnumSituacaoRegistro.ATIVO,
      this.dadosUsuario.usuarioID.toString(),
      this.funcionalidade === FuncionalidadeEnum.CADASTRAR
        ? EnumNaturezaOperacao.INCLUSAO
        : EnumNaturezaOperacao.ALTERACAO
    );

    if (this.funcionalidade === FuncionalidadeEnum.CADASTRAR) {
      this.tipoMovimentoFacade.postInserir(dados).subscribe((data: any) => {
        if (data.executouServico == false) {
          this.alertService.showAlertWarning('', data.mensagemFalha, '', '0');
        } else {
          this.onVisualizar(data.codigo);
          this.alertService.showAlertSuccess('', data.mensagemSucesso, '', '0');
        }
      });
    } else {
      this.tipoMovimentoFacade.postAtualiza(dados).subscribe((data: any) => {
        if (data.executouServico == false) {
          this.alertService.showAlertWarning('', data.mensagemFalha, '', '0');
        } else {
          this.onVisualizar(data.codigo);
          this.alertService.showAlertSuccess('', data.mensagemSucesso, '', '0');
        }
        new Configuracao().goTo(
          this.router,
          'app/listtipomovimento/tipomovimentocadastro/visualizar/',
          this.codigoRegistro,
          FuncionalidadeEnum.VISUALIZAR
        );
      });
    }
  }

  private atualizaFormulario(dados: any) {
    this.form.patchValue({
      historico: dados.historico,
      operacao: dados.operacao,
      movimentarEstoque: dados.movimentarEstoque,
      geraPrevisao: dados.geraPrevisao,
      geraDespesa: dados.geraDespesa,
      geraReceita: dados.geraReceita,
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
    this.router.navigate(['app/listtipomovimento/']);
  }

  onEditar() {
    return new Configuracao().goTo(
      this.router,
      'app/listtipomovimento/tipomovimentocadastro/editar/',
      this.codigoRegistro,
      FuncionalidadeEnum.EDITAR
    );
  }

  onVisualizar(codigo: string) {
    return new Configuracao().goTo(
      this.router,
      'app/listtipomovimento/tipomovimentocadastro/visualizar/',
      codigo,
      FuncionalidadeEnum.VISUALIZAR
    );
  }
}
