import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/pdf';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { defer, finalize, Observable } from 'rxjs';
import { ToastMessageService } from '../../services-ui/toast-message.service';

export interface RelatorioExcelDownload {
  filename: string;
  request: () => Observable<Blob>;
}

export interface ViewerRelatoriosData {
  pdfBlob?: Blob;
  filename?: string;
  excelDownload?: RelatorioExcelDownload;
}

@Component({
  selector: 'app-viewer-relatorios',
  standalone: true,
  imports: [CommonModule, ButtonModule, SkeletonModule],
  templateUrl: './viewer-relatorios.html',
  styleUrl: './viewer-relatorios.css',
})
export class ViewerRelatorios implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('viewerContent') private viewerContent?: ElementRef<HTMLDivElement>;
  @ViewChild('pdfCanvas') private pdfCanvas?: ElementRef<HTMLCanvasElement>;

  private readonly config = inject<DynamicDialogConfig<ViewerRelatoriosData>>(DynamicDialogConfig, {
    optional: true,
  });
  private readonly destroyRef = inject(DestroyRef);
  private readonly toast = inject(ToastMessageService);
  private readonly minZoom = 0.25;
  private readonly maxZoom = 2.5;
  private readonly zoomStep = 0.1;

  private _pdfBlob: Blob | null = null;
  private pdfDocument: PDFDocumentProxy | null = null;
  private renderId = 0;
  private advancingByScroll = false;

  @Input() set pdfBlob(value: Blob | null) {
    this._pdfBlob = value;
    if (value) {
      void this.processBlob(value);
    }
  }

  get pdfBlob(): Blob | null {
    return this._pdfBlob;
  }

  @Input() filename = 'relatorio.pdf';
  @Input() excelDownload?: RelatorioExcelDownload;
  readonly downloadingExcel = signal(false);

  rawUrl = signal<string | null>(null);
  loading = signal<boolean>(true);
  canvasReady = signal<boolean>(false);
  zoom = signal<number>(1);
  currentPage = signal<number>(1);
  totalPages = signal<number>(0);
  zoomPercent = computed(() => `${Math.round(this.zoom() * 100)}%`);
  canZoomOut = computed(() => this.zoom() > this.minZoom);
  canZoomIn = computed(() => this.zoom() < this.maxZoom);

  ngOnInit(): void {
    this.excelDownload = this.config?.data?.excelDownload ?? this.excelDownload;
    if (this.config?.data?.pdfBlob) {
      this.pdfBlob = this.config.data.pdfBlob;
      this.filename = this.config.data.filename || this.filename;
    } else if (!this.pdfBlob) {
      this.loading.set(false);
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.fitToPage());
  }

  ngOnDestroy(): void {
    this.revokeCurrentUrl();
    void this.pdfDocument?.cleanup();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.fitToPage();
  }

  zoomOut(): void {
    this.setZoom(this.zoom() - this.zoomStep);
  }

  zoomIn(): void {
    this.setZoom(this.zoom() + this.zoomStep);
  }

  resetZoom(): void {
    this.fitToPage();
  }

  previousPage(): void {
    void this.goToPage(this.currentPage() - 1);
  }

  nextPage(): void {
    void this.goToPage(this.currentPage() + 1);
  }

  onPageInput(value: string): void {
    void this.goToPage(Number(value));
  }

  async goToPage(pageNumber: number): Promise<void> {
    const page = Math.trunc(pageNumber);

    if (!Number.isFinite(page) || page < 1 || page > this.totalPages()) {
      return;
    }

    this.currentPage.set(page);
    this.fitToPage();
    if (this.viewerContent) {
      this.viewerContent.nativeElement.scrollTop = 0;
    }
    this.advancingByScroll = true;
    setTimeout(() => (this.advancingByScroll = false), 1000);
  }

  onViewerScroll(): void {
    const content = this.viewerContent?.nativeElement;
    if (
      !content ||
      this.advancingByScroll ||
      this.currentPage() >= this.totalPages() ||
      content.scrollHeight <= content.clientHeight + 2 ||
      content.scrollTop + content.clientHeight < content.scrollHeight - 2
    ) {
      return;
    }

    this.advancingByScroll = true;
    void this.goToPage(this.currentPage() + 1);
  }

  onViewerWheel(event: WheelEvent): void {
    const content = this.viewerContent?.nativeElement;
    if (!content || this.advancingByScroll) {
      return;
    }

    const atTop = content.scrollTop <= 2;
    const atBottom = content.scrollTop + content.clientHeight >= content.scrollHeight - 2;

    if (
      event.deltaY > 0 &&
      (atBottom || content.scrollHeight <= content.clientHeight + 2) &&
      this.currentPage() < this.totalPages()
    ) {
      event.preventDefault();
      void this.goToPage(this.currentPage() + 1);
    } else if (
      event.deltaY < 0 &&
      (atTop || content.scrollHeight <= content.clientHeight + 2) &&
      this.currentPage() > 1
    ) {
      event.preventDefault();
      void this.goToPage(this.currentPage() - 1);
    }
  }

  downloadPdf(): void {
    const url = this.rawUrl();
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = this.filename;
      link.click();
    }
  }

  downloadExcel(): void {
    const download = this.excelDownload;
    if (!download || this.downloadingExcel()) return;
    this.downloadingExcel.set(true);
    defer(download.request)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.downloadingExcel.set(false)),
      )
      .subscribe({
        next: (arquivo) => {
          const url = URL.createObjectURL(arquivo);
          const link = document.createElement('a');
          link.href = url;
          link.download = download.filename;
          link.click();
          URL.revokeObjectURL(url);
        },
        error: () =>
          this.toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Não foi possível baixar a versão em Excel. Tente novamente.',
          }),
      });
  }

  printPdf(): void {
    const url = this.rawUrl();
    if (url) {
      const printWindow = window.open(url, '_blank');
      printWindow?.addEventListener('load', () => printWindow.print(), { once: true });
    }
  }

  openNewTab(): void {
    const url = this.rawUrl();
    if (url) {
      window.open(url, '_blank');
    }
  }

  private async processBlob(blob: Blob): Promise<void> {
    if (!(blob instanceof Blob)) {
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.canvasReady.set(false);
    this.revokeCurrentUrl();
    void this.pdfDocument?.cleanup();

    const url = URL.createObjectURL(blob);
    this.rawUrl.set(url);

    const data = await blob.arrayBuffer();
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'assets/pdfjs/pdf.worker.min.mjs',
      document.baseURI,
    ).toString();
    this.pdfDocument = await pdfjsLib.getDocument({ data }).promise;
    this.totalPages.set(this.pdfDocument.numPages);
    this.currentPage.set(1);

    this.loading.set(false);
    setTimeout(() => this.fitToPage());
  }

  private fitToPage(): void {
    const content = this.viewerContent?.nativeElement;

    if (!content || !this.pdfDocument) {
      return;
    }

    const width = content.clientWidth;
    if (width <= 0) {
      return;
    }

    this.zoom.set(1);
    void this.renderCurrentPage();
  }

  private setZoom(value: number): void {
    this.zoom.set(this.normalizeZoom(value));
    void this.renderCurrentPage();
  }

  private async renderCurrentPage(): Promise<void> {
    const canvas = this.pdfCanvas?.nativeElement;

    if (!canvas || !this.pdfDocument) {
      return;
    }

    this.canvasReady.set(false);
    const renderAttempt = ++this.renderId;
    const page = await this.pdfDocument.getPage(this.currentPage());
    const containerWidth = this.viewerContent?.nativeElement.clientWidth || 760;
    const baseViewport = page.getViewport({ scale: 1 });
    const scale = (containerWidth / baseViewport.width) * this.zoom();
    const viewport = page.getViewport({ scale });
    const context = canvas.getContext('2d');

    if (!context || renderAttempt !== this.renderId) {
      return;
    }

    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({ canvas, canvasContext: context, viewport }).promise;

    if (renderAttempt === this.renderId) {
      this.canvasReady.set(true);
      this.advancingByScroll = false;
    }
  }

  private normalizeZoom(value: number): number {
    const zoom = Math.min(this.maxZoom, Math.max(this.minZoom, value));

    return Number(zoom.toFixed(2));
  }

  private revokeCurrentUrl(): void {
    const url = this.rawUrl();
    if (url) {
      URL.revokeObjectURL(url);
    }
  }
}
