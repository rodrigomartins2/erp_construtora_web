import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseCrudApiService } from 'src/app/core/api/base-crud-api.service';
import { GridProdutoDescricaoViewModel, ProdutoDescricaoFiltroGridViewModel, ProdutoDescricaoRetornoViewModel, ProdutoDescricaoViewModel } from 'src/app/core/models/produto-descricao.models';
import { SelectDropModel } from 'src/app/core/models/generics.models';

@Injectable({
  providedIn: 'root'
})
export class ProdutoDescricaoApiService extends BaseCrudApiService<ProdutoDescricaoRetornoViewModel, ProdutoDescricaoFiltroGridViewModel, GridProdutoDescricaoViewModel, ProdutoDescricaoViewModel, ProdutoDescricaoViewModel> {
  
   
  constructor() {
    super('ProdutoDescricao');
  }

   public getListProdutoDescricao() {
    return this.httpClient.get<SelectDropModel[]>(`${this.apiUrl}/ProdutoDescricao/SelectProdutoDescricao/`);
  }

  public getListProdutoDescricaoComSaldo() {
    return this.httpClient.get<SelectDropModel[]>(`${this.apiUrl}/ProdutoDescricao/SelectProdutoDescricaoComSaldo/`);
  }  

  public getListProdutoDescricaoItensObra(obraID: any) {
    return this.httpClient.get<SelectDropModel[]>(`${this.apiUrl}/ProdutoDescricao/SelectProdutoDescricaoItensObra/`+obraID);
  }

  public getListSelectProdutoDescricaoItens(entradaSaidaID: number) {
    return this.httpClient.get<SelectDropModel[]>(`${this.apiUrl}/ProdutoDescricao/SelectProdutoDescricaoItens/`+entradaSaidaID);
  }

  public getListSSelectProdutoDescricaoSemEstoque(estoqueID: string) {
    return this.httpClient.get<SelectDropModel[]>(`${this.apiUrl}/ProdutoDescricao/SelectProdutoDescricaoSemEstoque/`+estoqueID);
  }

  public getListSelectProdutoDescricaoItensPedidoCompra(pedidoCompraID: number) {
    return this.httpClient.get<SelectDropModel[]>(`${this.apiUrl}/ProdutoDescricao/SelectProdutoDescricaoItensPedidoCompra/`+pedidoCompraID);
  }
  

}
