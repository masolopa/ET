import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { InitializeAppService } from './services/initialize.app.service';
import { registerLocaleData } from '@angular/common';
import localeEsCL from '@angular/common/locales/es-CL';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
  }
}
