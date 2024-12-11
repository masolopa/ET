import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageComponent } from 'src/app/components/language/language.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AnimationController, IonicModule } from '@ionic/angular';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { User } from 'src/app/model/user';
import { EducationalLevel } from 'src/app/model/educational-level';
import { showAlertDUOC, showToast } from 'src/app/tools/message-functions';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrarme',
  templateUrl: './registrarme.page.html',
  styleUrls: ['./registrarme.page.scss'],
  standalone: true,
  providers: [
    { provide: TranslateService },
    /* other services */
  ],
  imports: [
    CommonModule    // CGV-Permite usar directivas comunes de Angular
    , FormsModule     // CGV-Permite usar formularios
    , IonicModule     // CGV-Permite usar componentes de Ionic como IonContent, IonItem, etc.
    , TranslateModule
    , MatDatepickerModule


    , MatNativeDateModule,
    MatIconModule,
    MatFormFieldModule,
    HeaderComponent],
})
export class RegistrarmePage implements OnInit {
  @ViewChild("titulo", { read: ElementRef }) itemTitulo!: ElementRef;
  @ViewChild("page", { read: ElementRef }) page!: ElementRef;
  @ViewChild("itemCuenta", { read: ElementRef }) itemCuenta!: ElementRef;
  @ViewChild("itemNombre", { read: ElementRef }) itemNombre!: ElementRef;
  @ViewChild("itemApellido", { read: ElementRef }) itemApellido!: ElementRef;
  @ViewChild("itemEducacion", { read: ElementRef }) itemEducacion!: ElementRef;
  @ViewChild("itemCorreo", { read: ElementRef }) itemCorreo!: ElementRef; // Añadido
  @ViewChild("itemDireccion", { read: ElementRef }) itemDireccion!: ElementRef; // Añadido
  @ViewChild("itemPreguntaSecreta", { read: ElementRef })
  itemPreguntaSecreta!: ElementRef; // Añadido
  @ViewChild("itemRespuestaSecreta", { read: ElementRef })
  itemRespuestaSecreta!: ElementRef; // Añadido
  @ViewChild("itemContrasena", { read: ElementRef })
  itemContrasena!: ElementRef; // Añadido
  @ViewChild("itemRepetirContrasena", { read: ElementRef })
  itemRepetirContrasena!: ElementRef; // Añadido
  @ViewChild("ItemFechaNacimiento", { read: ElementRef })
  ItemFechaNacimiento!: ElementRef;
  @ViewChild('selectLanguage') selectLanguage!: LanguageComponent;

  public listaNivelesEducacionales = EducationalLevel.getLevels();
  public usuario: User = new User();
  public validarPass: string = '';
  constructor(private router: Router, private translate: TranslateService, private authService: AuthService, private db: DatabaseService, private animationController: AnimationController) { }
  ngOnInit() {
  }
  public animateItem1(elementRef: any, duration: number) {
    this.animationController
      .create()
      .addElement(elementRef)
      .iterations(1)
      .duration(duration)
      .fromTo("transform", "translate(100%)", "translate(0%)")
      .play();
  }
  validarCampos(nombreCampo: string, valor: any, tipo: string = 'texto') {
    if (tipo === 'texto' && valor.trim() === '') {
      showAlertDUOC(`Debe ingresar un valor para el campo "${nombreCampo}".`);
      return false;
    }

    // Validación de nivel educacional (que es un objeto)
    if (tipo === 'nivelEducacional' && (!valor || !valor.id)) {
      showAlertDUOC(`Debe seleccionar un nivel educacional en el campo "${nombreCampo}".`);
      return false;
    }

    // Validación de fecha (que es un objeto Date)
    if (tipo === 'fecha' && valor instanceof Date) {
      const selectedDate = valor.setHours(0, 0, 0, 0);
      const today = new Date().setHours(0, 0, 0, 0);
      if (selectedDate === today) {
        showAlertDUOC(`La fecha en el campo "${nombreCampo}" no puede ser la fecha actual.`);
        return false;
      }
    } else if (tipo === 'fecha' && !(valor instanceof Date)) {
      showAlertDUOC(`El valor en el campo "${nombreCampo}" debe ser una fecha válida.`);
      return false;
    }

    return true;
  }

  async actualizarDatos() {

    const existe = await this.db.validarUsuario(this.usuario.userName);
    if (!this.validarCampos('cuenta', this.usuario.userName)) return;
    if (existe) {
      showAlertDUOC(`El usuario con el nombre ${this.usuario.userName} ya existe.`);
      return; // Salir de la función si el usuario ya existe
    }
    if (!this.validarCampos('nombre', this.usuario.firstName)) return;
    if (!this.validarCampos('apellidos', this.usuario.lastName)) return;
    if (!this.validarCampos('correo', this.usuario.email)) return;
    if (!this.validarCampos('direccion', this.usuario.address)) return;
    if (!this.validarCampos('nivel educacional', this.usuario.educationalLevel, 'nivelEducacional')) return;
    if (!this.validarCampos('pregunta secreta', this.usuario.secretQuestion)) return;
    if (!this.validarCampos('respuesta secreta', this.usuario.secretAnswer)) return;
    if (!this.validarCampos('fecha de nacimiento', this.usuario.dateOfBirth, 'fecha')) return;
    if (!this.validarCampos('contraseña', this.usuario.password)) return;
    if (this.usuario.password !== this.validarPass) {
      showAlertDUOC('las contraseñas escritas deben ser iguales.');
      return;
    }

    await this.db.saveUser(this.usuario);
    showToast('Te has registrado correctamente, inicia sesion');
    this.router.navigate(['/ingreso'])

  }
  public limpiar1(): void {
    // Limpiar propiedades del usuario
    this.usuario.userName = "";
    this.usuario.firstName = "";
    this.usuario.lastName = "";
    this.usuario.educationalLevel = EducationalLevel.findLevel(1)!;
    this.usuario.dateOfBirth = new Date();
    this.usuario.email = ""; // Limpiar correo
    this.usuario.address = ""; // Limpiar correo
    this.usuario.secretQuestion = ""; // Limpiar pregunta secreta
    this.usuario.secretAnswer = ""; // Limpiar respuesta secreta
    this.usuario.password = ""; // Limpiar contraseña
    this.validarPass = ""; // Limpiar repetir contraseña

    // Animar limpieza de campos de entrada
    this.animateItem1(this.itemCuenta.nativeElement, 100);
    this.animateItem1(this.itemNombre.nativeElement, 200);
    this.animateItem1(this.itemApellido.nativeElement, 300);
    this.animateItem1(this.itemCorreo.nativeElement, 400); // Limpiar correo
    this.animateItem1(this.itemDireccion.nativeElement, 500); // Limpiar correo
    this.animateItem1(this.itemEducacion.nativeElement, 600); // Limpiar educación
    this.animateItem1(this.itemPreguntaSecreta.nativeElement, 700); // Limpiar pregunta secreta
    this.animateItem1(this.itemRespuestaSecreta.nativeElement, 800); // Limpiar respuesta secreta 
    this.animateItem1(this.itemContrasena.nativeElement, 1000); // Limpiar contraseña
    this.animateItem1(this.itemRepetirContrasena.nativeElement, 1100); // Limpiar repetir contraseña
  }
  ionViewWillEnter() {
    if (this.selectLanguage) {
      this.selectLanguage.setCurrentLanguage();
    } else {
      console.error('El servicio de selección de idioma no está disponible.');
    }
  }

}
