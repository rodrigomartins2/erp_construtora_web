import { Injectable } from '@angular/core';
import { SelectDropModel } from 'src/app/core/models/generics.models';
import { GridProdutoDescricaoViewModel } from 'src/app/core/models/produto-descricao.models';
import { Observable } from 'rxjs';
import { BaseCrudApiService } from 'src/app/core/api/base-crud-api.service';
import { EstoqueProdutoFiltroGridViewModel, EstoqueProdutoRetornoViewModel, EstoqueProdutoViewModel } from 'src/app/core/models/estoque-produto.models';

@Injectable({
  providedIn: 'root'
})
export class EstoqueProdutoApiService extends BaseCrudApiService<EstoqueProdutoRetornoViewModel, EstoqueProdutoFiltroGridViewModel, GridProdutoDescricaoViewModel, EstoqueProdutoViewModel, EstoqueProdutoViewModel> {
  
   
  constructor() {
    super('EstoqueProduto');
  }

  public getListSelectEstoqueProdutoItens(entradaSaidaID: number) {
    return this.httpClient.get<SelectDropModel[]>(`${this.apiUrl}/EstoqueProduto/SelectEstoqueProdutoItens/`+entradaSaidaID);
  }

  public getListEstoqueProdutoItens() {
    return this.httpClient.get<SelectDropModel[]>(`${this.apiUrl}/EstoqueProduto/SelectEstoqueProduto/`);
  }
  

}
