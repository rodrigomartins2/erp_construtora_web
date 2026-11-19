import { Injectable } from '@angular/core';
import { GridProdutoViewModel, ProdutoFiltroGridViewModel, ProdutoViewModel } from 'src/app/core/models/produto.models';
import { Observable } from 'rxjs';
import { BaseCrudApiService } from 'src/app/core/api/base-crud-api.service';
import { SelectDropModel } from 'src/app/core/models/generics.models';

@Injectable({
  providedIn: 'root'
})
export class ProdutoApiService extends BaseCrudApiService<ProdutoViewModel, ProdutoFiltroGridViewModel, GridProdutoViewModel, ProdutoViewModel, ProdutoViewModel> {
  
   
  constructor() {
    super('Produto');
  }

   public getListProduto() {
    return this.httpClient.get<SelectDropModel[]>(`${this.apiUrl}/Produto/SelectProduto/`);
  }

}
