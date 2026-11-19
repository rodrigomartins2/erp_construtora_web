import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Observable, catchError, finalize, tap, throwError } from 'rxjs';
import { LoaderService } from 'src/app/core/services/loader.service';
import { SessionService } from 'src/app/core/auth/session.service';
import { Configuracao } from 'src/app/core/utils/configuracao';
import { AlertService } from 'src/app/presentation/services-ui/alert.service';

@Injectable()
export class HttperrorInterceptor implements HttpInterceptor {
  private readonly apiBaseUrl = new Configuracao().enderecoApi().replace(/\/$/, '');
  private readonly apiHostsAutorizados = ['apiconstutora.sistemagerenciador.com.br'];

  constructor(
    public loaderService: LoaderService,
    private sessionService: SessionService,
    private alertService: AlertService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const skipLoader = request.headers.get('X-Skip-Loader');
    const skipErrorAlert = request.headers.get('X-Skip-Error-Alert');

    if (!skipLoader) {
      this.loaderService.show();
    }

    request = request.clone({
      headers: request.headers.delete('X-Skip-Loader').delete('X-Skip-Error-Alert'),
    });
    request = this.adicionarCabecalhoAutorizacao(request);

    return next.handle(request).pipe(
      finalize(() => this.loaderService.hide()
      ),
      catchError((error: HttpErrorResponse) => {
        this.loaderService.hide();
        if (!skipErrorAlert) {
          this.alertService.showAlertDanger(
            'Erro',
            error.message.toString() + ' - ' + request.url.toString(),
            '',
            '0'
          );
        }
        return throwError(() => error);
      })
    );
  }

  private adicionarCabecalhoAutorizacao(
    request: HttpRequest<any>
  ): HttpRequest<any> {
    const urlRequisicao = request.url.replace(/\/$/, '');
    const urlIncluiAmbiente = urlRequisicao.startsWith(this.apiBaseUrl);
    const urlIncluiHostAutorizado = this.apiHostsAutorizados.some((host) => request.url.includes(host));
    const token = this.sessionService.getToken()?.trim();

    if (token && (urlIncluiHostAutorizado || urlIncluiAmbiente)) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return request;
  }
}
