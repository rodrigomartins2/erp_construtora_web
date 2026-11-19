import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { Panel, PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-sections',
  standalone: true,
  imports: [PanelModule, BreadcrumbModule, CommonModule, ButtonModule],
  templateUrl: './sections.component.html',
  styleUrl: './sections.component.scss',
})
export class SectionsComponent implements AfterViewInit {
  @Input() titleSection: string = '';
  @Input() rounded: boolean = false;
  @Input() usePanel: boolean = true;
  @Input() markerColor: string = '#087CF5';
  @Input() icon: string = '';
  @Input() iconBgColor: string = '';
  @Input() iconColor: string = '';
  @Input() endText: string = '';

  @ViewChild('panel') panel!: Panel;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngAfterViewInit() {
    if (this.usePanel && this.panel) {
      const header = this.el.nativeElement.querySelector('.p-panel-header');
      if (header) {
        this.renderer.listen(header, 'click', (event) => {
          if (!event.target.closest('.p-panel-header-icon')) {
            this.panel.toggle(event);
          }
        });
      }
    }
  }
}
