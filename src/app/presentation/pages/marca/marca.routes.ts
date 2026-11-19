import { Routes } from '@angular/router';
import { MarcaCadastroComponent } from 'src/app/presentation/pages/marca/marca-cadastro/marca-cadastro.component';
import { MarcaListComponent } from 'src/app/presentation/pages/marca/marca-list/marca-list.component';

export const MARCA_ROUTES: Routes = [
  {
    path: 'marcacadastro',
    component: MarcaCadastroComponent,
    data: { permissao: ['marcacadastro'], breadcrumb: ['Marca'] },
  },
  {
    path: 'marcacadastro/editar/:codigo/:funcionalidade',
    component: MarcaCadastroComponent,
    data: { permissao: ['marcacadastro'], breadcrumb: ['Marca'] },
  },
  {
    path: 'marcacadastro/visualizar/:codigo/:funcionalidade',
    component: MarcaCadastroComponent,
    data: { permissao: ['marcacadastro'], breadcrumb: ['Marca'] },
  },
  {
    path: '',
    component: MarcaListComponent,
    data: { permissao: ['listmarca'], breadcrumb: ['Marca'] },
  },
];
