import { Routes } from '@angular/router';
import { CategoriaCadastroComponent } from 'src/app/presentation/pages/categoria/categoria-cadastro/categoria-cadastro.component';
import { CategoriaListComponent } from 'src/app/presentation/pages/categoria/categoria-list/categoria-list.component';

export const CATEGORIA_ROUTES: Routes = [
  {
    path: 'categoriacadastro',
    component: CategoriaCadastroComponent,
    data: { permissao: ['categoriacadastro'], breadcrumb: ['Categoria'] },
  },
  {
    path: 'categoriacadastro/editar/:codigo/:funcionalidade',
    component: CategoriaCadastroComponent,
    data: { permissao: ['categoriacadastro'], breadcrumb: ['Categoria'] },
  },
  {
    path: 'categoriacadastro/visualizar/:codigo/:funcionalidade',
    component: CategoriaCadastroComponent,
    data: { permissao: ['categoriacadastro'], breadcrumb: ['Categoria'] },
  },
  {
    path: '',
    component: CategoriaListComponent,
    data: { permissao: ['listcategoria'], breadcrumb: ['Categoria'] },
  },
];