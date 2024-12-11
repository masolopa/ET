import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LanguageComponent } from '../language/language.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { User } from 'src/app/model/user';
import { DatabaseService } from 'src/app/services/database.service';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';
import { showAlertDUOC, showAlertSuccess, showAlertYesNo } from 'src/app/tools/message-functions';
import { MessageEnum } from 'src/app/tools/message-enum';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  standalone: true,
 
  imports: [
    CommonModule    // CGV-Permite usar directivas comunes de Angular
    , FormsModule     // CGV-Permite usar formularios
    , IonicModule
    , LanguageComponent   // CGV-Permite usar componentes de Ionic como IonContent, IonItem, etc.
    , TranslateModule // CGV-Permite usar pipe 'translate'
  ]
})
export class UsuariosComponent implements OnInit {

  users: User[] = [];
  currentUser: User = new User();


  constructor(private authService: AuthService, private translate: TranslateService, private db: DatabaseService) {
    this.authService.usuarioAutenticado.subscribe((usuario) => {
      this.currentUser = usuario || new User();

    })
   
    this.db.userList.subscribe((users) => {
      // Mover al administrador al inicio
      this.users = users.sort((a, b) => {
        if (a.email === 'admin@duocuc.cl') return -1; // Admin primero
        if (b.email === 'admin@duocuc.cl') return 1;
        return 0;
      });
      console.log('Usuarios ordenados:', this.users);
    });
    this.db.readUsers();
    addIcons({ trashOutline });
  }

  ngOnInit() {

  }

  async deleteUser(usuario: User) {
    const confirm = await showAlertYesNo(`¿Estás seguro de que quieres eliminar a ${usuario.userName}?`);

    if (confirm === MessageEnum.YES) {
      try {
        this.db.deleteByUserName(usuario.userName);
        console.log(`Usuario eliminado: ${usuario.userName}`);
        showAlertDUOC('Usuario eliminado correctamente.')
      } catch (error) {
        console.error(`Error eliminando usuario: ${error}`);
        alert('Hubo un problema al eliminar al usuario.');
      }
    } else {
      console.log(`Eliminación cancelada para: ${usuario.userName}`);
    }
  }

}
