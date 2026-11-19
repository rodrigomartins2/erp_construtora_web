import { Injectable, computed, inject } from '@angular/core';

import { SessionFacade } from 'src/app/application/facade/session.facade';

export interface EmpresaMarca {
  imagem: string;
  nome: string;
}

/** Logo e nome exibidos no layout conforme a empresa do grupo escolhida no login. */
@Injectable({ providedIn: 'root' })
export class EmpresaLogoService {
  private readonly sessionFacade = inject(SessionFacade);

  readonly marca = computed<EmpresaMarca>(() => {
    // Reavalia quando a sessão muda (login/logout).
    this.sessionFacade.usuario();

    switch (String(this.sessionFacade.empresa())) {
      case '5':
        return { imagem: 'assets/img/laser.png', nome: 'Laser Iluminação' };
      case '10':
        return { imagem: 'assets/img/enceel.png', nome: 'Enceel Iluminação' };
      case '4':
      case '11':
      default:
        return { imagem: 'assets/img/logoConstrutora.jpg', nome: 'Construtora B&C' };
    }
  });
}
