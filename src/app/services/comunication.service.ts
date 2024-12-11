import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ComunicationService {
  private componenteSeleccionado = new BehaviorSubject<string>('qr');
  componenteSeleccionado$ = this.componenteSeleccionado.asObservable();

  seleccionarComponente(componente: string) {
    this.componenteSeleccionado.next(componente);
  }
}
