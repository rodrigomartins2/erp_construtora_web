import { Injectable } from '@angular/core';
import { MessageService, type ToastMessageOptions } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastMessageService {
  constructor(private messageService: MessageService) {}

  // Exibe apenas um toast por vez: o novo substitui o que estiver na tela.
  add(message: ToastMessageOptions) {
    this.messageService.clear(message.key);
    this.messageService.add({
      ...message,
      life: message.life ?? 10000,
    });
  }

  clear(key?: string) {
    this.messageService.clear(key);
  }
}
