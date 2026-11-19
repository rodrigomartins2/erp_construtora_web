import { Routes } from '@angular/router';
import { PagesComponent } from 'src/app/presentation/pages/pages.component';
import { DashboardComponent } from 'src/app/presentation/pages/dashboard/dashboard.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

export const PAGES_ROUTES: Routes = [
    {
      path: '',
      component: PagesComponent,
      canActivate: [AuthGuard],
      children: [ 
        { 
          path: '',  loadChildren: () => import('src/app/presentation/pages/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES), 
          data: {breadcrumb: 'Início'}, component: DashboardComponent    
        },                    
        { 
          path: 'listentradasaida', loadChildren: () => import('src/app/presentation/pages/entradasaida/entradasaida.routes').then(m => m.ENTRADASAIDA_ROUTES), 
          data: { permissao: ['listentradasaida'], breadcrumb: ['Consultar Entrada/Saída do Estoque'] } 
        },
        { 
          path: 'listcontrato', loadChildren: () => import('src/app/presentation/pages/contrato/contrato.routes').then(m => m.CONTRATO_ROUTES),
          data: { permissao: ['listcontrato'], breadcrumb: ['Consultar Contrato'] } 
        },
        { 
          path: 'listunidademedida', loadChildren: () => import('src/app/presentation/pages/unidademedida/unidademedida.routes').then(m => m.UNIDADEMEDIDA_ROUTES), 
          data: { permissao: ['listunidademedida'], breadcrumb: ['Unidade Medida'] } 
        },
        { 
          path: 'listmarca', loadChildren: () => import('src/app/presentation/pages/marca/marca.routes').then(m => m.MARCA_ROUTES),           
          data: { permissao: ['listmarca'], breadcrumb: ['Marca'] } 
        },
        { 
          path: 'listcategoria', loadChildren: () => import('src/app/presentation/pages/categoria/categoria.routes').then(m => m.CATEGORIA_ROUTES), 
          data: { permissao: ['listcategoria'], breadcrumb: ['Categoria'] } 
        },
        { 
          path: 'listtipomovimento', loadChildren: () => import('src/app/presentation/pages/tipomovimento/tipomovimento.routes').then(m => m.TIPOMOVIMENTO_ROUTES), 
          data: { permissao: ['listtipomovimento'], breadcrumb: ['Tipo Movimento'] } 
        },
        { 
          path: 'listproduto', loadChildren: () => import('src/app/presentation/pages/produto/produto.routes').then(m => m.PRODUTO_ROUTES), 
          data: { permissao: ['listproduto'], breadcrumb: ['Produto'] } 
        },
        { 
          path: 'listprodutodescricao', loadChildren: () => import('src/app/presentation/pages/produtodescricao/produtodescricao.routes').then(m => m.PRODUTODESCRICAO_ROUTES), 
          data: { permissao: ['listprodutodescricao'], breadcrumb: ['Produto'] } 
        },
        { 
          path: 'listpessoa', loadChildren: () => import('src/app/presentation/pages/pessoa/pessoa.routes').then(m => m.PESSOA_ROUTES), 
          data: { permissao: ['listpessoa'], breadcrumb: ['Pessoa'] } 
        },
        { 
          path: 'listpedido', loadChildren: () => import('src/app/presentation/pages/pedidocompra/pedidocompra.routes').then(m => m.PEDIDOCOMPRA_ROUTES), 
          data: { permissao: ['listpedido'], breadcrumb: ['Pedido Compra'] } 
        },
        { 
          path: 'listusuario', loadChildren: () => import('src/app/presentation/pages/usuario/usuario.routes').then(m => m.USUARIO_ROUTES), 
          data: { permissao: ['listpedido'], breadcrumb: ['Usuário'] } 
        },
        { 
          path: 'listestoque', loadChildren: () => import('src/app/presentation/pages/estoque/estoque.routes').then(m => m.ESTOQUE_ROUTES), 
          data: { permissao: ['listestoque'], breadcrumb: ['Estoque'] } 
        },
        { path: '#', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
      ],
    },
  ];