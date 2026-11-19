import { CommonModule } from '@angular/common';
import { Component, ContentChild, Input, TemplateRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-header-notification-menu',
  standalone: true,
  imports: [CommonModule, MenuModule],
  templateUrl: './header-notification-menu.html',
  styleUrl: './header-notification-menu.css',
})
export class HeaderNotificationMenu {
  @ViewChild('notificationMenu') private notificationMenu?: Menu;
  @ContentChild(TemplateRef) itemTemplate?: TemplateRef<{ $implicit: MenuItem; item: MenuItem }>;

  @Input() items: MenuItem[] = [];
  @Input() badgeCount = 0;
  @Input() ariaLabel = 'Notificacoes';
  @Input() icon = 'pi pi-bell';
  @Input() buttonClass =
    'relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-0 bg-transparent text-slate-500 transition hover:bg-slate-500/10 hover:text-slate-700';
  @Input() menuStyleClass = '';
  @Input() clickAction: (() => void) | null = null;
  @Input() badgeText = '';

  get hasBadge(): boolean {
    return this.badgeCount > 0;
  }

  get badgeLabel(): string {
    return this.badgeCount > 99 ? '99+' : String(this.badgeCount);
  }

  toggle(event: MouseEvent): void {
    event.stopPropagation();

    if (this.clickAction) {
      this.clickAction();
      return;
    }

    this.notificationMenu?.toggle(event);
  }
}
