import { CommonModule } from '@angular/common';

import { Component, ElementRef, OnInit, viewChild, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { pencilOutline, trashOutline } from 'ionicons/icons';
import { Publicacion } from 'src/app/model/publicacion';
import { APIClientService } from 'src/app/services/apiclient.service';
import { AuthService } from 'src/app/services/auth.service';
import { showAlertDUOC, showToast } from 'src/app/tools/message-functions';
import { HeaderComponent } from '../header/header.component';
import { LanguageComponent } from '../language/language.component';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-foro',
  templateUrl: './foro.component.html',
  styleUrls: ['./foro.component.scss'],
  standalone: true,

  imports: [
    CommonModule    // CGV-Permite usar directivas comunes de Angular
    , FormsModule     // CGV-Permite usar formularios
    , IonicModule ,
    LanguageComponent  // CGV-Permite usar componentes de Ionic como IonContent, IonItem, etc.
    , TranslateModule// CGV-Permite usar pipe 'translate'
  ]
})
export class ForoComponent implements OnInit {
  
  @ViewChild('selectLanguage') selectLanguage!: LanguageComponent;
  @ViewChild("topOfPage") topOfPage!: ElementRef;
  usuario = new User();
  publicacion: Publicacion = new Publicacion();
  publicaciones: any;
  constructor(private authService: AuthService,private translate:TranslateService, private api: APIClientService) {
    this.authService.usuarioAutenticado.subscribe(usuario => {
      this.usuario = usuario ? usuario : new User();
    });
  }

  ngOnInit() {
    addIcons({ trashOutline });
    addIcons({ pencilOutline });
    this.api.listaPublicaciones.subscribe((publicaciones) => {
      publicaciones.reverse();
      this.publicaciones = publicaciones;
    });

    this.cargarPublicaciones();
  }
  IonViewWillEnter() {
    this.selectLanguage.setCurrentLanguage();
  }

  darId(): string {
    return String(this.publicaciones.length + 1);
  }
  setPublicacion(id: string, correo: string, nombre: string, apellido: string, title: string, body: string) {
    this.publicacion.id = id;
    this.publicacion.email = correo;
    this.publicacion.nombre = nombre;
    this.publicacion.apellido = apellido;
    this.publicacion.title = title;
    this.publicacion.body = body;
  }
  cargarPublicaciones() {
    this.api.cargarPublicaciones();

  }
  limpiar(): void {
    this.publicacion.title = '';
    this.publicacion.body = '';
  }
  guardarPublicacion() {
    if (this.publicacion.title.trim() === '') {
      showAlertDUOC('Antes de hacer una publicacion debe llenar el titulo');
      return;
    }
    if (this.publicacion.body.trim() === '') {
      showAlertDUOC('Antes de hacer una publicacion debe llenar el contenido');
      return;
    }
    if (this.publicacion.id === '0') {
      this.crearPublicacion();
    } else {
      this.actualizarPublicacion();
    }
  }
  editarPublicacion(pub: any) {
    if (pub.email !== this.usuario.email) {
      showAlertDUOC('Solo puede editar las publicaciones a su nombre');
      return;
    }
    this.setPublicacion(pub.id, pub.email, pub.nombre, pub.apellido, pub.title, pub.body);

    this.actualizarPublicacion();
    this.topOfPage.nativeElement.scrollIntoView({ block: 'end', behavior: 'smooth' })
  }
  mensajePublicacion(accion: string, id: Publicacion) {
    showAlertDUOC(`La publicacion ${id} fue ${accion} correctamente`);
    this.cargarPublicaciones();
  }
  crearPublicacion() {
    this.publicacion.id = this.darId();
    this.publicacion.email = this.usuario.email;
    this.publicacion.nombre = this.usuario.firstName;
    this.publicacion.apellido = this.usuario.lastName;
    this.api.crearPublicacion(this.publicacion).subscribe({
      next: (publicacion) => this.mensajePublicacion('creada', publicacion.id),
      error: (error) => showToast('El servicio API Rest de Publicaciones no esta disponible')
    });

    this.topOfPage.nativeElement.scrollIntoView({ block: 'end', behavior: 'smooth' })
    this.limpiar();

  }
  actualizarPublicacion() {

    this.api.actualizarPublicacion(this.publicacion).subscribe({
      next: (publicacion) => this.mensajePublicacion('actualizada', publicacion.id),
      error: (error) => showToast(`El servicio API Rest de Publicaciones no esta disponible:${error}`)
    });

    this.topOfPage.nativeElement.scrollIntoView({ block: 'end', behavior: 'smooth' })

  }
  eliminarPublicacion(pub: any) {

    console.log('ID de la publicación que se va a eliminar:', this.usuario.email);
    if (pub.email !== this.usuario.email) {
      showAlertDUOC('Solo puede eliminar las publicaciones a su nombre');
      return;
    }
    console.log('ID de la publicación que se va a eliminar:', pub.id);

    this.api.eliminarPublicacion(pub.id).subscribe({
      next: (publicacion) => this.mensajePublicacion('eliminada', pub.id),
      error: (error) => showToast(`El servicio API Rest de Publicaciones no esta disponible: ${error}`)
    });
    this.limpiar();

    this.topOfPage.nativeElement.scrollIntoView({ block: 'end', behavior: 'smooth' })
  }
}


