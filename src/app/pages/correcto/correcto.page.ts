
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { LanguageComponent } from 'src/app/components/language/language.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-correcto',
  templateUrl: './correcto.page.html',
  styleUrls: ['./correcto.page.scss'],
  standalone: true,

  imports: [IonicModule,CommonModule, FormsModule,LanguageComponent,TranslateModule]
})
export class CorrectoPage implements OnInit {
  
  @ViewChild('selectLanguage') selectLanguage!: LanguageComponent;
  usuario: User = new User(); 

  constructor(private authService: AuthService,private translate: TranslateService) {
     this.authService.usuarioAutenticado.subscribe(usuario => {
    if (usuario) { // Verificar que el usuario no sea nulo antes de asignar
      this.usuario = usuario;
    }
  }); }
  ionViewWillEnter() {
    if (this.selectLanguage) {
      this.selectLanguage.setCurrentLanguage();
    } else {
      
    }
  }
  async navigateLogin() {
    this.authService.navigatelogin();
  }
  ngOnInit() {
  }

}
