import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuncionalidadeEnum } from 'src/app/core/enums/funcionalidade.enum';
import { Configuracao } from 'src/app/core/utils/configuracao';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EnumNaturezaOperacao, EnumSituacaoRegistro } from 'src/app/core/enums/enum.types';
import { MarcaViewModel } from 'src/app/core/models/marca.models';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/presentation/services-ui/alert.service';
import { MarcaFacade } from 'src/app/application/facade/marca.facade';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-marca-cadastro',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, InputTextModule],
    templateUrl: './marca-cadastro.component.html',
    styleUrls: ['./marca-cadastro.component.css']
})
export class MarcaCadastroComponent {
  funcionalidade = FuncionalidadeEnum.CADASTRAR;
  form!: FormGroup;
  dadosUsuario = new Configuracao().recuperarDados();
  codigoRegistro: string = '';

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private marcaFacade: MarcaFacade,
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
      descricao: [{ value: '', disabled: false }, [Validators.required]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  montaDados(codigo: string) {
    this.marcaFacade.getConsultarID(codigo).subscribe((response) => {
      if (!response) {
        this.alertService.showAlertWarning(
          'Marca',
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
        'Marca',
        'Existem campos obrigatórios não preenchidos ou com erro.',
        '',
        '0'
      );
      return;
    }

    const dadosForm = this.form.value;
    const dados = new MarcaViewModel(
      this.codigoRegistro == '' ? '0' : this.codigoRegistro,
      dadosForm.descricao,
      EnumSituacaoRegistro.ATIVO,
      this.dadosUsuario.usuarioID.toString(),
      this.funcionalidade === FuncionalidadeEnum.CADASTRAR
        ? EnumNaturezaOperacao.INCLUSAO
        : EnumNaturezaOperacao.ALTERACAO
    );
   
    if (this.funcionalidade === FuncionalidadeEnum.CADASTRAR) {
      this.marcaFacade.postInserir(dados).subscribe((data: any) => {
        if (data.executouServico == false) {          
          this.alertService.showAlertWarning('', data.mensagemFalha, '', '0');
        } else {        
          this.onVisualizar(data.codigo)
          this.alertService.showAlertSuccess('', data.mensagemSucesso, '', '0');
        }
      });
    } else {
      this.marcaFacade.postAtualiza(dados).subscribe((data: any) => {
        if (data.executouServico == false) {
          this.alertService.showAlertWarning('', data.mensagemFalha, '', '0');
        } else {
          this.onVisualizar(data.codigo)
          this.alertService.showAlertSuccess('', data.mensagemSucesso, '', '0');
        }       
        new Configuracao().goTo(
          this.router,
          'app/listmarca/marcacadastro/visualizar/',
          this.codigoRegistro,
          FuncionalidadeEnum.VISUALIZAR
        );
      });
    }
    
  }

  private atualizaFormulario(dados: any) {
    this.form.patchValue({
      descricao: dados.descricao,
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
    this.router.navigate(['app/listmarca/']);
  }

  onEditar() {
    return new Configuracao().goTo(
      this.router,
      'app/listmarca/marcacadastro/editar/',
      this.codigoRegistro,
      FuncionalidadeEnum.EDITAR
    );
  }

  onVisualizar(codigo: string) {
    return new Configuracao().goTo(
      this.router,
      'app/listmarca/marcacadastro/visualizar/',
      codigo,
      FuncionalidadeEnum.VISUALIZAR
    );
  }
}
