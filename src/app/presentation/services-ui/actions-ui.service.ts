import { inject, Injectable } from '@angular/core';

import { ToastMessageService } from './toast-message.service';
import { ConfirmDialogService } from './confirm-dialog.service';
import { ModalSize } from './dialog-modal.service';

@Injectable({
  providedIn: 'root',
})
export class ActionsUiService {
  private readonly confirmDialogService = inject(ConfirmDialogService);

  constructor(private messageService: ToastMessageService) {}

  public chooseAppArea(onSelect: (area: 'administrativo' | 'integrante') => void): void {
    onSelect('administrativo');

    // Modal de escolha desabilitado temporariamente para acesso direto à área administrativa.
    /* this.confirmDialogService.open({
      title: 'Escolha para onde deseja ir',
      content: 'Você pode acessar a área administrativa ou consultar seus dados pessoais e histórico do clube.',
      width: ModalSize.MM,
      hideCancelButton: true,
      buttons: [
        {
          label: 'Área administrativa',
          icon: 'pi pi-briefcase',
          severity: 'primary',
          action: () => onSelect('administrativo'),
        },
        {
          label: 'Meus dados e histórico',
          icon: 'pi pi-user',
          severity: 'secondary',
          outlined: true,
          action: () => onSelect('integrante'),
        },
      ],
    }); */
  }

  public confirmLogout(onConfirm: () => void): void {
    this.confirmDialogService.open({
      title: 'Sair da aplicação',
      content: 'Tem certeza que deseja encerrar sua sessão?',
      width: '20vm',
      buttons: [
        {
          label: 'Sim, sair',
          severity: 'danger',
          action: () => {
            onConfirm();
          },
        },
      ],
    });
  }

  public chooseTipoLancamento(onSelect: (operacao: 'E' | 'S') => void): void {
    this.confirmDialogService.open({
      title: 'Novo Lançamento',
      content: 'Qual o tipo de lançamento que deseja criar?',
      width: ModalSize.MM,
      buttons: [
        {
          label: 'Entrada de produto',
          icon: 'pi pi-arrow-down',
          severity: 'success',
          action: () => {
            onSelect('E');
          },
        },
        {
          label: 'Saída de produto',
          icon: 'pi pi-arrow-up',
          severity: 'info',
          action: () => {
            onSelect('S');
          },
        },
      ],
    });
  }

  public confirmDelete(itemName: string, onConfirm: () => void): void {
    this.confirmDialogService.open({
      title: 'Excluir registro',
      content: `Deseja realmente excluir o registro "${itemName}"? Esta ação não poderá ser desfeita.`,
      width: ModalSize.MM,
      buttons: [
        {
          label: 'Sim, excluir',
          severity: 'danger',
          action: () => {
            onConfirm();
          },
        },
      ],
    });
  }

  public confirmCreateUsuario(itemName: string, onConfirm: () => void): void {
    this.confirmDialogService.open({
      title: 'Cadastrar usuário',
      content: `Deseja cadastrar um usuário para "${itemName}"?`,
      width: ModalSize.MM,
      buttons: [
        {
          label: 'Sim, cadastrar',
          severity: 'success',
          action: onConfirm,
        },
      ],
    });
  }

  public confirmResetUsuarioSenha(itemName: string, onConfirm: () => void): void {
    this.confirmDialogService.open({
      title: 'Resetar senha do usuário',
      content: `Deseja redefinir a senha de "${itemName}" para a senha padrão? Será solicitada a troca no próximo acesso.`,
      width: ModalSize.MM,
      buttons: [
        {
          label: 'Sim, resetar senha',
          icon: 'pi pi-key',
          severity: 'warn',
          action: onConfirm,
        },
      ],
    });
  }

  public confirmDeactivate(itemName: string, onConfirm: () => void): void {
    this.confirmDialogService.open({
      title: 'Desativar registro',
      content: `Deseja realmente desativar o registro "${itemName}"?`,
      width: ModalSize.MM,
      buttons: [
        {
          label: 'Sim, desativar',
          severity: 'warn',
          action: () => {
            onConfirm();
          },
        },
      ],
    });
  }

