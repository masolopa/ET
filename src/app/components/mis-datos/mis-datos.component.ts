import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, AnimationController, IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { AuthService } from 'src/app/services/auth.service';
import { LanguageComponent } from '../language/language.component';
import { MY_DATE_FORMATS } from 'src/app/services/mat_date_format';
import { showAlertDUOC, showToast } from 'src/app/tools/message-functions';
import { User } from 'src/app/model/user';
import { EducationalLevel } from 'src/app/model/educational-level';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.component.html',
  styleUrls: ['./mis-datos.component.scss'],
  standalone: true,
  imports: [
    CommonModule    // CGV-Permite usar directivas comunes de Angular
    , FormsModule     // CGV-Permite usar formularios
    , IonicModule     // CGV-Permite usar componentes de Ionic como IonContent, IonItem, etc.
    , TranslateModule
    , MatDatepickerModule

    , MatNativeDateModule],
  
})

export class MisDatosComponent implements OnInit, AfterViewInit {

  @ViewChild('selectLanguage') selectLanguage!: LanguageComponent;
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

  public usuario: User = new User();
  public validarPass: string = "";
  public listaNivelesEducacionales = EducationalLevel.getLevels();
  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private db: DatabaseService,
    private router: Router,
    private translate: TranslateService,
    private animationController: AnimationController
  ) {

  }


  ionViewWillEnter() {
    if (this.selectLanguage) {
      this.selectLanguage.setCurrentLanguage();
    } else {
      console.error('El servicio de selección de idioma no está disponible.');
    }
  }
  ngOnInit(): void {

    this.authService.usuarioAutenticado.subscribe(usuario => {
      this.usuario = usuario ? usuario : new User();


    });
    this.validarPass = this.usuario.password;

  }

  public ngAfterViewInit(): void {
    if (this.itemTitulo) {
      const animation = this.animationController
        .create()
        .addElement(this.itemTitulo.nativeElement)
        .iterations(Infinity)
        .duration(4000)
        .fromTo("transform", "translate(-50%)", "translate(100%)")
        .fromTo("opacity", 0, 0.8);
      animation.play();
    }
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

  validarCampos(nombreCampo: string, valor: string) {
    if (valor.trim() === '') {
      showAlertDUOC(`Debe ingresar un valor para el campo "${nombreCampo}".`);
      return false;
    }
    return true;
  }
  async actualizarDatos() {
    if (!this.validarCampos('cuenta', this.usuario.userName)) return;
    if (!this.validarCampos('nombre', this.usuario.firstName)) return;
    if (!this.validarCampos('apellidos', this.usuario.lastName)) return;
    if (!this.validarCampos('correo', this.usuario.email)) return;
    if (!this.validarCampos('direccion', this.usuario.address)) return;
    if (!this.validarCampos('pregunta secreta', this.usuario.secretQuestion)) return;
    if (!this.validarCampos('respuesta secreta', this.usuario.secretAnswer)) return;
    if (!this.validarCampos('contraseña', this.usuario.password)) return;
    if (this.usuario.password !== this.validarPass) {
      showAlertDUOC('las contraseñas escritas deben ser iguales.');
      return;
    }
    await this.db.saveUser(this.usuario);
    this.authService.guardarUsuarioAutenticado(this.usuario);
    showToast('Sus datos fueron actualizados');
  }


  public limpiar2(): void { }

  public animateItem1(elementRef: any, duration: number) {
    this.animationController
      .create()
      .addElement(elementRef)
      .iterations(1)
      .duration(duration)
      .fromTo("transform", "translate(100%)", "translate(0%)")
      .play();
  }

  public animateItem2(elementRef: any, duration: number) { }

  createPageTurnAnimation() { }

  public mostrarDatosPersona(): void {
    // Si el usuario no ingresa la cuenta, se mostrará un error
    if (this.usuario.userName.trim() === "") {
      this.presentAlert(
        "Datos personales",
        "Para mostrar los datos de la persona, " + "debe ingresar su cuenta."
      );
      return;
    }

    // Si el usuario no ingresa al menos el nombre o el apellido, se mostrará un error
    if (this.usuario.firstName.trim() === "" && this.usuario.lastName === "") {
      this.presentAlert(
        "Datos personales",
        "Para mostrar los datos de la persona, " +
        "al menos debe tener un valor para el nombre o el apellido."
      );
      return;
    }

    // Mostrar un mensaje emergente con los datos de la persona
    let mensaje = `
      <small>
        <br>Cuenta: ${this.usuario.userName}
        <br>Usuario: ${this.usuario.email}
        <br>Nombre: ${this.usuario.firstName}
        <br>Apellido: ${this.usuario.lastName}
        <br>Educación: ${this.usuario.educationalLevel.getEducation()}
        <br>Nacimiento: ${this.usuario.dateOfBirth}
      </small>
    `;
    this.presentAlert("Datos personales", mensaje);
  }

  public async presentAlert(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ["OK"],
    });

    await alert.present();
  }


}
