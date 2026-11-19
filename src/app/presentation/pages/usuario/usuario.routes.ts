import { Routes } from '@angular/router';
import { UsuarioCadastroComponent } from 'src/app/presentation/pages/usuario/usuario-cadastro/usuario-cadastro.component';
import { UsuarioListComponent } from 'src/app/presentation/pages/usuario/usuario-list/usuario-list.component';

export const USUARIO_ROUTES: Routes = [
  {
    path: 'usuariocadastro',
    component: UsuarioCadastroComponent,
    data: { permissao: ['usuariocadastro'], breadcrumb: ['Usuário'] },
  },
  {
    path: 'usuariocadastro/editar/:codigo/:funcionalidade',
    component: UsuarioCadastroComponent,
    data: { permissao: ['usuariocadastro'], breadcrumb: ['Usuário'] },
  },
  {
    path: 'usuariocadastro/visualizar/:codigo/:funcionalidade',
    component: UsuarioCadastroComponent,
    data: { permissao: ['usuariocadastro'], breadcrumb: ['Usuário'] },
  },
  {
    path: '',
    component: UsuarioListComponent,
    data: { permissao: ['listusuario'], breadcrumb: ['Usuário'] },
  },
];
