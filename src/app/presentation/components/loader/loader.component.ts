import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css'],
  standalone: true,
  imports: [AsyncPipe, ProgressSpinnerModule]
})
export class LoaderComponent {
  constructor(public spinnerService: LoaderService) {}
}
