import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Asistencia } from 'src/app/model/asistencia';
import { LanguageComponent } from '../language/language.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-mi-clase',
  templateUrl: './mi-clase.component.html',
  styleUrls: ['./mi-clase.component.scss'],
  standalone: true,

  imports: [

    CommonModule    // CGV-Permite usar directivas comunes de Angular
    , FormsModule     // CGV-Permite usar formularios
    , IonicModule
    , LanguageComponent   // CGV-Permite usar componentes de Ionic como IonContent, IonItem, etc.
    , TranslateModule // CGV-Permite usar pipe 'translate'
  ]
})
export class MiClaseComponent implements OnInit {

  @ViewChild('selectLanguage') selectLanguage!: LanguageComponent;
  asistencia = new Asistencia();
  constructor(private bd: DatabaseService, translate: TranslateService) {

  }

  ionViewWillEnter() {
    this.selectLanguage.setCurrentLanguage();

  }
  ngOnInit() {

    this.bd.datosQR.subscribe((datosQR) => {
      console.log('Datos del QR:', datosQR);  // Asegúrate de que los datos del QR sean correctos
      this.asistencia = new Asistencia().obtenerAsistenciaDesdeQR(datosQR);
      console.log('Asistencia obtenida:', this.asistencia);  // Verifica si la asistencia se asigna correctamente
    });
  }



}
