import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EMPTY, Observable, map } from 'rxjs';

export interface Endereco {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia?: string;
  ddd?: string;
  siafi?: string;
}

/** Consulta de endereço por CEP na API pública do ViaCEP (substitui @brunoc/ngx-viacep). */
@Injectable({ providedIn: 'root' })
export class ViacepApiService {
  private readonly http = inject(HttpClient);

  /** Retorna o endereço do CEP; erro se o CEP for inválido ou não existir. */
  buscarPorCep(cep: string): Observable<Endereco> {
    const digitos = (cep ?? '').replace(/\D/g, '');
    if (digitos.length !== 8) {
      return EMPTY;
    }

    // Erros do ViaCEP são tratados na tela; não exibe o alerta genérico do interceptor.
    const headers = new HttpHeaders({ 'X-Skip-Error-Alert': '1' });
    return this.http.get<Endereco & { erro?: boolean | string }>(`https://viacep.com.br/ws/${digitos}/json/`, { headers }).pipe(
      map((resposta) => {
        if (resposta.erro) {
          throw new Error('CEP não encontrado');
        }
        return resposta;
      })
    );
  }
}
