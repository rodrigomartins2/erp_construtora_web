import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ImageModule } from 'primeng/image';

import { Configuracao } from 'src/app/core/utils/configuracao';
import { DialogModalService, ModalSize } from '../../../services-ui/dialog-modal.service';
import { ToastMessageService } from '../../../services-ui/toast-message.service';
import { ViewerRelatorios } from '../../viewer-relatorios/viewer-relatorios';

export type FileUploadTipo = 'image' | 'pdf';

export type FileUploadItem = {
  valor: string;
  previewUrl: string;
  tipo: FileUploadTipo;
  nome: string;
};

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic', '.heif'];
const HEIC_MIME_TYPES = ['image/heic', 'image/heif', 'image/heic-sequence', 'image/heif-sequence'];
const PDF_MIME_TYPE = 'application/pdf';

@Component({
  selector: 'app-input-file-upload',
  standalone: true,
  imports: [CommonModule, ImageModule],
  templateUrl: './input-file-upload.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFileUploadComponent),
      multi: true,
    },
  ],
})
export class InputFileUploadComponent implements ControlValueAccessor {
  private readonly toastMessageService = inject(ToastMessageService);
  private readonly dialogModalService = inject(DialogModalService);

  @Input() inputId = 'input-file-upload';
  @Input() label = 'Arquivos';
  @Input() maxFiles = 5;
  @Input() maxSizeMB = 2;
  @Input() allowedTypes: FileUploadTipo[] = ['image', 'pdf'];
  /** Destaca o primeiro arquivo (imagem) como principal e permite reordenar. */
  @Input() showPrincipal = true;
  @Input() emptyMessage = 'Nenhum arquivo cadastrado.';
  @Input() error = false;
  @Input() errorMessage = 'Este campo é obrigatório';

  /** Emite os arquivos (com nome e tipo) sempre que o usuário adiciona ou remove algo. */
  @Output() itemsChange = new EventEmitter<FileUploadItem[]>();

  readonly items = signal<FileUploadItem[]>([]);
  readonly disabled = signal(false);

  private writeToken = 0;
  private onChange: (value: string[] | null) => void = () => {};
  private onTouched: () => void = () => {};

  get accept(): string {
    const accept: string[] = [];
    if (this.allowedTypes.includes('image')) {
      accept.push('image/*', ...IMAGE_EXTENSIONS, ...HEIC_MIME_TYPES);
    }
    if (this.allowedTypes.includes('pdf')) {
      accept.push(PDF_MIME_TYPE, '.pdf');
    }
    return accept.join(',');
  }

  get hint(): string {
    const tipos: string[] = [];
    if (this.allowedTypes.includes('image')) tipos.push('JPG/PNG/HEIC');
    if (this.allowedTypes.includes('pdf')) tipos.push('PDF');
    const limite = this.maxFiles === 1 ? '1 arquivo' : `até ${this.maxFiles} arquivos`;
    return `${limite[0].toUpperCase()}${limite.slice(1)}, ${tipos.join('/')} máx ${this.maxSizeMB}MB`;
  }

  writeValue(value: string[] | null): void {
    const token = ++this.writeToken;
    const valores = value?.filter(Boolean) ?? [];

    if (valores.length === 0) {
      this.items.set([]);
      return;
    }

    Promise.all(valores.map((valor) => this.prepararItemSalvo(valor))).then((items) => {
      if (token === this.writeToken) {
        this.items.set(items);
      }
    });
  }

  registerOnChange(fn: (value: string[] | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  onArquivoSelecionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    input.value = '';

    void this.processarArquivos(files);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();

    if (this.disabled()) return;

    void this.processarArquivos(Array.from(event.dataTransfer?.files ?? []));
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  remover(index?: number): void {
    if (index === undefined) {
      this.atualizarItems([]);
      return;
    }

    this.atualizarItems(this.items().filter((_, currentIndex) => currentIndex !== index));
  }

  definirComoPrincipal(index: number): void {
    if (this.disabled() || index <= 0) return;

    const items = [...this.items()];
    const [selecionado] = items.splice(index, 1);
    if (!selecionado) return;

    this.atualizarItems([selecionado, ...items]);
  }

  async abrirPdf(item: FileUploadItem): Promise<void> {
    try {
      const response = await fetch(this.getUrl(item.valor));
      if (!response.ok) {
        throw new Error('Não foi possível carregar o arquivo PDF.');
      }

      const arquivo = await response.blob();
      const pdfBlob = arquivo.type === PDF_MIME_TYPE
        ? arquivo
        : new Blob([await arquivo.arrayBuffer()], { type: PDF_MIME_TYPE });

      this.dialogModalService.open(ViewerRelatorios, {
        title: item.nome,
        width: ModalSize.XL,
        data: { pdfBlob, filename: item.nome },
        showFooter: false,
        styleClass: 'relatorio-viewer-dialog',
      });
    } catch {
      this.toastMessageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível visualizar o arquivo PDF.',
      });
    }
  }

  getUrl(valor: string): string {
    if (valor.startsWith('data:') || /^https?:\/\//i.test(valor)) {
      return valor;
    }

    const apiOrigin = new Configuracao().enderecoApi().replace(/\/+$/, '').replace(/\/api$/i, '');
    const normalizedPath = valor.startsWith('/') ? valor : `/${valor}`;

    return `${apiOrigin}${normalizedPath}`;
  }

