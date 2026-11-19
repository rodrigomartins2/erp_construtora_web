import { Component, Input } from '@angular/core';

/**
 * Barra de ações da página. O título da rota já aparece no `app-page-header` do layout;
 * aqui só é exibido um título quando informado explicitamente (ex.: "Documentos do Contrato Nro. X").
 * Botões são projetados com o atributo `segundoBotao`.
 */
@Component({
  selector: 'app-breakcrumb',
  templateUrl: './breakcrumb.component.html',
  styleUrls: ['./breakcrumb.component.css'],
  standalone: true
})
export class BreakcrumbComponent {
  @Input() titulo = '';
}
