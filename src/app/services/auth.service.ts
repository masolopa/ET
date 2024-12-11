import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { showToast } from 'src/app/tools/message-functions';
import { Storage } from '@ionic/storage-angular';
import { CorreoPage } from '../pages/correo/correo.page';
import { TranslateService } from '@ngx-translate/core';
import { DatabaseService } from './database.service';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  keyUsuario = 'USUARIO_AUTENTICADO';
  usuarioAutenticado = new BehaviorSubject<User | null>(null);

  // La variable primerInicioSesion vale true cuando el usuario digita correctamente sus
  // credenciales y logra entrar al sistema por primera vez. Pero vale falso, si el 
  // usuario ya ha iniciado sesión, luego cierra la aplicación sin cerrar la sesión
  // y vuelve a entrar nuevamente. Si el usuario ingresa por primera vez, se limpian todas
  // las componentes, pero se dejan tal como están y no se limpian, si el suario
  // cierra al aplicación y la vuelve a abrir sin haber previamente cerrado la sesión.
  primerInicioSesion = new BehaviorSubject<boolean>(false);

  private isAdmin: boolean = false;

  constructor(private translate: TranslateService, private router: Router, private bd: DatabaseService, private storage: Storage) { }

  async inicializarAutenticacion() {
    await this.storage.create();
  }
  setRole(isAdmin: boolean) {
    this.isAdmin = isAdmin;
  }
  getRole(): boolean {
    return this.isAdmin;
  }
  async isAuthenticated(): Promise<boolean> {
    return await this.leerUsuarioAutenticado().then(usuario => {
      return usuario !== null;
    });
  }

  async leerUsuarioAutenticado(): Promise<User | null> {
    const usuario = await this.storage.get(this.keyUsuario) as User;
    this.usuarioAutenticado.next(usuario);
    return usuario;
  }

  guardarUsuarioAutenticado(usuario: User) {
    this.storage.set(this.keyUsuario, usuario);
    this.usuarioAutenticado.next(usuario);
  }

  eliminarUsuarioAutenticado(usuario: User) {
    this.storage.remove(this.keyUsuario);
    this.usuarioAutenticado.next(null);
  }
  async valCorreo(correo: string) {
    await this.bd.validarCorreo(correo).then(async (usuario: User | undefined) => {
      if (usuario) {
        this.eliminarUsuarioAutenticado(usuario);
        this.guardarUsuarioAutenticado(usuario);

        console.log(usuario);
        this.router.navigate(['/pregunta']);
      } else {
        // Navegar a la página de incorrecto
        this.router.navigate(['/incorrecto']);
      }
    });
  }
  async valPregunta(correo: string, respuesta: string) {
    await this.bd.validarCorreo(correo).then(async (usuario: User | undefined) => {
      if (usuario) {

        if (usuario.secretAnswer === respuesta) {

          this.eliminarUsuarioAutenticado(usuario);
          this.guardarUsuarioAutenticado(usuario);

          console.log(usuario);
          this.router.navigate(['/correcto']);
        } else {
          // Navegar a la página de incorrecto
          this.router.navigate(['/incorrecto']);
        }

      }
    });
  }
  async login(cuenta: string, password: string) {
    await this.storage.get(this.keyUsuario).then(async (usuarioAutenticado) => {
      if (usuarioAutenticado) {
        this.usuarioAutenticado.next(usuarioAutenticado);
        this.primerInicioSesion.next(false); // Avisar que no es el primer inicio de sesión
        this.router.navigate(['/inicio']);
      } else {
        await this.bd.findUser(cuenta, password).then(async (usuario: User | undefined) => {
          const esAdmin = cuenta === 'admin'; // Ejemplo simple
          this.setRole(esAdmin);
          if (usuario) {
            showToast(`¡Bienvenido(a) ${usuario.firstName} ${usuario.lastName}!`);
            this.guardarUsuarioAutenticado(usuario);
            this.primerInicioSesion.next(true);// Avisar que es el primer inicio de sesión
            this.router.navigate(['/inicio']);
          } else {

            showToast(`La cuenta o la contraseña son incorrectos`);

            this.router.navigate(['/ingreso']);
          }
        });
      }
    });
  }

  async logout() {

    this.leerUsuarioAutenticado().then((usuario) => {
      if (usuario) {
        showToast(`¡Hasta pronto ${usuario.firstName} ${usuario.lastName}!`);
        this.eliminarUsuarioAutenticado(usuario);
      }

      const currentLanguage = this.translate.currentLang;
      localStorage.setItem('preferredLanguage', currentLanguage)
      this.router.navigate(['/ingreso']);
    })
  }
  async navigatelogin() {
    this.leerUsuarioAutenticado().then((usuario) => {
      if (usuario) {
        this.eliminarUsuarioAutenticado(usuario);
      }
      this.router.navigate(['/ingreso']);
    })
  }


}
