import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ModalRef } from 'src/app/presentation/services-ui/modal.service';

const ESTILOS: Record<string, { icone: string; cor: string }> = {
  sucess: { icone: 'far fa-check-circle', cor: 'text-green-500' },
  danger: { icone: 'far fa-times-circle', cor: 'text-red-500' },
  warning: { icone: 'fas fa-exclamation-circle', cor: 'text-amber-500' },
  info: { icone: 'fas fa-info-circle', cor: 'text-sky-500' }
};

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.css'],
  standalone: true,
  imports: [ButtonModule]
})
export class AlertModalComponent {
  @Input() titulo!: string;
  @Input() type!: string;
  @Input() icon!: string;
  @Input() mensagem!: string;
  @Input() url!: string;
  @Input() codigo!: string;

  constructor(private router: Router, public bsModalRef: ModalRef) {}

  get estilo() {
    return ESTILOS[this.icon] ?? ESTILOS['info'];
  }

  onClose() {
    this.bsModalRef.hide();
    if (this.codigo == '0' && this.url != '')
      this.router.navigate([`${this.url}`]);
    else if (this.codigo != '0' && this.url != '')
      this.router.navigate([`${this.url}`, this.codigo]);
  }
}
