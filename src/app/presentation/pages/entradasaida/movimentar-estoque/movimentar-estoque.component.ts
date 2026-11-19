import { filter } from 'rxjs';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Configuracao } from 'src/app/core/utils/configuracao';
import { SelectDropModel } from 'src/app/core/models/generics.models';
import { ActivatedRoute, Router } from '@angular/router';
import { EntradaSaidaFacade } from 'src/app/application/facade/entrada-saida.facade';
import { AlertService } from 'src/app/presentation/services-ui/alert.service';
import { EstoquePessoaFacade } from 'src/app/application/facade/estoque-pessoa.facade';
import { ProdutoDescricaoFacade } from 'src/app/application/facade/produto-descricao.facade';
import { ProdutoDescricaoRetornoViewModel } from 'src/app/core/models/produto-descricao.models';
import { ItensProdutos } from 'src/app/core/models/itens-entrada-saida.models';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { AutocompleteComponent } from 'src/app/presentation/components/autocomplete/autocomplete.component';

@Component({
    selector: 'app-movimentar-estoque',
    imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    TextareaModule,
    AutocompleteComponent
  ],
    templateUrl: './movimentar-estoque.component.html',
    styleUrls: ['./movimentar-estoque.component.css']
})
export class MovimentarEstoqueComponent {
  form!: FormGroup;
  dadosUsuario = new Configuracao().recuperarDados();
  listEstoqueSaida: SelectDropModel[] = [];
  listEstoqueEntrada: SelectDropModel[] = [];
  listProduto: SelectDropModel[] = [];
  itensProdutos: any[] = [];
  produto!: ProdutoDescricaoRetornoViewModel;
 codProduto: any;


  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private entradaSaidaFacade: EntradaSaidaFacade,
    private alertService: AlertService,
    private estoquePessoaFacade: EstoquePessoaFacade,
    private produtodescricaoFacade: ProdutoDescricaoFacade,
    private router: Router
  ) {
    this.form = this.montaFormGroup();
  }

  ngOnInit(): void {
    
    this.onListEstoqueSaida();
    this.onListProdutos();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  private montaFormGroup() {
    return this.formBuilder.group({
      estoqueSaidaID: [{ value: '', disabled: false }, [Validators.required]],      
      estoqueEntradaID: [{ value: '', disabled: false }, [Validators.required]],      
      descricao: [{ value: '', disabled: false }],
      observacao: [{ value: '', disabled: false }],
        
    });
  }

  private montaFormGroupItem() {
    return this.formBuilder.group({
               
    });
  }

  onSubmit(){

  }

  onSubmitItem(quant: any){
    let testeProdutos = {};
    let dteste = [];

   

    
    var item = this.itensProdutos.filter(res => res.codigo = this.codProduto)
    console.log("Apos  o Filter",item)
    // if(item.length > 0){      
    //   this.alertService.showAlertInfo('Item Produto', 'Itens já cadastrado!', '', '0');
    // } else {
    testeProdutos = { codigo: this.codProduto, descricao:  '', quantidade: quant};
       dteste.push(testeProdutos);
    // }

    // this.f.quantidade.setValue('');  
    // this.f.produtoDescricaoID.setValue('');  
    console.log("Final",dteste)       
    this.itensProdutos.push(dteste)              
  }

  onListEstoqueSaida() {
    this.estoquePessoaFacade.getListEstoquePessoa().subscribe((response) => {      
      this.listEstoqueSaida = response;
    });
  }

  onListEstoqueEntrada() {    
    const dadosForm = this.form.value;   
      this.listEstoqueEntrada = this.listEstoqueSaida.filter(res => res.codigo != dadosForm.estoqueSaidaID);    
  }

  onListProdutos() {
    this.produtodescricaoFacade
      .getListProdutoDescricaoComSaldo()
      .subscribe((response) => {
        this.listProduto = response;
      });
  }

  selectEvent(item: any) {  
 this.codProduto = item.codigo

      this.produtodescricaoFacade
        .getConsultarID(item.codigo)
        .subscribe((response) => {         
          this.produto = response;          
        });   
  }

  onValorProduto(quantidade: any) {   
      if (parseInt(this.produto.saldo) < parseInt(quantidade)) {
        this.alertService.showAlertWarning('Saldo', 'Produto com saldo menor que o solicitado','','0');
        this.f.quantidade.setValue('');       
      }    
  }

}
