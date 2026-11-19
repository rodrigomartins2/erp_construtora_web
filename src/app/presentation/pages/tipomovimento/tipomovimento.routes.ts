import { Routes } from '@angular/router';
import { TipomovimentoCadastroComponent } from 'src/app/presentation/pages/tipomovimento/tipomovimento-cadastro/tipomovimento-cadastro.component';
import { TipomovimentoListComponent } from 'src/app/presentation/pages/tipomovimento/tipomovimento-list/tipomovimento-list.component';

export const TIPOMOVIMENTO_ROUTES: Routes = [
  {
    path: 'tipomovimentocadastro',
    component: TipomovimentoCadastroComponent,
    data: { permissao: ['tipomovimentocadastro'], breadcrumb: ['Tipo Movimento'] },
  },
  {
    path: 'tipomovimentocadastro/editar/:codigo/:funcionalidade',
    component: TipomovimentoCadastroComponent,
    data: { permissao: ['tipomovimentocadastro'], breadcrumb: ['Tipo Movimento'] },
  },
  {
    path: 'tipomovimentocadastro/visualizar/:codigo/:funcionalidade',
    component: TipomovimentoCadastroComponent,
    data: { permissao: ['tipomovimentocadastro'], breadcrumb: ['Tipo Movimento'] },
  },
  {
    path: '',
    component: TipomovimentoListComponent,
    data: { permissao: ['listtipomovimento'], breadcrumb: ['Tipo Movimento'] },
  },
];
