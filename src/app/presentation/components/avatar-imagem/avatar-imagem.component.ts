import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-avatar-imagem',
  standalone: true,
  imports: [AvatarModule, CommonModule, ImageModule, BadgeModule],
  templateUrl: './avatar-imagem.component.html',
  styleUrl: './avatar-imagem.component.scss',
})
export class AvatarImagemComponent {
  @Input() imagem?: string;
  @Input() nome?: string;
  @Input() iconeStyle?: Record<string, string | number>;
  @Input() style?: Record<string, string | number>;
  @Input() tamanho: string = '32';
  @Input() icone?: string;
  @Input() preview: boolean = true;
  @Input() showDeleteButton: boolean = false;
  @Input() deleteButtonAction: (() => void) | null = null;

  get combinedStyle(): Record<string, string> {
    return { ...this.iconeStyle, width: `${this.tamanho}px`, height: `${this.tamanho}px` };
  }

  get imagemFonte(): string | undefined {
    if (!this.imagem) {
      return undefined;
    }

    if (this.isValidUrl(this.imagem)) {
      return this.imagem;
    }

    return this.imagem.includes('base64,') ? this.imagem : `data:image/jpeg;base64,${this.imagem}`;
  }

  private isValidUrl(url: string): boolean {
    return URL.canParse ? URL.canParse(url) : /^https?:\/\/.+/i.test(url);
  }

  get getFirstLetter(): string {
    if (!this.nome) return '';

    const ignoredWords = ['de', 'do', 'da', 'das', 'dos', 'e', 's/a'];
    const parts = this.nome
      .split(' ')
      .filter((part) => part.trim() !== '' && !ignoredWords.includes(part.toLowerCase()));

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    const firstInitial = parts[0]?.charAt(0).toUpperCase() || '';
    const secondInitial = parts[1]?.charAt(0).toUpperCase() || '';

    return firstInitial + secondInitial;
  }
}
