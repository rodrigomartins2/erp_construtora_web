import { Injectable } from '@angular/core';
import { GridObraViewModel, ObraFiltroGridViewModel, ObraPostViewModel, ObraRetornoViewModel } from 'src/app/core/models/obra.models';
import { Observable } from 'rxjs';
import { BaseCrudApiService } from 'src/app/core/api/base-crud-api.service';
import { SelectDropModel } from 'src/app/core/models/generics.models';

@Injectable({
  providedIn: 'root'
})
export class ObraApiService extends BaseCrudApiService<ObraRetornoViewModel, ObraFiltroGridViewModel, GridObraViewModel, ObraPostViewModel, ObraRetornoViewModel> {
  
   
  constructor() {
    super('Obra');
  }

   public getListObra() {
    return this.httpClient.get<SelectDropModel[]>(`${this.apiUrl}/Obra/SelectObra/`);
  }

 
}
