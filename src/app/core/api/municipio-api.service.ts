import { Injectable } from '@angular/core';
import { Configuracao } from 'src/app/core/utils/configuracao';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Estados, Municipios } from 'src/app/core/models/municipio.models';

@Injectable({
  providedIn: 'root'
})
export class MunicipioApiService {
  apiUrl = new Configuracao().enderecoApi() + 'api';
  
  httpOptions = {
    headers: new HttpHeaders({
      accept: "text/plain",
      "Content-Type": "application/json-patch+json",
    }),
  };
   
  constructor(private httpClient: HttpClient) { }

  public getListMunicipios(id: string) {
    return this.httpClient.get<Municipios>(`${this.apiUrl}/Municipio/Municipios/` + id);
  }

  public getListEstados() {
    return this.httpClient.get<Estados>(`${this.apiUrl}/Municipio/Estados`);
  }
}
