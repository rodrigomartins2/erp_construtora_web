import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';
import { DocumentosContratoFacade } from 'src/app/application/facade/documentos-contrato.facade';

/**
 * Exibe um PDF com o visualizador nativo do navegador (substitui o ngx-extended-pdf-viewer).
 *
 * Duas formas de uso:
 * - `[documentoContrato]`: busca o arquivo do documento de contrato na API;
 * - `[src]` (+ `[nomeArquivo]`): URL (blob:/http) ou conteúdo base64 já carregado.
 */
@Component({
  selector: 'app-visualizar-pdf',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './visualizar-pdf.component.html',
  styleUrls: ['./visualizar-pdf.component.css']
})
export class VisualizarPdfComponent implements OnInit, OnDestroy {
  @Input() documentoContrato: any;

  @Input() set src(valor: string | null | undefined) {
    this.definirConteudo(valor);
  }

  @Input() nomeArquivo = '';

  private readonly documentosContratoFacade = inject(DocumentosContratoFacade);
  private readonly sanitizer = inject(DomSanitizer);

  urlSegura: SafeResourceUrl | null = null;
  private url: string | null = null;
  /** URL criada por este componente (precisa ser liberada). */
  private urlCriada: string | null = null;

  ngOnInit() {
    if (this.documentoContrato != null && this.documentoContrato !== '') {
      this.onDados();
    }
  }

  ngOnDestroy() {
    this.liberarUrl();
  }

  onDados() {
    this.documentosContratoFacade.getConsultarID(this.documentoContrato).subscribe((response) => {
      this.nomeArquivo = response.nomeDocumento.split('|')[0];
      this.definirConteudo(response.arquivo);
    });
  }

  baixar() {
    if (!this.url) {
      return;
    }
    const link = document.createElement('a');
    link.href = this.url;
    link.download = this.nomeArquivo || 'documento.pdf';
    link.click();
  }

  private definirConteudo(valor: string | null | undefined) {
    this.liberarUrl();
    this.url = null;
    this.urlSegura = null;

    if (!valor) {
      return;
    }

    if (/^(blob:|https?:|data:)/.test(valor)) {
      this.url = valor;
    } else {
      this.urlCriada = URL.createObjectURL(this.base64ParaBlob(valor));
      this.url = this.urlCriada;
    }
    this.urlSegura = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

  private base64ParaBlob(conteudo: string): Blob {
    const binario = atob(conteudo);
    const bytes = new Uint8Array(binario.length);
    for (let i = 0; i < binario.length; i++) {
      bytes[i] = binario.charCodeAt(i);
    }
    return new Blob([bytes], { type: 'application/pdf' });
  }

  private liberarUrl() {
    if (this.urlCriada) {
      URL.revokeObjectURL(this.urlCriada);
      this.urlCriada = null;
    }
  }
}
