import { Routes } from "@angular/router";
import { ContratoCadastroComponent } from "src/app/presentation/pages/contrato/contrato-cadastro/contrato-cadastro.component";
import { ContratoListComponent } from "src/app/presentation/pages/contrato/contrato-list/contrato-list.component";
import { ContratoDocumentosComponent } from "src/app/presentation/pages/contrato/contrato-documentos/contrato-documentos.component";
import { ObraListComponent } from "src/app/presentation/pages/contrato/obra-list/obra-list.component";
import { ContratoSituacaoDocComponent } from "src/app/presentation/pages/contrato/relatorios/contrato-situacao-doc/contrato-situacao-doc.component";
import { ContratoVencimentosComponent } from "src/app/presentation/pages/contrato/relatorios/contrato-vencimentos/contrato-vencimentos.component";

export const CONTRATO_ROUTES: Routes = [
    { path: 'contratocadastro', component: ContratoCadastroComponent, 
      data: { permissao: ['contratocadastro'], breadcrumb: ['Novo Contrato'] }
    },
    {
      path: 'contratocadastro/editar/:codigo/:funcionalidade', component: ContratoCadastroComponent,
      data: { permissao: ['contratocadastro'], breadcrumb: ['Alterar Contrato'] }
    },
    {
      path: 'contratocadastro/visualizar/:codigo/:funcionalidade', component: ContratoCadastroComponent,
      data: { permissao: ['contratocadastro'], breadcrumb: ['Visualizar Contrato'] }
    },
    {
      path: 'contratodocumentos/:codigo', component: ContratoDocumentosComponent,
      data: { permissao: ['contratodocumentos'], breadcrumb: [] }
    },     
    {
      path: 'obraslist/:codigo', component: ObraListComponent,
      data: { permissao: ['obraslist  '], breadcrumb: [] }
    },      
    { path: '', component: ContratoListComponent, 
      data: { permissao: ['listcontrato'], breadcrumb: ['Consultar Contratos'] }
    },
    {
      path: 'contratosituacao',
      component: ContratoSituacaoDocComponent,
      data: { permissao: ['contratosituacao'], breadcrumb: ['Relatório Situação Documentos Contratos'] },
    },
    {
      path: 'contratovencimento',
      component: ContratoVencimentosComponent,
      data: { permissao: ['contratovencimento'], breadcrumb: ['Relatório Vencimentos Contratos'] },
    }
  ];