import { Routes } from '@angular/router';
import { EstoqueCadastroComponent } from 'src/app/presentation/pages/estoque/estoque-cadastro/estoque-cadastro.component';
import { EstoqueListComponent } from 'src/app/presentation/pages/estoque/estoque-list/estoque-list.component';

export const ESTOQUE_ROUTES: Routes = [
  {
    path: 'estoquecadastro',
    component: EstoqueCadastroComponent,
    data: { permissao: ['estoquecadastro'], breadcrumb: ['Cadastrar Estoque'] },
  },
  {
    path: 'estoquecadastro/editar/:codigo/:funcionalidade',
    component: EstoqueCadastroComponent,
    data: { permissao: ['estoquecadastro'], breadcrumb: ['Alterar Estoque'] },
  },
  {
    path: 'estoquecadastro/visualizar/:codigo/:funcionalidade',
    component: EstoqueCadastroComponent,
    data: { permissao: ['estoquecadastro'], breadcrumb: ['Visualizar Estoque'] },
  },
  {
    path: '',
    component: EstoqueListComponent,
    data: { permissao: ['listestoque'], breadcrumb: ['Consultar Estoque'] },
  },
];
