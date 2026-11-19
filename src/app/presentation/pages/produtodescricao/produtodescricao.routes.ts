import { Routes } from '@angular/router';
import { ProdutodescricaoCadastroComponent } from 'src/app/presentation/pages/produtodescricao/produtodescricao-cadastro/produtodescricao-cadastro.component';
import { ProdutodescricaoListComponent } from 'src/app/presentation/pages/produtodescricao/produtodescricao-list/produtodescricao-list.component';

export const PRODUTODESCRICAO_ROUTES: Routes = [
  {
    path: 'produtodescricaocadastro',
    component: ProdutodescricaoCadastroComponent,
    data: { permissao: ['produtodescricaocadastro'], breadcrumb: ['Produto'] },
  },
  {
    path: 'produtodescricaocadastro/editar/:codigo/:funcionalidade',
    component: ProdutodescricaoCadastroComponent,
    data: { permissao: ['produtodescricaocadastro'], breadcrumb: ['Produto'] },
  },
  {
    path: 'produtodescricaocadastro/visualizar/:codigo/:funcionalidade',
    component: ProdutodescricaoCadastroComponent,
    data: { permissao: ['produtodescricaocadastro'], breadcrumb: ['Produto'] },
  },
  {
    path: '',
    component: ProdutodescricaoListComponent,
    data: { permissao: ['listprodutodescricao'], breadcrumb: ['Produto'] },
  },
];