  isHeic(valor: string): boolean {
    const source = valor.toLowerCase();

    return (
      source.startsWith('data:image/heic') ||
      source.startsWith('data:image/heif') ||
      source.endsWith('.heic') ||
      source.endsWith('.heif')
    );
  }

  private async processarArquivos(files: File[]): Promise<void> {
    if (files.length === 0) return;

    const atuais = this.items();
    const vagas = this.maxFiles - atuais.length;

    if (vagas <= 0) {
      this.avisar(`É permitido inserir no máximo ${this.maxFiles} arquivos.`);
      return;
    }

    const selecionados = files.slice(0, vagas);

    if (files.length > vagas) {
      this.avisar(
        `Foram adicionados apenas ${vagas} arquivos para respeitar o limite de ${this.maxFiles}.`,
      );
    }

    if (selecionados.some((file) => this.getTipoArquivo(file) === null)) {
      this.avisar(this.mensagemTipoInvalido());
      return;
    }

    if (selecionados.some((file) => file.size > this.maxSizeMB * 1024 * 1024)) {
      this.avisar(`Cada arquivo deve ter no máximo ${this.maxSizeMB}MB.`);
      return;
    }

    try {
      const novos = await Promise.all(selecionados.map((file) => this.lerArquivo(file)));
      this.atualizarItems([...atuais, ...novos]);
    } catch {
      this.toastMessageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível ler o arquivo selecionado.',
      });
    }
  }

  private async lerArquivo(file: File): Promise<FileUploadItem> {
    const tipo = this.getTipoArquivo(file) as FileUploadTipo;
    const valor =
      tipo === 'image' && this.isArquivoHeic(file)
        ? await this.converterHeicParaJpeg(file)
        : await this.blobToDataUrl(file);

    return { valor, previewUrl: valor, tipo, nome: file.name };
  }

  private async prepararItemSalvo(valor: string): Promise<FileUploadItem> {
    const tipo = this.getTipoValor(valor);
    const nome = this.getNomeValor(valor, tipo);

    if (tipo === 'pdf' || !this.isHeic(valor)) {
      return { valor, previewUrl: valor, tipo, nome };
    }

    try {
      const response = await fetch(this.getUrl(valor));
      if (!response.ok) {
        return { valor, previewUrl: valor, tipo, nome };
      }

      const previewUrl = await this.converterHeicParaJpeg(await response.blob());
      return { valor, previewUrl, tipo, nome };
    } catch {
      return { valor, previewUrl: valor, tipo, nome };
    }
  }

  private atualizarItems(items: FileUploadItem[]): void {
    this.items.set(items);
    this.onChange(items.length > 0 ? items.map((item) => item.valor) : null);
    this.itemsChange.emit(items);
    this.onTouched();
  }

  private getTipoArquivo(file: File): FileUploadTipo | null {
    const fileName = file.name.toLowerCase();
    const fileType = file.type.toLowerCase();

    if (
      this.allowedTypes.includes('pdf') &&
      (fileType === PDF_MIME_TYPE || fileName.endsWith('.pdf'))
    ) {
      return 'pdf';
    }

    const isImage =
      fileType.startsWith('image/') ||
      HEIC_MIME_TYPES.includes(fileType) ||
      IMAGE_EXTENSIONS.some((extension) => fileName.endsWith(extension));

    return this.allowedTypes.includes('image') && isImage ? 'image' : null;
  }

  private getTipoValor(valor: string): FileUploadTipo {
    const source = valor.toLowerCase().split(/[?#]/)[0];
    return source.startsWith('data:application/pdf') || source.endsWith('.pdf') ? 'pdf' : 'image';
  }

  private getNomeValor(valor: string, tipo: FileUploadTipo): string {
    if (valor.startsWith('data:')) {
      return tipo === 'pdf' ? 'Documento PDF' : 'Imagem';
    }

    return decodeURIComponent(valor.split(/[?#]/)[0].split('/').pop() || 'Arquivo');
  }

  private mensagemTipoInvalido(): string {
    const somenteImagem = this.allowedTypes.length === 1 && this.allowedTypes[0] === 'image';
    const somentePdf = this.allowedTypes.length === 1 && this.allowedTypes[0] === 'pdf';

    if (somenteImagem) return 'Selecione apenas arquivos de imagem válidos.';
    if (somentePdf) return 'Selecione apenas arquivos PDF válidos.';
    return 'Selecione apenas imagens ou arquivos PDF válidos.';
  }

  private avisar(detail: string): void {
    this.toastMessageService.add({ severity: 'warn', summary: 'Atenção', detail });
  }

  private isArquivoHeic(file: File): boolean {
    const fileName = file.name.toLowerCase();

    return (
      fileName.endsWith('.heic') ||
      fileName.endsWith('.heif') ||
      HEIC_MIME_TYPES.includes(file.type.toLowerCase())
    );
  }

  private async converterHeicParaJpeg(file: Blob): Promise<string> {
    // Conversão de HEIC (fotos de iPhone) não é usada neste sistema: o arquivo segue como está.
    return this.blobToDataUrl(file);
  }

  private blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}
