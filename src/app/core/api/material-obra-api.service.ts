import { Injectable } from '@angular/core';
import { GridMaterialObraViewModel, MaterialObraFiltroGridViewModel, MaterialObraViewModel } from 'src/app/core/models/material-obra.models';
import { Observable } from 'rxjs';
import { BaseCrudApiService } from 'src/app/core/api/base-crud-api.service';

@Injectable({
  providedIn: 'root'
})
export class MaterialObraApiService extends BaseCrudApiService<MaterialObraViewModel, MaterialObraFiltroGridViewModel, GridMaterialObraViewModel, MaterialObraViewModel, MaterialObraViewModel> {
  
   
  constructor() {
    super('MaterialObra');
  }

  public getGerarOrdemCompra(obrarID: string, usuarioID: string) {
    return this.httpClient.get<any>(`${this.apiUrl}/MaterialObra/GerarOrdemCompra/`+obrarID+`/`+usuarioID);
  }

}
