import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { ForoComponent } from 'src/app/components/foro/foro.component';
import { CodigoQrComponent } from 'src/app/components/codigo-qr/codigo-qr.component';
import { ComunicationService } from 'src/app/services/comunication.service';
import { MiClaseComponent } from 'src/app/components/mi-clase/mi-clase.component';
import { MisDatosComponent } from 'src/app/components/mis-datos/mis-datos.component';
import { UsuariosComponent } from 'src/app/components/usuarios/usuarios.component';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  providers: [
    { provide: TranslateService },
    /* other services */
  ],
  imports: [
    CommonModule, // CGV-Permite usar directivas comunes de Angular
    FormsModule, // CGV-Permite usar formularios
    IonicModule, // CGV-Permite usar componentes de Ionic como IonContent, IonItem, etc.
    TranslateModule, // CGV-Permite usar pipe 'translate'
    HeaderComponent, // CGV-Permite usar el componente Header
    FooterComponent,
    CodigoQrComponent,
    ForoComponent,
    MiClaseComponent,
    MisDatosComponent,
    UsuariosComponent
  ],
})
export class InicioPage implements OnInit {

  @ViewChild(HeaderComponent) headerComponent!: HeaderComponent;

  currentComponent: string = 'qr';

  constructor(private comunicacionService: ComunicationService) { }
  ngOnInit(): void {

    this.currentComponent = 'qr';
  }
  IonViewWillEnter(){
    
    this.currentComponent = 'qr';
  }
  actualizarHeader(component: string) {
    this.currentComponent = component; // Cambia el componente actual en la vista
    this.headerComponent.setSegmentValue(component); // Actualiza el segmento en HeaderComponent
  }
  mostrarComponente(componente: string) {
    this.currentComponent = componente; // Convertimos el valor a string con un valor por defecto
  }
}
