import { Routes } from '@angular/router';
import { PedidoCompraCadastroComponent } from 'src/app/presentation/pages/pedidocompra/pedido-compra-cadastro/pedido-compra-cadastro.component';
import { PedidoCompraListComponent } from 'src/app/presentation/pages/pedidocompra/pedido-compra-list/pedido-compra-list.component';

export const PEDIDOCOMPRA_ROUTES: Routes = [
  {
    path: 'pedidocadastro',
    component: PedidoCompraCadastroComponent,
    data: { permissao: ['pedidocadastro'], breadcrumb: ['Pedido Compra'] },
  },
  {
    path: 'pedidocadastro/editar/:codigo/:funcionalidade',
    component: PedidoCompraCadastroComponent,
    data: { permissao: ['pedidocadastro'], breadcrumb: ['Pedido Compra'] },
  },
  {
    path: 'pedidocadastro/visualizar/:codigo/:funcionalidade',
    component: PedidoCompraCadastroComponent,
    data: { permissao: ['pedidocadastro'], breadcrumb: ['Pedido Compra'] },
  },
  {
    path: '',
    component: PedidoCompraListComponent,
    data: { permissao: ['listpedido'], breadcrumb: ['Pedido Compra'] },
  },
];
