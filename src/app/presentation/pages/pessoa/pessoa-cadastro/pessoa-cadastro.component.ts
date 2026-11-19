import { MunicipioFacade } from 'src/app/application/facade/municipio.facade';
import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
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
import { PessoaFacade } from 'src/app/application/facade/pessoa.facade';
import { PessoaViewModel } from 'src/app/core/models/pessoa.models';
import { EnumNaturezaOperacao } from 'src/app/core/enums/enum.types';
import { EMPTY, catchError } from 'rxjs';
import { Endereco } from 'src/app/core/api/viacep-api.service';
import { ViacepFacade } from 'src/app/application/facade/viacep.facade';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { MaskDirective } from 'src/app/presentation/shared/directives/mask.directive';

@Component({
    selector: 'app-pessoa-cadastro',
    imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    TextareaModule,
    MaskDirective
  ],
    templateUrl: './pessoa-cadastro.component.html',
    styleUrls: ['./pessoa-cadastro.component.css']
})
export class PessoaCadastroComponent {
  pipe = new DatePipe("en-US");
  funcionalidade = FuncionalidadeEnum.CADASTRAR;
  form!: FormGroup;
  dadosUsuario = new Configuracao().recuperarDados();
  codigoRegistro: string = '';
  tipoPessoa: string = 'PJ';
  listEstados: any;
  listMunicipios: any;

