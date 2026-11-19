import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

type size =  'xsm' | 'sm' | 'xmd' | 'md' | 'lg' | 'x-lg';
type fontsize = 'sm-fs' | 'md-fs' | 'xmd-fs' | 'lg-fs' | 'x-lg-fs';
type borda =  'none' | 'bd-azul' | 'bd-cinza' | 'bd-laranja';

@Component({
  selector: 'app-tags-filtro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tags-filtro.component.html',
  styleUrl: './tags-filtro.component.css'
})
export class TagsFiltroComponent {
  @Input() colorScheme: string;
  @Input() borda: borda = 'none';
  @Input() size: size = 'sm';
  @Input() fontSize: fontsize = 'sm-fs';
}
