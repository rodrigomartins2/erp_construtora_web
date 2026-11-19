import { Routes } from '@angular/router';
import { PessoaCadastroComponent } from 'src/app/presentation/pages/pessoa/pessoa-cadastro/pessoa-cadastro.component';
import { PessoaListComponent } from 'src/app/presentation/pages/pessoa/pessoa-list/pessoa-list.component';

export const PESSOA_ROUTES: Routes = [
  {
    path: 'pessoacadastro',
    component: PessoaCadastroComponent,
    data: { permissao: ['pessoacadastro'], breadcrumb: ['Pessoa'] },
  },
  {
    path: 'pessoacadastro/editar/:codigo/:funcionalidade',
    component: PessoaCadastroComponent,
    data: { permissao: ['pessoacadastro'], breadcrumb: ['Pessoa'] },
  },
  {
    path: 'pessoacadastro/visualizar/:codigo/:funcionalidade',
    component: PessoaCadastroComponent,
    data: { permissao: ['pessoacadastro'], breadcrumb: ['Pessoa'] },
  },
  {
    path: '',
    component: PessoaListComponent,
    data: { permissao: ['listpessoa'], breadcrumb: ['Consultar Pessoa'] },
  },
];
