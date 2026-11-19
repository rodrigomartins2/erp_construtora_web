import { Routes } from '@angular/router';
import { UnidamedidaCadastroComponent } from 'src/app/presentation/pages/unidademedida/unidamedida-cadastro/unidamedida-cadastro.component';
import { UnidamedidaListComponent } from 'src/app/presentation/pages/unidademedida/unidamedida-list/unidamedida-list.component';

export const UNIDADEMEDIDA_ROUTES: Routes = [
  {
    path: 'unidademedidacadastro',
    component: UnidamedidaCadastroComponent,
    data: { permissao: ['unidademedidacadastro'], breadcrumb: ['Unidade Medida'] },
  },
  {
    path: 'unidademedidacadastro/editar/:codigo/:funcionalidade',
    component: UnidamedidaCadastroComponent,
    data: { permissao: ['unidademedidacadastro'], breadcrumb: ['Unidade Medida'] },
  },
  {
    path: 'unidademedidacadastro/visualizar/:codigo/:funcionalidade',
    component: UnidamedidaCadastroComponent,
    data: { permissao: ['unidademedidacadastro'], breadcrumb: ['Unidade Medida'] },
  },
  {
    path: '',
    component: UnidamedidaListComponent,
    data: { permissao: ['listunidademedida'], breadcrumb: ['Unidade Medida'] },
  },
];
