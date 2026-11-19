import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from 'src/app/presentation/components/loader/loader.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    imports: [RouterOutlet, LoaderComponent]
})
export class AppComponent {
  title = 'Sistema de Gestão Administrativa';
}
