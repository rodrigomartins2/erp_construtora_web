import { Routes } from "@angular/router";
import { LoginComponent } from "src/app/presentation/pages/login-page/login.component";

export const AUTH_ROUTES: Routes = [
  { path: '', component: LoginComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];