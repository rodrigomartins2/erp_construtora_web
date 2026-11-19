import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configuracao } from 'src/app/core/utils/configuracao';

@Injectable({
  providedIn: 'root'
})
export class RelatorioApiService {
  apiUrl = new Configuracao().enderecoApi() + 'api';
  
  httpOptions = {
    headers: new HttpHeaders({
      accept: "text/plain",
      "Content-Type": "application/json-patch+json",
    }),
  };

  relatorioHttpOptions = {
    headers: new HttpHeaders({
      'X-Skip-Error-Alert': 'true',
    }),
    responseType: 'blob' as const,
  };
   
  constructor(private httpClient: HttpClient) { }

  public getRelExpedicaoDocumento(codigo: string) {
    return this.httpClient.get(`${this.apiUrl}/Relatorios/RelExpedicaoMaterial/${codigo}`, {responseType: 'blob'});
  }

  public getRelPosicaoEstoque(codigo: string) {
    return this.httpClient.get(`${this.apiUrl}/Relatorios/RelSaldoEstoque/${codigo}`, this.relatorioHttpOptions);
  }

  public getRelOrdemCompra(codigo: string) {
    return this.httpClient.get(`${this.apiUrl}/Relatorios/RelOrdemCompra/${codigo}`, {responseType: 'blob'});
  }

  public getRelMovimentacaoEstoque(codigo: string) {
    return this.httpClient.get(`${this.apiUrl}/Relatorios/RelMovimentacaoEstoque/${codigo}`, this.relatorioHttpOptions);
  }

  public getRelSituacaoDocContrato(empresa: string, situacao: string) {
    return this.httpClient.get(`${this.apiUrl}/Relatorios/RelContratoComDocumentos/${empresa}/${situacao}`, {responseType: 'blob'});
  }

  public getRelContratoVencimento(dtInicio: string, dtFim: string, empresa: string, situacao: string) {
    return this.httpClient.get(`${this.apiUrl}/Relatorios/RelContratoDataVencimento/${dtInicio}/${dtFim}/${empresa}/${situacao}`, {responseType: 'blob'});
  }
}
