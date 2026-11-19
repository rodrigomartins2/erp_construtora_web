import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-filtro',
  standalone: true,
  imports: [],
  templateUrl: './modal-filtro.component.html',
  styleUrl: './modal-filtro.component.css'
})
export class ModalFiltroComponent {
 // Controla se o modal está aberto
 @Input() isOpen = false;

 // Emite um evento ao fechar o modal
 @Output() closeModalEvent = new EventEmitter<void>();

 // Fecha o modal
 closeModal(): void {
   this.isOpen = false;
   this.closeModalEvent.emit();
 }

 // Impede que cliques dentro do modal fechem o componente (evita propagação)
 preventModalClose(event: MouseEvent): void {
   event.stopPropagation();
 }

}
