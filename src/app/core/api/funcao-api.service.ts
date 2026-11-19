import { Injectable } from '@angular/core';
import { Configuracao } from 'src/app/core/utils/configuracao';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SelectDropModel } from 'src/app/core/models/generics.models';

@Injectable({
  providedIn: 'root'
})
export class FuncaoApiService {
  apiUrl = new Configuracao().enderecoApi() + 'api';
  
  httpOptions = {
    headers: new HttpHeaders({
      accept: "text/plain",
      "Content-Type": "application/json-patch+json",
    }),
  };
   
  constructor(private httpClient: HttpClient) { }
 
   public getListFuncao() {
    return this.httpClient.get<SelectDropModel[]>(`${this.apiUrl}/Funcao/SelectFuncao/`);
  }  
}
