import { Routes } from "@angular/router";
import { DashboardComponent } from "src/app/presentation/pages/dashboard/dashboard.component";

export const DASHBOARD_ROUTES: Routes = [    
    {
      path: 'dashboard', component: DashboardComponent,
      data: { breadcrumb: ['Início'] }
    },      
    { path: '', component: DashboardComponent, 
        data: { breadcrumb: ['Início'] }
    }
  ];