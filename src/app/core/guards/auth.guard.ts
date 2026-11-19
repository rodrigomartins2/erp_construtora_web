import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { SessionService } from 'src/app/core/auth/session.service';

/** Libera a rota apenas para usuário autenticado; caso contrário, vai para o login. */
export const authGuard: CanActivateFn = () => {
  const session = inject(SessionService);
  return session.isAutenticado() ? true : inject(Router).createUrlTree(['/login']);
};

/** @deprecated use `authGuard`. Mantido para rotas antigas. */
export const AuthGuard = authGuard;
