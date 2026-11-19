import { Routes } from '@angular/router';
import { EntradasaidaListComponent } from 'src/app/presentation/pages/entradasaida/entradasaida-list/entradasaida-list.component';
import { EntradaEstoqueComponent } from 'src/app/presentation/pages/entradasaida/entrada-estoque/entrada-estoque.component';
import { SaidaEstoqueComponent } from 'src/app/presentation/pages/entradasaida/saida-estoque/saida-estoque.component';
import { PosicaoEstoqueComponent } from 'src/app/presentation/pages/entradasaida/relatorio/posicao-estoque/posicao-estoque.component';
import { MovimentarEstoqueComponent } from 'src/app/presentation/pages/entradasaida/movimentar-estoque/movimentar-estoque.component';

export const ENTRADASAIDA_ROUTES: Routes = [
  {
    path: 'entradaestoque',
    component: EntradaEstoqueComponent,
    data: { permissao: ['entradaestoque'], breadcrumb: ['Lançar Entrada de Materiais do Estoque'] },
  },
  {
    path: 'entradaestoque/editar/:codigo/:funcionalidade',
    component: EntradaEstoqueComponent,
    data: { permissao: ['entradaestoque'], breadcrumb: ['Lançar Entrada de Materiais do Estoque'] },
  },
  {
    path: 'entradaestoque/visualizar/:codigo/:funcionalidade',
    component: EntradaEstoqueComponent,
    data: { permissao: ['entradaestoque'], breadcrumb: ['Lançar Entrada de Materiais do Estoque'] },
  },
  {
    path: 'saidaestoque',
    component: SaidaEstoqueComponent,
    data: { permissao: ['saidaestoque'], breadcrumb: ['Lançar Saída de Materiais do Estoque'] },
  },
  {
    path: 'saidaestoque/editar/:codigo/:funcionalidade',
    component: SaidaEstoqueComponent,
    data: { permissao: ['saidaestoque'], breadcrumb: ['Lançar Saída de Materiais do Estoque'] },
  },
  {
    path: 'saidaestoque/visualizar/:codigo/:funcionalidade',
    component: SaidaEstoqueComponent,
    data: { permissao: ['saidaestoque'], breadcrumb: ['Lançar Saída de Materiais do Estoque'] },
  },
  {
    path: 'posicaoestoque',
    component: PosicaoEstoqueComponent,
    data: { permissao: ['posicaoestoque'], breadcrumb: ['Relatório Posição do Estoque'] },
  },
  {
    path: 'movimentarestoque',
    component: MovimentarEstoqueComponent,
    data: { permissao: ['movimentarestoque'], breadcrumb: ['Movimentação entre Estoque'] },
  },
  {
    path: '',
    component: EntradasaidaListComponent,
    data: { permissao: ['listentradasaida'], breadcrumb: ['Consultar Entrada/Saída do Estoque'] },
  },
 
];
