import { Component } from '@angular/core';

import { Layout } from 'src/app/presentation/layout/layout';

/** Casca das rotas autenticadas (/app): renderiza o layout com header, menu lateral e conteúdo. */
@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css'],
  imports: [Layout]
})
export class PagesComponent {}
