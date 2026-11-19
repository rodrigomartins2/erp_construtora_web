import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  show(): void {
    this.loadingSubject.next(true);
  }
  
  hide(): void {
    setTimeout(() => {
      this.loadingSubject.next(false);
    }, 300); // 2000 milissegundos = 2 segundos
  }
}
