import { Routes } from '@angular/router';
import { ProdutoCadastroComponent } from 'src/app/presentation/pages/produto/produto-cadastro/produto-cadastro.component';
import { ProdutoListComponent } from 'src/app/presentation/pages/produto/produto-list/produto-list.component';

export const PRODUTO_ROUTES: Routes = [
  {
    path: 'produtocadastro',
    component: ProdutoCadastroComponent,
    data: { permissao: ['produtocadastro'], breadcrumb: ['Produto'] },
  },
  {
    path: 'produtocadastro/editar/:codigo/:funcionalidade',
    component: ProdutoCadastroComponent,
    data: { permissao: ['produtocadastro'], breadcrumb: ['Produto'] },
  },
  {
    path: 'produtocadastro/visualizar/:codigo/:funcionalidade',
    component: ProdutoCadastroComponent,
    data: { permissao: ['produtocadastro'], breadcrumb: ['Produto'] },
  },
  {
    path: '',
    component: ProdutoListComponent,
    data: { permissao: ['listproduto'], breadcrumb: ['Produto'] },
  },
];
