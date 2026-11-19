import { computed, signal } from '@angular/core';
import { catchError, defer, finalize, Observable, throwError } from 'rxjs';

/**
 * Base das facades: centraliza o estado de carregamento (`loading`) e a última
 * mensagem de erro (`errorMessage`) das requisições disparadas pela facade.
 *
 * Diferente do projeto de referência, esta API não usa envelope `ApiResponse`:
 * os endpoints devolvem o dado direto, então a facade só repassa a resposta.
 */
export abstract class BaseFacade {
  private readonly _pendingRequests = signal(0);
  private readonly _errorMessage = signal<string | null>(null);

  readonly loading = computed(() => this._pendingRequests() > 0);
  readonly errorMessage = computed(() => this._errorMessage());

  clearError(): void {
    this._errorMessage.set(null);
  }

  /** Executa a requisição controlando `loading` e registrando a mensagem de erro. */
  protected runWithState<TDados>(requestFactory: () => Observable<TDados>, errorMessage: string): Observable<TDados> {
    return defer(() => {
      this.incrementLoading();
      this.clearError();

      return requestFactory().pipe(
        catchError((error: unknown) => {
          this._errorMessage.set(this.extrairMensagem(error) ?? errorMessage);
          return throwError(() => error);
        }),
        finalize(() => this.decrementLoading())
      );
    });
  }

  private extrairMensagem(error: unknown): string | null {
    const httpError = error as {
      error?: { mensagem?: string; mensagemFalha?: string; message?: string; erros?: string[]; errors?: string[] };
      message?: string;
    };

    const backend =
      httpError?.error?.mensagemFalha ||
      httpError?.error?.mensagem ||
      httpError?.error?.message ||
      httpError?.error?.erros?.[0] ||
      httpError?.error?.errors?.[0];

    if (backend) {
      return backend;
    }
    if (error instanceof Error && !error.message.startsWith('Http failure response')) {
      return error.message;
    }
    return null;
  }

  private incrementLoading(): void {
    this._pendingRequests.update((value) => value + 1);
  }

  private decrementLoading(): void {
    this._pendingRequests.update((value) => Math.max(0, value - 1));
  }
}
