import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
  standalone: true,

  imports: [
    CommonModule    // CGV-Permite usar directivas comunes de Angular
    , FormsModule     // CGV-Permite usar formularios
    , IonicModule     // CGV-Permite usar componentes de Ionic como IonContent, IonItem, etc.
    , TranslateModule // CGV-Permite usar pipe 'translate'
  ]
})
export class LanguageComponent implements OnInit {

  @Output() changeCurrentLanguage = new EventEmitter();

  languageSelected = "es";

  constructor(private translate: TranslateService) {
    this.translate.use('es');
  }

  ngOnInit() {
    // Recupera el idioma preferido de localStorage
    const storedLanguage = localStorage.getItem('preferredLanguage');

    if (storedLanguage) {
      // Si hay un idioma guardado, úsalo
      this.languageSelected = storedLanguage;
      this.changeCurrentLanguage.emit(storedLanguage);
    } else {
      // Si no hay idioma guardado, usa un idioma por defecto (por ejemplo, inglés)
      this.languageSelected = 'es';  // Idioma por defecto
      this.changeCurrentLanguage.emit(this.languageSelected);
    }
  }

  setCurrentLanguage() {
    this.languageSelected = this.translate.currentLang;
  }

  changeLanguage(value: string) {
    this.translate.use(value);
    this.changeCurrentLanguage.emit(value);
  }

}
