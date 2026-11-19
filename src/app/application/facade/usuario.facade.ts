import { Injectable, inject } from '@angular/core';

import { UsuarioApiService } from 'src/app/core/api/usuario-api.service';
import { BaseCrudFacade } from 'src/app/application/shared/base-crud.facade';
import { GridUsuarioViewModel, UsuarioFiltroGridViewModel, UsuarioViewModel } from 'src/app/core/models/usuario.models';
import { SelectDropModel } from 'src/app/core/models/generics.models';

/** Facade de usuário: ponto de acesso das páginas à API UsuarioApiService. */
@Injectable({ providedIn: 'root' })
export class UsuarioFacade extends BaseCrudFacade<UsuarioViewModel, UsuarioFiltroGridViewModel, GridUsuarioViewModel, UsuarioViewModel, UsuarioViewModel> {
  private readonly api: UsuarioApiService;

  constructor() {
    const api = inject(UsuarioApiService);
    super(api, 'o usuário');
    this.api = api;
  }

  getListUsuario() {
    return this.runWithState(() => this.api.getListUsuario(), 'Não foi possível carregar o usuário.');
  }
}