  listaSubTipoPessoa: any[] = [
    { codigo: 'Colaborador', descricao: 'Colaborador' },
    { codigo: 'Empresa', descricao: 'Empresa' },
    { codigo: 'Pessoa Física', descricao: 'Pessoa Física' },
    { codigo: 'Propria', descricao: 'Propria' }

  ];

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private pessoaFacade: PessoaFacade,
    private alertService: AlertService,
    private router: Router,
    private viacep: ViacepFacade,
    private municipioFacade: MunicipioFacade
  ) {
    const func = this.route.snapshot.paramMap.get('funcionalidade');

    if (func) {
      this.funcionalidade = parseInt(func);
    }
    this.form = this.montaFormGroup();
  }

  ngOnInit(): void {
    this.codigoRegistro = this.route.snapshot.paramMap.get('codigo') || '';
    this.onEstados();
    if (this.funcionalidade === FuncionalidadeEnum.VISUALIZAR || this.funcionalidade === FuncionalidadeEnum.EDITAR) {
      this.montaDados(this.codigoRegistro);
    }
  }

  private montaFormGroup() {
    return this.formBuilder.group({
      nome: [{ value: '', disabled: false }, [Validators.required]],
      nomeFantasia: [{ value: '', disabled: false }],
      subTipoPessoa: [{ value: '', disabled: false }, [Validators.required]],
      cPFCNPJ: [{ value: '', disabled: false }, [Validators.required]],
      rGIEestadual: [{ value: '', disabled: false }],
      dataNascimento: [{ value: '', disabled: false }],
      telefone: [{ value: '', disabled: false }],
      celular: [{ value: '', disabled: false }, [Validators.required]],
      email: [
        { value: '', disabled: false },
        [Validators.required, Validators.email],
      ],
      enderecoRua: [{ value: '', disabled: false }, [Validators.required]],
      enderecoNumero: [{ value: '', disabled: false }, [Validators.required]],
      enderecoBairro: [{ value: '', disabled: false }, [Validators.required]],
      estadoID: [{ value: '', disabled: false }],
      enderecoMunicipioID: [
        { value: '', disabled: false },
        [Validators.required],
      ],
      enderecoCep: [{ value: '', disabled: false }, [Validators.required]],
      enderecoComplemento: [{ value: '', disabled: false }],
      observacao: [{ value: '', disabled: false }],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  montaDados(codigo: string) {
    this.pessoaFacade.getConsultarID(codigo).subscribe((response) => {
     this.tipoPessoa = response.tipoPessoa;
      if (!response) {
        this.alertService.showAlertWarning('Pessoa','Não foi possívellocalizar os dados!.','app/listPessoa',codigo);
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
    console.log(this.form)
    if (this.form.invalid) {
      this.alertService.showAlertWarning(
        'Pessoa',
        'Existem campos obrigatórios não preenchidos ou com erro.',
        '',
        '0'
      );
      return;
    }

    const dadosForm = this.form.value;   
    const dados = new PessoaViewModel(
      this.codigoRegistro == '' ? '0' : this.codigoRegistro,
      this.tipoPessoa,
      dadosForm.subTipoPessoa,
      dadosForm.nome,
      dadosForm.nomeFantasia,
      dadosForm.cPFCNPJ,
      dadosForm.rGIEestadual,
      dadosForm.dataNascimento,
      dadosForm.telefone,
      dadosForm.celular,
      dadosForm.email,
      dadosForm.enderecoRua,
      dadosForm.enderecoNumero,
      dadosForm.enderecoBairro,
      dadosForm.enderecoMunicipioID,
      dadosForm.enderecoCep,
      dadosForm.enderecoComplemento,
      dadosForm.observacao,      
      this.funcionalidade === FuncionalidadeEnum.CADASTRAR ? EnumNaturezaOperacao.INCLUSAO : EnumNaturezaOperacao.ALTERACAO,
      this.dadosUsuario.usuarioID.toString()
    );

    if (this.funcionalidade === FuncionalidadeEnum.CADASTRAR) {
      this.pessoaFacade.postInserir(dados).subscribe((data: any) => {
        if (data.executouServico == false) {
          this.alertService.showAlertWarning('', data.mensagemFalha, '', '0');
        } else {
          this.onVisualizar(data.codigo);
          this.alertService.showAlertSuccess('', data.mensagemSucesso, '', '0');
        }
      });
    } else {
      this.pessoaFacade.postAtualiza(dados).subscribe((data: any) => {
        if (data.executouServico == false) {
          this.alertService.showAlertWarning('', data.mensagemFalha, '', '0');
        } else {
          this.onVisualizar(data.codigo);
          this.alertService.showAlertSuccess('', data.mensagemSucesso, '', '0');
        }
      });
    }
  }

  private atualizaFormulario(dados: any) {
    
    this.form.patchValue({
      nome: dados.nome,
      nomeFantasia: dados.nomeFantasia,
      subTipoPessoa: dados.subTipoPessoa,
      cPFCNPJ: dados.cpfcnpj,
      rGIEestadual: dados.rgiEstadual,
      dataNascimento: this.pipe.transform(dados.dataNascimento, "yyyy-MM-dd"),
      telefone: dados.telefone,
      celular: dados.celular,
      email: dados.email,
      enderecoRua: dados.enderecoRua,
      enderecoNumero: dados.enderecoNumero,
      enderecoBairro: dados.enderecoBairro,
      estadoID: dados.estadoID,
      enderecoMunicipioID: dados.enderecoMunicipioID,
      enderecoCep: dados.enderecoCep,
      enderecoComplemento: dados.enderecoComplemento,
      observacao: dados.observacao
    });
    this.onMunicipios(dados.estadoID);  
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
    this.router.navigate(['app/listpessoa/']);
  }

  onEditar() {
    return new Configuracao().goTo(
      this.router,
      'app/listpessoa/pessoacadastro/editar/',
      this.codigoRegistro,
      FuncionalidadeEnum.EDITAR
    );
  }

  onVisualizar(codigo: string) {
    return new Configuracao().goTo(
      this.router,
      'app/listpessoa/pessoacadastro/visualizar/',
      codigo,
      FuncionalidadeEnum.VISUALIZAR
    );
  }

  validaTipoPessoa(dados: any) {
    let total = dados
      .replaceAll('.', '')
      .replace('-', '')
      .replace('/', '').length;

    if (total == 11) this.tipoPessoa = 'PF';
    else this.tipoPessoa = 'PJ';
  }

  onBuscaEndereco(cep: string) {
    this.viacep
      .buscarPorCep(cep.replace('-', ''))
      .pipe(
        catchError(() => {
          return EMPTY;
        })
      )
      .subscribe((endereco: Endereco) => {       
        this.f.enderecoRua.setValue(endereco.logradouro);
        this.f.enderecoBairro.setValue(endereco.bairro);
        this.f.estadoID.setValue(endereco.uf);
        this.onMunicipios(endereco.uf);                
        this.f.enderecoMunicipioID.setValue(endereco.ibge);
      });
  }

  onEstados() {
    this.municipioFacade.getListEstados().subscribe((dados) => {
      this.listEstados = dados;
    });
  }

  onMunicipios(codigo: any) {   
    this.municipioFacade.getListMunicipios(codigo).subscribe((dados) => {
      this.listMunicipios = dados;
    });
  }
}
