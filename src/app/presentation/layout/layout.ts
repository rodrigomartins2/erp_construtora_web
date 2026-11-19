import { Component, inject } from '@angular/core';

import { SessionFacade } from 'src/app/application/facade/session.facade';
import { AdminLayout } from 'src/app/presentation/layout/admin-layout/admin-layout';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [AdminLayout],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {
  readonly sessionFacade = inject(SessionFacade);
}