  public confirmActivate(itemName: string, onConfirm: () => void): void {
    this.confirmDialogService.open({
      title: 'Ativar registro',
      content: `Deseja realmente ativar o registro "${itemName}"?`,
      width: ModalSize.MM,
      buttons: [
        {
          label: 'Sim, ativar',
          severity: 'success',
          action: () => {
            onConfirm();
          },
        },
      ],
    });
  }

  public confirmFinalizarLancamento(operacao: string, onConfirm: () => void): void {
    this.confirmDialogService.open({
      title: `Finalizar ${operacao}`,
      content:
        `Ao finalizar, o estoque das variações será atualizado e a previsão financeira será gerada. ` +
        `Esta ação não poderá ser desfeita. Deseja continuar?`,
      width: ModalSize.MM,
      buttons: [
        {
          label: 'Sim, finalizar',
          severity: 'success',
          action: () => {
            onConfirm();
          },
        },
      ],
    });
  }

  public confirmEstornarLancamento(operacao: string, onConfirm: () => void): void {
    this.confirmDialogService.open({
      title: `Estornar ${operacao}`,
      content:
        `O estoque das variações será devolvido, a previsão financeira em aberto será excluída ` +
        `e o lançamento voltará a ficar em aberto para edição. Deseja continuar?`,
      width: ModalSize.MM,
      buttons: [
        {
          label: 'Sim, estornar',
          severity: 'warn',
          action: () => {
            onConfirm();
          },
        },
      ],
    });
  }

  public confirmCancelarLancamento(operacao: string, onConfirm: () => void): void {
    this.confirmDialogService.open({
      title: `Cancelar ${operacao}`,
      content:
        `O estoque das variações será devolvido, a previsão financeira em aberto será excluída ` +
        `e o lançamento ficará cancelado. Esta ação não poderá ser desfeita. Deseja continuar?`,
      width: ModalSize.MM,
      buttons: [
        {
          label: 'Sim, cancelar',
          severity: 'danger',
          action: () => {
            onConfirm();
          },
        },
      ],
    });
  }

  public chooseTipoPrevisao(onSelect: (operacao: 'C' | 'D') => void): void {
    this.confirmDialogService.open({
      title: 'Nova previsão',
      content: 'Escolha o tipo de lançamento que deseja cadastrar.',
      width: ModalSize.MM,
      buttons: [
        {
          label: 'Conta a receber',
          icon: 'pi pi-arrow-down-left',
          severity: 'primary',
          action: () => onSelect('C'),
        },
        {
          label: 'Conta a pagar',
          icon: 'pi pi-arrow-up-right',
          severity: 'danger',
          outlined: true,
          action: () => onSelect('D'),
        },
      ],
    });
  }

  public confirmBaixarParcela(parcela: string, onConfirm: () => void): void {
    this.confirmDialogService.open({
      title: `Baixar parcela ${parcela}`,
      content:
        'A parcela será quitada pelo seu valor com pagamento na data de hoje. Deseja continuar?',
      width: ModalSize.MM,
      buttons: [{ label: 'Sim, baixar', severity: 'success', action: () => onConfirm() }],
    });
  }

  public confirmEstornarParcela(parcela: string, onConfirm: () => void): void {
    this.confirmDialogService.open({
      title: `Estornar parcela ${parcela}`,
      content: 'O pagamento será desfeito e a parcela voltará a ficar em aberto. Deseja continuar?',
      width: ModalSize.MM,
      buttons: [{ label: 'Sim, estornar', severity: 'warn', action: () => onConfirm() }],
    });
  }

  public copyContent(content: string) {
    navigator.clipboard.writeText(content);
    this.messageService.add({ severity: 'info', summary: 'Texto copiado!' });
  }

  public redirectToWhatsApp(value: string): void {
    const countryCode = '55';
    const formattedNumber = value.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${countryCode}${formattedNumber}`;
    window.open(whatsappUrl, '_blank');
  }
}
